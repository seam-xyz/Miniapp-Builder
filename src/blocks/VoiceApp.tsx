import React, { useState, useRef, useEffect } from 'react';
import { ComposerComponentProps, BlockModel, FeedComponentProps } from './types';
import { Microphone } from '@mozartec/capacitor-microphone';
import { FirebaseStorage } from '@capacitor-firebase/storage';
import { nanoid } from 'nanoid';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import MicIcon from '@mui/icons-material/Mic';
import { CircularProgress } from '@mui/material';
import { Capacitor } from '@capacitor/core';
import { StopCircleRounded, PlayCircleRounded } from '@mui/icons-material';
import { useRecordAudio } from './utils/RecordAudio';

export const VoiceComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const { startRecording, stopRecording, isRecording } = useRecordAudio();

  const toggleRecord = async () => {
    if (isRecording) {
      try {
        const recordedAudio = await stopRecording();
        uploadToFirebase(recordedAudio);
      } catch (error) {
        console.error('Recording failed:', error);
        alert('Recording failed');
      }
    } else {
      await startRecording();
    }
  };

  const uploadToFirebase = async (recordedAudio: { path?: string; webPath?: string; dataUrl: string }) => {
    try {
      setUploading(true);
      const name = nanoid();
      const dataPath = `voice-notes/${name}.${Capacitor.getPlatform() === 'web' ? 'webm' : 'm4a'}`;
      let uploadData: Blob | string;

      if (Capacitor.getPlatform() === 'web') {
        const response = await fetch(recordedAudio.dataUrl);
        uploadData = await response.blob();
      } else {
        uploadData = recordedAudio.path!;
      }

      await FirebaseStorage.uploadFile(
        {
          path: dataPath,
          blob: Capacitor.getPlatform() === 'web' ? (uploadData as Blob) : undefined,
          uri: Capacitor.getPlatform() !== 'web' ? (uploadData as string) : undefined,
        },
        async (event, error) => {
          if (error) {
            console.error('Upload failed:', error);
            setUploading(false);
            return;
          }
          if (event) {
            setUploadProgress(event.progress * 100);
          }

          if (event?.completed) {
            const { downloadUrl } = await FirebaseStorage.getDownloadUrl({ path: dataPath });
            onFinalize(downloadUrl);
            setUploading(false);
          }
        }
      );
    } catch (error) {
      console.error('Error during upload:', error);
      setUploading(false);
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
          style={isRecording ? { backgroundColor: 'white', border: '5px solid black' } : { backgroundColor: 'black' }}
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

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

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;

      // Set audio duration
      setDuration(audioBufferRef.current.duration);

      // Set up audio element
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.addEventListener('timeupdate', updateCurrentTime);
        audioRef.current.addEventListener('loadedmetadata', () => {
          setDuration(audioRef.current!.duration);
        });
      }
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  const cleanupAudio = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (audioRef.current) {
      audioRef.current.removeEventListener('timeupdate', updateCurrentTime);
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const updateCurrentTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const drawOscilloscope = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(255, 255, 255)';

      ctx.beginPath();
      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  };
  
  const togglePlayPause = () => {
    if (audioRef.current && audioContextRef.current && audioBufferRef.current && analyserRef.current) {
      if (playing) {
        audioRef.current.pause();
        if (sourceNodeRef.current) {
          sourceNodeRef.current.stop();
        }
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      } else {
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }

        if (sourceNodeRef.current) {
          sourceNodeRef.current.disconnect();
        }
        sourceNodeRef.current = audioContextRef.current.createBufferSource();
        sourceNodeRef.current.buffer = audioBufferRef.current;
        sourceNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);

        sourceNodeRef.current.start(0);
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setPlaying(false);
        });

        drawOscilloscope();

        sourceNodeRef.current.onended = () => {
          setPlaying(false);
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
        };
      }
      setPlaying(!playing);
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
        <audio 
          ref={audioRef} 
          onEnded={() => {
            setPlaying(false);
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
            }
          }} 
          onError={(e) => {
            console.error('Audio error:', e);
            setPlaying(false);
          }}
        />
        <div onClick={togglePlayPause} style={{ cursor: "pointer", marginRight: '16px' }}>
          {playing ? 
            <StopCircleRounded style={{ color: 'white' }} sx={{ fontSize: "50px" }} /> : 
            <PlayCircleRounded style={{ color: 'white' }} sx={{ fontSize: "50px" }} />
          }
        </div>
        <div className="text-white mr-4 w-auto">
          {formatTime(currentTime)}
        </div>
        <canvas ref={canvasRef} style={{ flex: 1, height: '50%' }} />
        <div className="text-white mx-4 w-auto">
          {formatTime(duration)}
        </div>
      </div>
    </div>
  );
};