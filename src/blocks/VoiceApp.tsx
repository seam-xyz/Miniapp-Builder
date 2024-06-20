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
import { StopCircleRounded } from '@mui/icons-material';
import { nn } from 'date-fns/locale';


/*

  ----------  VoiceApp TYPES  ----------

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
  isPlayback: boolean;
  normalMatch?: boolean;
  smallMatch?: boolean;
  xsMatch?: boolean;
}


/*

  ----------  VoiceApp DATA  ----------

*/

// Default values for audio context
const defaultAudioContext: AudioContextProps = { isRecording: false, setIsRecording: () => { }, mediaRecorder: { current: null }, canvasId: ""}

// Instantiate react context
const audioContext = createContext<AudioContextProps>(defaultAudioContext);

const { Provider: AudioProvider } = audioContext;

// Audio Context Component- not stored in VoiceApp COMPONENTS because it is just a context wrapper
const AudioCtx = ({ children }: AudioProviderProps) => {
  // Great place to define state and refs that are needed throughout the app
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null)

  // Need a way to connect a specific canvas to specific play button
  // By defining a canvas id in the wrapper, 
  // the canvas can only be accessed by the play button using the corresponding id
  const canvasId = useId()

  return (
    <AudioProvider value={{ isRecording, setIsRecording, mediaRecorder, canvasId }}>
      {children}
    </AudioProvider>
  )

}

// This function is called twice before the user posts, 
// once when a user clicks record and audio stream is started, 
// and again when the audio is played back in the preview 
const start = ({ node, context, getPlayable, renderErrorState, canvasId, isPlayback, normalMatch, xsMatch, smallMatch }: StartProps) => {

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

  // Get a canvas defined with the corresponding canvas ID 
  let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) {
    console.error("The audio visualizer (canvas) is missing");
    return renderErrorState();
  }

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  let canvasCtx = canvas.getContext("2d");


  // This function draws an oscilloscope of the current audio source
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

    // Oscilliscope bars

    // Affects the number of bars and their width
    // In order for the oscilliscope to be responsive, xs, small, and normal breakpoints were defined
    let barWidth = xsMatch ? (canvas.width / bufferLength) * 25 : smallMatch ? (canvas.width / bufferLength) * 15 : normalMatch ? (canvas.width / bufferLength) * 10 : (canvas.width / bufferLength) * 10
    
    let barHeight;
    x = 0;
    analyser.getByteFrequencyData(frequencyData);

    for (let i = 0; i < bufferLength; i++) {
      // Affects the amplitude of the displayed bars (height)
      // Again in order for the oscilliscope to be responsive, xs, small, and normal breakpoints were defined
      barHeight = !isPlayback ? frequencyData[i] * 1 : xsMatch ? frequencyData[i] * 0.2 : smallMatch ? frequencyData[i] * 0.25 : normalMatch ? frequencyData[i] * 0.30 : frequencyData[i] * 0.35;

      canvasCtx.fillStyle = "rgb(255, 255, 255)";
      canvasCtx.fillRect(x, (canvas.height / 2) - (barHeight / 2), barWidth, barHeight);

      x += barWidth + 1;
    }

    

    // Check if the audio is still playing/playable
    if (getPlayable(node, context)) {
      // If so, we need to call the draw function to redraw the new oscilliscope
      requestAnimationFrame(draw);
    } else {
      // Else, we need to clear/reset the canvas
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    }

  }

  // Initial call to draw function
  draw();

}


/*

  ----------  VoiceApp COMPONENTS  ----------

*/


