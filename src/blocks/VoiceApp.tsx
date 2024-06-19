import Block from './Block'
import { BlockModel } from './types'
import './BlockStyles.css'
import { createContext, SetStateAction, useContext, useEffect, useRef, useState, Dispatch, ReactNode, useId } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import MicIcon from '@mui/icons-material/Mic';
import Fab from '@mui/material/Fab';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
/*

  TYPES

*/

type AudioContextProps = {
  isRecording: boolean;
  setIsRecording: Dispatch<SetStateAction<boolean>>;
  mediaRecorder: React.MutableRefObject<MediaRecorder | null>;
  canvasId: string;
}

type AudioButtonProps = {
  renderErrorState: () => JSX.Element;
  onSave: (url: string) => void;
}

type PostInFeedProps = {
  url: string;
  renderErrorState: () => JSX.Element;
}

type AudioProviderProps = {
  children: ReactNode;
}

type StartProps = {
  renderErrorState: () => JSX.Element;
  node: AudioNode;
  context: AudioContext;
  getPlayable: (node: AudioNode, context: AudioContext) => boolean;
  canvasId: string;
}

/*

  VoiceApp DATA

*/

// canvas id context


const defaultAudioContext: AudioContextProps = { isRecording: false, setIsRecording: () => { }, mediaRecorder: { current: null }, canvasId: ""}

const audioContext = createContext<AudioContextProps>(defaultAudioContext);

const { Provider: AudioProvider } = audioContext;

const AudioCtx = ({ children }: AudioProviderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const canvasId = useId()

  return (
    <AudioProvider value={{ isRecording, setIsRecording, mediaRecorder, canvasId }}>
      {children}
    </AudioProvider>
  )

}

const start = ({ node, context, getPlayable, renderErrorState, canvasId }: StartProps) => {

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
  let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) {
    console.error("The audio visualizer (canvas) is missing");
    return renderErrorState();
  }
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  let canvasCtx = canvas.getContext("2d");


  // draw an oscilloscope of the current audio source
  const draw = () => {
    if (!canvasCtx) {
      console.error("The audio visualizer (canvas) is missing");
      return renderErrorState();
    }
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

    // bars
    // Affects the number of bars and their width
    let barWidth = (canvas.width / bufferLength) * 5;
    let barHeight;
    x = 0;
    analyser.getByteFrequencyData(frequencyData);

    for (let i = 0; i < bufferLength; i++) {
      // Affects the amplitude of the displayed bars (height)
      barHeight = frequencyData[i] * 1;

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

const PostInFeed = ({ url, renderErrorState }: PostInFeedProps) => {
  const [playing, setPlaying] = useState<boolean>(false)

  const { canvasId } = useContext(audioContext)
  console.log("canvas id set in post in feed:", canvasId);
  

  const audioPlayerId = useId()


  const playback = () => {
    const context = new AudioContext()
    const audio = new Audio();

    audio.src = url;

    const node = context.createMediaElementSource(audio)

    audio.play();

    start({ node, context, getPlayable: (node) => !(node as MediaElementAudioSourceNode).mediaElement.ended, renderErrorState, canvasId })
  }

  return (

    <Card style={{ backgroundColor: 'black', borderRadius: '30px', width: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} sx={{ height: { xs: "350px", md: "400px", lg: "400px" } }} >
      <CardContent style={{ backgroundColor: 'black', padding: '24px', height: "100%", width: "100%", display: "flex" }}>
        <Box style={{
          color: 'black', backgroundColor: 'none', display: 'flex', justifyContent: 'center', width: '100%'
        }}>
          <div onClick={() => {
            const audio = document.getElementById(audioPlayerId) as HTMLMediaElement
            console.log("this is the audio:", audio)
            audio.play();
          }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: "100%", height: "100%" }} >
            <audio id={audioPlayerId} src={url} onPlay={() => { setTimeout(playback, 100) }} onPlaying={() => setPlaying(true)} onEnded={() => setPlaying(false)} />

            <div style={{ color: 'white', display: `${playing ? "" : "none"}`, height: "100%", width: "100%" }}>
              <canvas style={{ color: 'white', width: "100%", height: "100%" }} id={canvasId}></canvas>
            </div>
            <PlayCircleIcon sx={{ fontSize: { xs: "100px", md: "200px", lg: "200px" } }} style={{ color: 'white', backgroundColor: '', borderRadius: '50px', margin: '20px', display: `${playing ? "none" : ""}` }} />
          </div>
        </Box>
      </CardContent>
    </Card>
  )

}

const AudioButtons = ({ onSave, renderErrorState }: AudioButtonProps) => {
  const { isRecording, setIsRecording, mediaRecorder, canvasId } = useContext(audioContext)

  const [audio, setAudio] = useState<string>("")

  const initializeDevice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaRecorder.current = new MediaRecorder(stream);
    } catch (err) {
      console.error(err);
      renderErrorState();
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
          setAudio(audioURL);
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


      start({ node, context, getPlayable: () => currentMediaRecorder.state === "recording", renderErrorState, canvasId })
    }
  }

  const handleSubmit = () => {
    onSave(audio)
  }

  return (
    <Box style={{
      backgroundColor: 'none', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '20px', width: '100%'
    }} >
      <Fab onClick={toggleRecord} sx={{ width: { xs: "150px", md: "250px", lg: "250px" }, height: { xs: "150px", md: "250px", lg: "250px" } }}
        style={
          isRecording ?
            { backgroundColor: 'white', border: "5px solid black" } :
            { backgroundColor: "black" }
        }>
        <MicIcon style={isRecording ? { color: 'black', } : { color: 'white', }} />
      </Fab>
      <Fab sx={{
        width: { xs: "75px", md: "150px", lg: "150px" }, height: { xs: "75px", md: "150px", lg: "150px" }, color: 'white', padding: '20px'
      }} style={{
        backgroundColor: 'red'
      }} onClick={() => {
        audio === "" ? renderErrorState() : handleSubmit();
      }}>
        Preview
      </Fab>

    </Box>
  )
}

const AudioCard = () => {
  const { canvasId } = useContext(audioContext)

  return (
    <Card style={{ backgroundColor: 'black', borderRadius: '30px', width: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} sx={{ height: { xs: "350px", md: "400px", lg: "400px" } }} >
      <CardContent style={{ backgroundColor: 'black', padding: '24px', height: "100%", width: "100%" }}>
        <Box style={{
          color: 'black', backgroundColor: 'none', display: 'flex', justifyContent: 'space-between', width: '100%', height: "100%", alignItems: 'center'
        }}>
          <canvas style={{ color: 'white', width: "100%", height: "100%" }} id={canvasId}></canvas>
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
    return  (
    <AudioCtx>
      <PostInFeed url={this.model.data["audio"]} renderErrorState={this.renderErrorState} />
    </AudioCtx>
    )
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const handleSave = (audio: string) => {
      this.model.data["audio"] = audio
      done(this.model)
    }

    return (
      <AudioCtx>
        <div style={{ maxWidth: "100vw", overflow: "visible", display: "flex", flexDirection: "column", height: "100%", alignItems: "center", justifyContent: "space-around" }}>
          <AudioCard />
          <AudioButtons onSave={handleSave} renderErrorState={this.renderErrorState} />
        </div>
      </AudioCtx>
    )
  }

  // I would like to pass at least a message into this but the block class forbids it...
  renderErrorState() {
    return (
      <h1>Unexpected Error, Try Reloading</h1>
    )
  }
}