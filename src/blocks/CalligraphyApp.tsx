import Block from './Block'
import { BlockModel } from './types'
import './BlockStyles.css'
import SeamSaveButton from '../components/SeamSaveButton';
import { useEffect, useRef, useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import BorderOuterIcon from '@mui/icons-material/BorderOuter';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/Close';
import p5 from 'p5';
import { buffer } from 'stream/consumers';

interface CalligraphyCanvasProps {
  width: string,
  activeColor: string,
  backgroundStyle: string
}
const CalligraphyCanvas = (props: CalligraphyCanvasProps) => {
  const [p5Instance, setP5Instance] = useState<p5 | null>(null)
  const canvasDivRef = useRef<HTMLDivElement>(null)
  const canvasWidth = parseInt(props.width)
  const ASPECT_RATIO = 1

  /** p5 Sketch Code That SHould Be Its Own File! */
  const sketch = (s:p5) => {
    let buffer: p5.Graphics
    const BACKGROUND_COLOR = 235
    s.setup = () => {
      s.createCanvas(canvasWidth,canvasWidth * ASPECT_RATIO)
      s.background(BACKGROUND_COLOR)
      s.noStroke();
      buffer = s.createGraphics(s.width, s.height)
      writeBackgroundToBuffer()
      s.image(buffer,0,0)
    }
    s.draw = () => {
    }
    s.touchMoved = () => {
      s.circle(s.mouseX, s.mouseY, 30)
      return false;
    }
    const writeBackgroundToBuffer = () => {
      buffer.push();
      const GRID_COUNT = 15;
      const GRID_SIZE = buffer.width/(GRID_COUNT + 1);
      switch (props.backgroundStyle) {
        case "grid":
          buffer.stroke(220);
          buffer.strokeWeight(3);
          buffer.fill(BACKGROUND_COLOR);
          for (let i = 0; i < 15; i++) {
            for (let j = 0; j < buffer.height/GRID_SIZE - 1; j++) {
              buffer.rect(GRID_SIZE * (.5 + i), GRID_SIZE * (.5 + j),GRID_SIZE)
            }
          }
          break;
        case "dots":
          buffer.fill(150);
          for (let i = 0; i < 16; i++) {
            for (let j = 0; j < buffer.height/GRID_SIZE; j++) {
              buffer.circle(GRID_SIZE * (.5 + i), GRID_SIZE * (.5 + j),2)
            }
          }
          break;
        case "lines":
          const LINE_COUNT = 25;
          const LINE_SPACING = (buffer.height - GRID_SIZE)/LINE_COUNT
          buffer.stroke(215);
          buffer.strokeWeight(2);
          for (let i = 0; i <= LINE_COUNT ; i++) {
            buffer.line(GRID_SIZE/2, GRID_SIZE/2 + (i * LINE_SPACING),buffer.width-GRID_SIZE/2,GRID_SIZE/2 + (i * LINE_SPACING))
          }
          break;
        }
      buffer.pop();
    }
  }
  /** /end p5 Sketch Code! */
  useEffect(() => {if (p5Instance != null) p5Instance.clear()},[])
  useEffect(() => {
    const myP5: p5 = new p5(sketch, canvasDivRef.current!);
    setP5Instance(myP5);
    return myP5.remove;
  }, []);
  useEffect(() => {p5Instance === null || p5Instance.fill(props.activeColor)},[props.activeColor])
  return (
    <div ref={canvasDivRef}></div>
  )
}

interface ColorSwatchProps {
  color: string
  activeColor: string
  onClick: () => void
}
const ColorSwatch = (props: ColorSwatchProps) => {
  return (
    <div className='flex flex-0 basis-[14.285714285%] justify-center'>
      <div className='flex flex-0 place-items-center place-content-center w-10 h-10 rounded-full bg-[#ededed] border-fuchsia-500'
        style={{ borderWidth : props.color === props.activeColor ? '2px' : '0px' }}
        onClick={props.onClick}
      >
        <div className='w-8 h-8 rounded-full border border-white' style={{ backgroundColor: props.color }}>
          
        </div>
      </div>
    </div>
  )
}

interface CalligraphyPaletteProps {
  activeColor: string
  colors: string[]
  onColorSelected: (color: string) => void
}
const CalligraphyPalette = (props: CalligraphyPaletteProps) => {
  return (
    <div className='flex flex-row flex-wrap gap-2 py-2 border-2 rounded-md bg-[#fbfbfb] justify-start'>
      {props.colors.map (color =>
        <ColorSwatch key={color} color={color} onClick={() => props.onColorSelected(color)} activeColor={props.activeColor} />
      )}
    </div>
  )
}

interface CalligraphyToolbarProps {
  activeColor: string
  setActivePaletteTab: (tab: PaletteTab) => void
  activePaletteTab: PaletteTab
}
const CalligraphyToolbar = (props: CalligraphyToolbarProps) => {
  return (
    <div className='flex justify-between'>
      <div className='flex gap-4 border-2 rounded-full p-4 bg-[#fbfbfb]'>
        <div
          className='flex flex-0 w-10 h-10 rounded-full bg-[#ededed] place-items-center place-content-center border-fuchsia-500'
          onClick={() => props.setActivePaletteTab(PaletteTab.COLOR)}
          style={{ borderWidth: props.activePaletteTab === PaletteTab.COLOR ? '2px' : '0px' }}
        >
          <div className='w-8 h-8 rounded-full border border-white' style={{ backgroundColor: props.activeColor }} />
        </div>
        <div
          className='flex flex-0 w-10 h-10 rounded-full bg-[#ededed] place-items-center place-content-center border-fuchsia-500'
          onClick={() => props.setActivePaletteTab(PaletteTab.BRUSHES)}
          style={{ borderWidth: props.activePaletteTab === PaletteTab.BRUSHES ? '2px' : '0px' }}
        >
          <EditIcon />
        </div>
        <div
          className='flex flex-0 w-10 h-10 rounded-full bg-[#ededed] place-items-center place-content-center border-fuchsia-500'
          onClick={() => props.setActivePaletteTab(PaletteTab.BACKGROUNDS)}
          style={{ borderWidth: props.activePaletteTab === PaletteTab.BACKGROUNDS ? '2px' : '0px' }}
        >
          <BorderOuterIcon />
        </div>
      </div>
      <div className='flex gap-4 border-2 rounded-full p-4 bg-[#fbfbfb]'>
        <div className='flex flex-0 w-10 h-10 rounded-full bg-[#ededed] place-items-center place-content-center'><UndoIcon /></div>
        <div className='flex flex-0 w-10 h-10 rounded-full bg-[#ededed] place-items-center place-content-center'><CloseIcon /></div>
      </div>
    </div>
  )
}

enum PaletteTab {
  COLOR,
  BRUSHES,
  BACKGROUNDS
}
interface CalligraphyEditProps {
  onSave: () => void;
  width: string;
}
const CalligraphyEdit = (props: CalligraphyEditProps) => {
  const [activeColor, setActiveColor] = useState('#cdb4db');
  const [backgroundStyle, setBackgroundStyle] = useState("lines")
  const [activePaletteTab, setActivePaletteTab] = useState(PaletteTab.COLOR)

  return (
    <div>
      <h1>Edit Calligraphy Block!</h1>
      <div className='flex flex-1 h-full flex-col gap-6'>
        <CalligraphyCanvas width={props.width} activeColor={activeColor} backgroundStyle={backgroundStyle}/>
        { activePaletteTab === PaletteTab.COLOR &&
        <CalligraphyPalette
          colors={[ '#cdb4db', '#ffc8ddff', '#ffafccff', '#bde0feff', '#a2d2ffff', '#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', ]}
          onColorSelected={color => setActiveColor(color)}
          activeColor={activeColor}
        />
        }
        <CalligraphyToolbar activeColor={activeColor} setActivePaletteTab={setActivePaletteTab} activePaletteTab={activePaletteTab} />
      </div>
      <div>
        <SeamSaveButton onClick={props.onSave}/>
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


  renderEditModal(done: (data: BlockModel) => void, width:string="450") {
    const onSave = () => done(this.model)
    return (
      <CalligraphyEdit onSave={onSave} width={width}/>
    )
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}