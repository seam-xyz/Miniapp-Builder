import React, { useState, useRef, useEffect } from 'react';
import { ComposerComponentProps, BlockModel, FeedComponentProps } from './types';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import MicIcon from '@mui/icons-material/Mic';
import { CircularProgress } from '@mui/material';
import { StopCircleRounded, PlayCircleRounded } from '@mui/icons-material';
import { useRecordAudio } from './utils/RecordAudio';

export const VoiceComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [uploading, setUploading] = useState(false);
  const { startRecording, stopRecording, isRecording, uploadProgress, uploadAudioToFirebase } = useRecordAudio();

  const toggleRecord = async () => {
    if (isRecording) {
      try {
        const recordedAudio = await stopRecording();
        const audioUrl = await uploadAudioToFirebase(recordedAudio);
        onFinalize(audioUrl);
      } catch (error) {
        console.error('Recording failed:', error);
        alert('Recording failed');
      } finally {
        setUploading(false);
      }
    } else {
      await startRecording();
    }
  };

  const onFinalize = (audioUrl: string) => {
    const updatedModel: BlockModel = {
      ...model,
      data: {
        ...model.data,
        audioUrl,
      },
    };
    done(updatedModel);
  };

  return (
    <Box style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      {uploading ? (
        <CircularProgress variant="determinate" value={uploadProgress} />
      ) : (
        <Fab
          onClick={toggleRecord}
          sx={{ width: '150px', height: '150px' }}
          style={isRecording ? { backgroundColor: 'red', border: '5px solid black' } : { backgroundColor: 'black' }}
          disabled={uploading}
        >
          <MicIcon style={isRecording ? { color: 'black' } : { color: 'white' }} />
        </Fab>
      )}
    </Box>
  );
};

// VoiceFeedComponent with Oscilloscope
export const VoiceFeedComponent = ({ model }: FeedComponentProps) => {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (model.data['audioUrl']) {
      setupAudio(model.data['audioUrl']);
    }
    return () => {
      cleanupAudio();
    };
  }, [model.data]);

  const setupAudio = async (audioUrl: string) => {
    try {
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();

      // Create a new AudioContext
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);

      // Create a new AnalyserNode for each new AudioContext
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;

      // Set audio duration
      setDuration(audioBufferRef.current.duration);
      setIsAudioLoaded(true);
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  const cleanupAudio = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    startTimeRef.current = null;
    setIsAudioLoaded(false);
  };

  const drawOscilloscope = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const timeDomainData = new Uint8Array(bufferLength);
    const frequencyData = new Uint8Array(bufferLength);

    const draw = () => {
        animationRef.current = requestAnimationFrame(draw);

        analyser.smoothingTimeConstant = 0.85; // Higher smoothing for smoother visualization
        analyser.getByteTimeDomainData(timeDomainData);
        analyser.getByteFrequencyData(frequencyData);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.beginPath();

        const sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = timeDomainData[i] / 128.0;
            const y = (v * canvas.height) / 2;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        // Draw frequency bars
        const barWidth = Math.max(sliceWidth * 5, 2); // Adjust bar width to make it more prominent
        let barHeight;
        x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = Math.min(frequencyData[i] / 1.5, canvas.height / 2); // Adjust height to be more visible

            ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; // Softer bar color
            ctx.fillRect(x, canvas.height / 2 - barHeight / 2, barWidth, barHeight);

            x += barWidth + 1;
        }
    };

    draw();
  };

  const togglePlayPause = async () => {
    if (!isAudioLoaded) return;

    if (playing) {
      stopAudio();
    } else {
      playAudio();
    }

  };

  const playAudio = () => {
    if (audioContextRef.current && audioBufferRef.current && analyserRef.current) {
      sourceNodeRef.current = audioContextRef.current.createBufferSource();
      sourceNodeRef.current.buffer = audioBufferRef.current;
      sourceNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);

      sourceNodeRef.current.start(0);
      startTimeRef.current = audioContextRef.current.currentTime;

      sourceNodeRef.current.onended = () => {
        setPlaying(false);
        setCurrentTime(0);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };

      drawOscilloscope();

      // Start updating current time every 100ms
      intervalRef.current = window.setInterval(() => {
        updateCurrentTime();
      }, 100);

      setPlaying(true);
    }
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setPlaying(false);
    setCurrentTime(0);
    startTimeRef.current = null;
  };

  const updateCurrentTime = () => {
    if (audioContextRef.current && startTimeRef.current !== null) {
      const elapsedTime = audioContextRef.current.currentTime - startTimeRef.current;
      setCurrentTime(Math.min(elapsedTime, duration));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="bg-seam-black flex items-center justify-center rounded-[124px] w-[95%] p-2 mx-4" style={{ height: 'fit-content', aspectRatio: "5 / 1" }}>
      <div className="flex items-center justify-center h-full w-[95%]" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <div
          onClick={togglePlayPause}
          style={{
            cursor: !isAudioLoaded ? 'not-allowed' : 'pointer',
            marginRight: '16px',
            opacity: !isAudioLoaded ? 0.5 : 1,
          }}
        >
          {playing ? (
            <StopCircleRounded style={{ color: 'white' }} sx={{ fontSize: '50px' }} />
          ) : (
            <PlayCircleRounded style={{ color: 'white' }} sx={{ fontSize: '50px' }} />
          )}
        </div>
        <div className="text-white mr-4 w-auto">{formatTime(currentTime)}</div>
        <canvas ref={canvasRef} style={{ flex: 1, height: '50%' }} />
        <div className="text-white mx-4 w-auto">{formatTime(duration)}</div>
      </div>
    </div>
  );
};