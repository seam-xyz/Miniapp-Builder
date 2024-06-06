import Block from './Block'
import { BlockModel } from './types'
import './BlockStyles.css'
import { useEffect, useRef, useState } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import MicIcon from '@mui/icons-material/Mic';
import Fab from '@mui/material/Fab';

/*

  TYPES

*/

type AudioButtonProps = {
  onSave: (url: string) => void;
}

type PostInFeedProps = {
  url: string
}

/*

  VoiceApp COMPONENTS

*/

const PostInFeed = ({url}: PostInFeedProps) => {
  return (
    <audio controls src={url} />
  )
}

const AudioButtons = ({ onSave }: AudioButtonProps) => {
  const mediaRecorder = useRef<MediaRecorder | null>(null)

  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [audio, setAudio] = useState<string>("")

  const initializeDevice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaRecorder.current = new MediaRecorder(stream);
    } catch (err) {
      console.log(err, "couldn't initialize recorder");
    }
  };

  useEffect(() => { initializeDevice() }, [])

  const toggleRecord = () => {
    if (isRecording) {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop() 
        setIsRecording(false)

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
          {backgroundColor: 'white', border: "5px solid black"} : 
          {backgroundColor: "black"}
      }>
        <MicIcon style={isRecording ? {color: 'black',}: { color: 'white',}} />
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
    <Card style={{ backgroundColor: 'black', borderRadius: '30px' }} >

      <CardContent style={{ backgroundColor: 'black', padding: '24px', height: 240, display: 'flex', alignItems: 'center', }}>
        <Box style={{
          color: 'black', backgroundColor: 'none', display: 'flex', justifyContent: 'space-between', width: '100%'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <DeleteOutlineIcon style={{ color: 'black', backgroundColor: 'white', borderRadius: '50px' }} />
            <span style={{ color: 'white' }}>0.00</span>
          </div>
          <span style={{ color: 'white' }}>
            .....<GraphicEqIcon />.....
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
            < PlayCircleIcon style={{ color: 'white', backgroundColor: 'transparent', borderRadius: '50px' }} />
            <span style={{ color: 'white' }}>0.00</span>

          </div>
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
      <>
        <AudioCard />
        <AudioButtons onSave={handleSave} />
      </>

    )
  }

  renderErrorState() {
    // Shouldn't have to use this anywhere because all types should be properly narrowed
    return (
      <h1>Unexpected Error, Try Reloading</h1>
    )
  }
}