import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import Card from '@mui/material/Card';
import * as React from 'react';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import MicIcon from '@mui/icons-material/Mic';
import { makeStyles } from '@mui/styles';
import Fab from '@mui/material/Fab';
import { withStyles } from '@mui/styles';




export default class VoiceBlock extends Block {
  render() {
    return (
      <h1>Voice Block!</h1>
    );
  }


  renderEditModal(done: (data: BlockModel) => void) {

    return (
      <>
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
        <Box style={{
          backgroundColor: 'none', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', 
        }} >
          {/* Microphone button */}
          <Fab style={{
            width: '250px', height: '250px', backgroundColor: 'black'
          }}>
            <MicIcon style={{
              borderRadius: '50%',
              color: 'white',
            }} />
          </Fab>
          {/* Post button */}
          <Fab style={{
            width: '150px', height: '150px', backgroundColor: 'red'
          }}>
            <Button style={{
              color: 'white', margin: '10px', padding: '20px'
            }}>Post</Button>
          </Fab>

        </Box>
      </>

    )
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}