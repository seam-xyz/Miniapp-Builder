import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import SeamSaveButton from '../components/SeamSaveButton';
import { useEffect, useRef } from 'react';

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

        {/* Canvas */}
        <CalligraphyCanvas/>
        {/* Pallete */}
        <div>

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