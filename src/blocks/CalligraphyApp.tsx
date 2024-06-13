import Block from './Block'
import { BlockModel } from './types'
import './BlockStyles.css'
import SeamSaveButton from '../components/SeamSaveButton';
import { useEffect, useRef } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import BorderOuterIcon from '@mui/icons-material/BorderOuter';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/Close';

interface CalligraphyCanvasProps {

}
const CalligraphyCanvas = (props: CalligraphyCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const drawGreenRect = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return;
    ctx.beginPath();
    ctx.fillStyle = "green"
    ctx.fillRect(10,10,10,10)
  }
  useEffect( () => drawGreenRect(),[])
  return (
    <canvas
      ref={canvasRef}
      width="100px"
      height="100px"
      />
  )
}

interface ColorSwatchProps {
  color: string
}
const ColorSwatch = (props: ColorSwatchProps) => {
  return (
    <div className='flex flex-0 basis-[14.285714285%] justify-center'>
      <div className='flex flex-0 place-items-center place-content-center w-12 h-12 rounded-full bg-[#ededed]'>
        <div className='w-8 h-8 rounded-full border border-white' style={{ backgroundColor: props.color }}>
          
        </div>
      </div>
    </div>
  )
}

interface CalligraphyPaletteProps {
  colors: string[]
}
const CalligraphyPalette = (props: CalligraphyPaletteProps) => {
  return (
    <div className='flex flex-row flex-wrap gap-2 py-2 border-2 rounded-md bg-[#fbfbfb] justify-start'>
      {props.colors.map (color => <ColorSwatch key={color} color={color} />)}
    </div>
  )
}

interface CalligraphyToolbarProps {
  currentColor: string
}
const CalligraphyToolbar = (props: CalligraphyToolbarProps) => {
  return (
    <div className='flex justify-between'>
      <div className='flex gap-4 border-2 rounded-full p-4 bg-[#fbfbfb]'>
        <div className='flex flex-0 w-10 h-10 rounded-full bg-[#ededed] place-items-center place-content-center'>
          <div className='w-8 h-8 rounded-full border border-white' style={{ backgroundColor: props.currentColor }} />
        </div>
        <div className='flex flex-0 w-10 h-10 rounded-full bg-[#ededed] place-items-center place-content-center'><EditIcon /></div>
        <div className='flex flex-0 w-10 h-10 rounded-full bg-[#ededed] place-items-center place-content-center'><BorderOuterIcon /></div>
      </div>
      <div className='flex gap-4 border-2 rounded-full p-4 bg-[#fbfbfb]'>
        <div className='flex flex-0 w-10 h-10 rounded-full bg-[#ededed] place-items-center place-content-center'><UndoIcon /></div>
        <div className='flex flex-0 w-10 h-10 rounded-full bg-[#ededed] place-items-center place-content-center'><CloseIcon /></div>
      </div>
    </div>
  )
}

export default class CalligraphyBlock extends Block {
  render () {
    return (
      <h1>Calligraphy Block!</h1>
    );
  }


  renderEditModal(done: (data: BlockModel) => void) {
    const onSave = () => done(this.model)
    return (
      <div>
        <h1>Edit Calligraphy Block!</h1>
        <div className='flex flex-col gap-6'>
          <CalligraphyCanvas/>
          <CalligraphyPalette colors={[ '#cdb4db', '#ffc8ddff', '#ffafccff', '#bde0feff', '#a2d2ffff', '#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', ]} />
          <CalligraphyToolbar currentColor='#cdb4db'/>
        </div>
        <div className='absolute bottom-0 left-0 right-0 p-4'>
          <SeamSaveButton onClick={onSave}/>
        </div>
      </div>
    )
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}