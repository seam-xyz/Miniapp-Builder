import Block from './Block'
import { BlockModel } from './types'
import './BlockStyles.css'
import { createContext, SetStateAction, useContext, useEffect, useRef, useState, Dispatch, ReactNode } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import MicIcon from '@mui/icons-material/Mic';
import Fab from '@mui/material/Fab';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
/*

  TYPES

*/

type AudioContextProps = {
  isRecording: boolean;
  setIsRecording: Dispatch<SetStateAction<boolean>>
  mediaRecorder: React.MutableRefObject<MediaRecorder | null>
}

type AudioButtonProps = {
  onSave: (url: string) => void;
}

type PostInFeedProps = {
  url: string
}

type AudioProviderProps = {
  children: ReactNode;
}

type StartProps = {
  node: AudioNode
  context: AudioContext
  getPlayable: (node: AudioNode, context: AudioContext) => boolean
}

/*

  VoiceApp DATA

*/

const defaultAudioContext = { isRecording: false, setIsRecording: () => { }, mediaRecorder: { current: null } }

const audioContext = createContext<AudioContextProps>(defaultAudioContext);

const { Provider: AudioProvider } = audioContext;

const AudioCtx = ({ children }: AudioProviderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null)


  return (
    <AudioProvider value={{ isRecording, setIsRecording, mediaRecorder }}>
      {children}
    </AudioProvider>
  )

}

