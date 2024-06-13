import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import SeamSaveButton from '../components/SeamSaveButton';
import { useEffect, useRef } from 'react';

interface CalligraphyCanvasProps {

}
const CalligraphyCanvas = (props: CalligraphyCanvasProps) => {
  const canvasDivRef = useRef<HTMLDivElement>(null)
  const sketch = (s)
  useEffect( () => new p5(sketch))
  return (
    <div ref={canvasDivRef}></div>
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
        {/* <CalligraphyPalette/>
        <CalligraphyToolbar/> */}
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