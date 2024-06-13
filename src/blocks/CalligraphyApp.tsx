import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import SeamSaveButton from '../components/SeamSaveButton';
import { useEffect, useRef } from 'react';
import { JsxElement } from 'typescript';

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
      <div className='flex flex-0 place-items-center place-content-center w-8 h-8 rounded-full bg-[#ededed]'>
        <div className='w-6 h-6 rounded-full border border-[#ffffff]' style={{ backgroundColor: props.color }}>
          
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
    <div className='flex flex-row flex-wrap py-2 border-2 rounded-md bg-[#fafafa] justify-start'>
      {props.colors.map (color => <ColorSwatch key={color} color={color} />)}
    </div>
  )
}

const CalligraphyToolbar = () => {
  return (
    <div className='flex justify-between'>
      <div>
        Tab selector
      </div>
      <div>
        Undo/Clear
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

        <CalligraphyCanvas/>
        <CalligraphyPalette colors={[ '#cdb4db', '#ffc8ddff', '#ffafccff', '#bde0feff', '#a2d2ffff' ]} />
        <CalligraphyToolbar/>
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