const start = ({ node, context, getPlayable }: StartProps) => {
  // Hi, I'm doing the drawing
  let analyser = context.createAnalyser();
  analyser.smoothingTimeConstant = .9;
  node.connect(analyser);

  // ...

  analyser.fftSize = 2048;
  let bufferLength = analyser.frequencyBinCount;
  let timeDomainData = new Uint8Array(bufferLength);
  let frequencyData = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(timeDomainData);
  analyser.getByteFrequencyData(frequencyData);

  // Get a canvas defined with ID "oscilloscope"
  let canvas = document.getElementById("oscilloscope") as HTMLCanvasElement;
  if (!canvas) return alert("The audio visualizer is missing! Reload.")
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  let canvasCtx = canvas.getContext("2d");


  // draw an oscilloscope of the current audio source
  const draw = () => {
    if (!canvasCtx) return alert("The audio visualizer is missing! Reload.")
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = "rgb(255, 255, 255)";

    canvasCtx.beginPath();

    let sliceWidth = (canvas.width * 1.0) / bufferLength;
    let x = 0;

    analyser.getByteTimeDomainData(timeDomainData);

    for (let i = 0; i < bufferLength; i++) {
      let v = timeDomainData[i] / 128.0;
      let y = (v * canvas.height) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    //bars
    // Affects the number of bars and their width
    let barWidth = (canvas.width / bufferLength) * 5;
    let barHeight;
    x = 0;
    analyser.getByteFrequencyData(frequencyData);

    for (let i = 0; i < bufferLength; i++) {
      // Affects the amplitude of the displayed bars (height)
      barHeight = frequencyData[i] * .5;

      canvasCtx.fillStyle = "rgb(255, 255, 255)";
      canvasCtx.fillRect(x, (canvas.height / 2) - (barHeight / 2), barWidth, barHeight);

      x += barWidth + 1;
    }

    if (getPlayable(node, context)) {
      requestAnimationFrame(draw);
    } else {
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    }

  }

  draw();
}

/*

  VoiceApp COMPONENTS

*/

// when user clicks play on the audio, it sets recording the true and the visual starts.

const PostInFeed = ({ url }: PostInFeedProps) => {
  // const audioTime = document.getElementById("player") as HTMLMediaElement
  // const duration = audioTime.duration.toString()

  const playback = () => {
    const context = new AudioContext()
    const audio = new Audio();

    audio.src = url;

    const node = context.createMediaElementSource(audio)

    audio.play();

    start({ node, context, getPlayable: (node) => !(node as MediaElementAudioSourceNode).mediaElement.ended })
  }




  return (

    <Card style={{ backgroundColor: 'black', borderRadius: '30px', width: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} sx={{ height: { xs: "350px", md: "600px", lg: "600px" } }} >
      <CardContent style={{ backgroundColor: 'black', padding: '24px' }}>
        <Box style={{
          color: 'black', backgroundColor: 'none', display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'
        }}>
          {/* <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <DeleteOutlineIcon style={{ color: 'black', backgroundColor: 'white', borderRadius: '50px' }} />
          </div> */}
          <div onClick={() => {
            const audio = document.getElementById("player") as HTMLMediaElement
            audio.play();
          }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
            <PlayCircleIcon sx={{ fontSize: 90 }} style={{ color: 'white', backgroundColor: '', borderRadius: '50px', margin: '20px' }} />
          </div>
          <div style={{ color: 'white' }}>
            <audio id='player' src={url} onPlay={playback} />

            <canvas style={{ color: 'white', width: "100%", height: "100%" }} id="oscilloscope"></canvas>

          </div>
  
        </Box>
      </CardContent>

    </Card>
  )

}

const AudioButtons = ({ onSave }: AudioButtonProps) => {
  const { isRecording, setIsRecording, mediaRecorder } = useContext(audioContext)



  const [audio, setAudio] = useState<string>("")

  const initializeDevice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaRecorder.current = new MediaRecorder(stream);
    } catch (err) {
      alert("The recorder couldn't be set up, please reload")
    }
  };

  useEffect(() => { initializeDevice() }, [])

  const toggleRecord = () => {
    if (isRecording) {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
        setIsRecording(false);

        mediaRecorder.current.ondataavailable = (e) => {
          const blob = new Blob([e.data], { type: "audio/webm;codecs=opus" });
          const audioURL = URL.createObjectURL(blob);
          setAudio(audioURL)
        };

        return
      }
    }

    if (mediaRecorder.current) {
      mediaRecorder.current.start()
      setIsRecording(true);

      // Get media recorder
      const currentMediaRecorder = mediaRecorder.current

      // Get the stream
      const stream = currentMediaRecorder.stream;

      // Create a new context
      let context = new AudioContext();

      // Create a new node
      let node = context.createMediaStreamSource(stream);


      start({ node, context, getPlayable: () => currentMediaRecorder.state === "recording" })
    }
  }

  const handleSubmit = () => {
    onSave(audio)
  }

  return (
    <Box style={{
      backgroundColor: 'none', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '20px', width: '100%'
    }} >
      {/* Microphone button */}
      <Fab onClick={toggleRecord} sx={{ width: { xs: "150px", md: "250px", lg: "250px" }, height: { xs: "150px", md: "250px", lg: "250px" } }}
        style={
          isRecording ?
            { backgroundColor: 'white', border: "5px solid black" } :
            { backgroundColor: "black" }
        }>
        <MicIcon style={isRecording ? { color: 'black', } : { color: 'white', }} />
      </Fab>
      {/* Post button */}
      <Fab sx={{
        width: { xs: "75px", md: "150px", lg: "150px" }, height: { xs: "75px", md: "150px", lg: "150px" }, color: 'white', padding: '20px'
      }} style={{
        backgroundColor: 'red'
      }} onClick={() => {
        audio === "" ? alert("Record some audio first") : handleSubmit();
      }}>
        Preview
      </Fab>

    </Box>
  )
}

const AudioCard = () => {

  return (
    <Card style={{ backgroundColor: 'black', borderRadius: '30px', width: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} sx={{ height: { xs: "350px", md: "600px", lg: "600px" } }} >
      <CardContent style={{ backgroundColor: 'black', padding: '24px' }}>
        <Box style={{
          color: 'black', backgroundColor: 'none', display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'
        }}>
          <canvas style={{ color: 'white', width: "100%", height: "100%" }} id="oscilloscope"></canvas>
        </Box>
      </CardContent>
    </Card>
  )
}

/* 

  SEAM CLASS

*/

export default class VoiceBlock extends Block {

  render() {
    return <PostInFeed url={this.model.data["audio"]} />;
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const handleSave = (audio: string) => {
      this.model.data["audio"] = audio
      done(this.model)
    }

    return (
      <AudioCtx>
        <AudioCard />
        <AudioButtons onSave={handleSave} />
      </AudioCtx>
    )
  }

  renderErrorState() {
    // Shouldn't have to use this anywhere because all types should be properly narrowed
    return (
      <h1>Unexpected Error, Try Reloading</h1>
    )
  }
}