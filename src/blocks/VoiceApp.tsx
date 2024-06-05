import Block from './Block'
import { BlockModel } from './types'
import './BlockStyles.css'
import { useState } from 'react';
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
  onSave: (name: string) => void;
}

/*

  VoiceApp COMPONENTS

*/

const AudioButtons = ({onSave}: AudioButtonProps) => {

  const handleSubmit = () => {
    const name = "sam iyana"
    onSave(name)
  }

  return (
    <Box style={{
      backgroundColor: 'none', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '20px', width: '100%'
    }} >
      {/* Microphone button */}
      <Fab sx={{ width: { xs: "150px", md: "250px", lg: "250px" }, height: { xs: "150px", md: "250px", lg: "250px" } }} style={{
        backgroundColor: 'black'
      }}>
        <MicIcon style={{
          borderRadius: '50%',
          color: 'white',
        }} />
      </Fab>
      {/* Post button */}
      <Fab sx={{
        width: { xs: "75px", md: "150px", lg: "150px" }, height: { xs: "75px", md: "150px", lg: "150px" }, color: 'white', padding: '20px'
      }} style={{
        backgroundColor: 'red'
      }} onClick={handleSubmit}>
        Post
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
    return (
      <div>
        <div>{this.model.data["name"]}</div>
        <div></div>
        <div></div>
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const handleSave = (name: string) => {
      this.model.data["name"] = name
      done(this.model)
    }

    return (
      <>
        <AudioCard />
        <AudioButtons onSave={handleSave}/>
      </>

    )
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}