// Componet that is rendered in the preview screen and in users feeds
// We pass in the url of the saved audio data
const PostInFeed = ({ url, renderErrorState }: PostInFeedProps) => {
  // Define state for if the audio is being played back
  const [playing, setPlaying] = useState<boolean>(false)

  // Variables for each breakpoint
  const normalMediaMatch: MediaQueryList = window.matchMedia("(max-width: 599px )")
  const smallMediaMatch: MediaQueryList = window.matchMedia("(max-width: 499px )")
  const xsMediaMatch: MediaQueryList = window.matchMedia("(max-width: 399px )")

  // Stateful booleans for breakpoints
  const [normalMatch, setNormalMatch] = useState<boolean>(normalMediaMatch.matches)
  const [smallMatch, setSmallMatch] = useState<boolean>(smallMediaMatch.matches)
  const [xsMatch, setXSMatch] = useState<boolean>(xsMediaMatch.matches)

  // These useEffects listen to the media width and set booleans accordingly
  useEffect(() => {
    const handler = (e: any) => setNormalMatch(e.matches)
    normalMediaMatch.addEventListener("change", handler)
    return () => normalMediaMatch.removeEventListener("change", handler)
  })
  useEffect(() => {
    const handler = (e: any) => setSmallMatch(e.matches)
    smallMediaMatch.addEventListener("change", handler)
    return () => normalMediaMatch.removeEventListener("change", handler)
  })
  useEffect(() => {
    const handler = (e: any) => setXSMatch(e.matches)
    xsMediaMatch.addEventListener("change", handler)
    return () => normalMediaMatch.removeEventListener("change", handler)
  })


  // Here we grab the canvas id from the context
  const { canvasId } = useContext(audioContext)
  
  // Each audio player needs it's own id as well
  const audioPlayerId = useId()
  
  const playback = () => {
    const context = new AudioContext()
    const audio = new Audio();
    // Set the new audio to the recorded audio url
    audio.src = url;
    
    // define the audio node using the new context and audio
    const node = context.createMediaElementSource(audio)

    audio.play();

    // Set a variable for oscilliscope responsiveness between recording screen and preview screen
    const isPlayback = true 

    // Start drawing the oscilliscopes on the canvas
    start({ node, context, getPlayable: (node) => !(node as MediaElementAudioSourceNode).mediaElement.ended, renderErrorState, canvasId, isPlayback, normalMatch, smallMatch, xsMatch })
  }

  return (

    <div style={{ backgroundColor: 'black', borderRadius: '125px', width: "100%", height: 'fit-content', aspectRatio: "5 / 1" }} >

      <div style={{ height: "100%", width: "100%", display: "flex" }}>
        <div style={{
          color: 'black', backgroundColor: 'none', display: 'flex', flexDirection: "row", width: '100%'
        }}>
          <div style={{ padding: "8px 12px", display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center', width: "100%", height: "100%" }} >
           
            {/* Invisible audio tag */}
            <audio id={audioPlayerId} src={url} onPlay={() => { setTimeout(playback, 100) }} onPlaying={() => setPlaying(true)} onEnded={() => setPlaying(false)} />
            
            {/* Div (button) for playing audio */}
            <div onClick={() => {
                const audio = document.getElementById(audioPlayerId) as HTMLMediaElement
                audio.play();
            }} style={{cursor: "pointer"}}>
              {playing ? <StopCircleRounded style={{ color: 'white'}} sx={{fontSize: {xs: "50px", sm: "80px"}}} /> : <PlayCircleIcon style={{ color: 'white'}} sx={{fontSize: {xs: "50px", sm: "80px"}}} />}
            </div>

            {/* Current audio time */}
            <div style={{color: 'white', padding: "18px"}}>0:00</div>

            {/* Canvas */}
            <div style={{ color: 'white', height: "100%", width: "100%" }}>
              <canvas style={{ color: 'white', width: "100%", height: "100%", display: `${playing ? "" : "none"}` }} id={canvasId}></canvas>
            </div>
           
           {/* Full audio duration  */}
            <div style={{color: "white", padding: "18px"}}>0:00</div>
          
          </div>
        </div>
      </div> 
    </div>
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

      const isPlayback = false;
      start({ node, context, getPlayable: () => currentMediaRecorder.state === "recording", renderErrorState, canvasId, isPlayback })
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

  ----------  SEAM CLASS  ----------

*/


export default class VoiceBlock extends Block {

  // This method returns the component that seam users see in their feeds
  render() {
    return  (
    <AudioCtx>
      <PostInFeed url={this.model.data["audio"]} renderErrorState={this.renderErrorState} />
    </AudioCtx>
    )
  }

  // This method returns the component that seam users see when 
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

  // NOTE: I would like to pass at least a message into this but the block class forbids it...
  // This method gracefully returns an error to the user, I do not know what it looks like 
  // because I couldn't get it to render in the testing environment
  renderErrorState() {
    return (
      <h1>Unexpected Error, Try Reloading</h1>
    )
  }
}