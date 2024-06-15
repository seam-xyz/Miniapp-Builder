import Block from './Block'
import { BlockModel } from './types'
import './BlockStyles.css'
import SeamSaveButton from '../components/SeamSaveButton';
import { useCallback, useEffect, useRef, useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import BorderOuterIcon from '@mui/icons-material/BorderOuter';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/Close';
import p5 from 'p5';

interface CalligraphyCanvasProps {
  width: string,
  activeColor: string,
  backgroundStyle: string
  canvasClearSwitch: boolean
  canvasUndoSwitch: boolean
  brushStyle: string
  
}
const CalligraphyCanvas = (props: CalligraphyCanvasProps) => {
  const [p5Instance, setP5Instance] = useState<p5 | null>(null)
  const [bufferInstance, setBufferInstance] = useState<p5.Graphics | null>(null)
  const canvasDivRef = useRef<HTMLDivElement>(null)

  /**A reference object accessible inside the p5 sketch */
  const p5PassInRef = useRef<CalligraphyCanvasProps>({...props})
  const canvasWidth = parseInt(props.width)
  const ASPECT_RATIO = 1
  
  /** p5 Sketch Code That SHould Be Its Own File! */
  const sketch = (s:p5) => {
    let buffer: p5.Graphics
    const BACKGROUND_COLOR = 235
    const state = p5PassInRef //gives the p5 sketch access to all the component props
    
    const BRUSH_SIZE = 25; //make configurable later?
    const VEL_DEPENDENT_SHADE = false //make the stroke lighter the faster the brush moves
    let previousStrokeWidth = 0; //stroke width on prior frame
    let FRICTION = 2; //divides velocity
    let SPRING = .5; 
    let [vy, vx, brushX, brushY] = [0,0,0,0]
    let currentStrokeTotalLength = 0
    s.setup = () => {
      s.createCanvas(canvasWidth,canvasWidth * ASPECT_RATIO)
      s.background(BACKGROUND_COLOR)
      buffer = s.createGraphics(s.width, s.height)
      s.noStroke();
      buffer.noStroke();
      // setBufferInstance(buffer)
      }
    s.draw = () => {
      buffer.fill(state.current.activeColor)
      writeBackground(s)
      switch (state.current.brushStyle || "default") {
        case "ink":
          const maxBRUSH_SIZE = Math.min(
            (BRUSH_SIZE / 2) * (1 + currentStrokeTotalLength / 1000),
            BRUSH_SIZE
          );
          const dx = s.mouseX - brushX;
          const dy = s.mouseY - brushY;
          const vel = s.sqrt(dx ** 2 + dy ** 2);
          currentStrokeTotalLength += vel;
          const velocityStrokeScaling = vel / 100;
          const velocityShadeScaling = VEL_DEPENDENT_SHADE ? vel / 2 : 0;
          const strokeSize = Math.min(
            maxBRUSH_SIZE,
            s.max(BRUSH_SIZE / (1 + velocityStrokeScaling), 1)
          );
          //To lighten depending on velocity
          const scaledStrokeShade = s.min(
            BACKGROUND_COLOR * 0.75,
            (s.brightness(state.current.activeColor) * 2.55) + velocityShadeScaling
          );
          if (s.mouseIsPressed) {
            //   s.fill(127 * (1 + 0.5 * s.sin(s.frameCount * 3)));
      
            vx += (dx * SPRING) / 2;
            vy += (dy * SPRING) / 2;
            vx /= FRICTION;
            vy /= FRICTION;
            const [prevX, prevY] = [brushX, brushY];
            (brushX += vx);
            (brushY += vy);
      
            taperLine(buffer, prevX, prevY, brushX, brushY, previousStrokeWidth, strokeSize, true);
          }
          previousStrokeWidth = strokeSize;
      }

      s.image(buffer,0,0)
    }
    //on touch, set current path length to 0, snap brush to mouse, vel to 0
    s.mousePressed = () => {
      currentStrokeTotalLength = 0;
      [brushX, brushY] = [s.mouseX, s.mouseY];
      [vx, vy] = [0, 0];
    };
    //Function to draw a tapered line (trapezoid) for smoothness
    function taperLine(
      s: p5,
      start_x: number,
      start_y: number,
      end_x: number,
      end_y: number,
      start_width: number,
      end_width: number,
      endRound = false
    ) {
      s.push();
      s.angleMode(s.DEGREES);
      let deltaX = end_x - start_x;
      let deltaY = end_y - start_y;
      let distance = s.sqrt(deltaX ** 2 + deltaY ** 2);
      let slope = s.atan2(deltaY, deltaX);
      s.translate(start_x, start_y);
      s.rotate(-90 + slope);
  
      s.beginShape();
      s.vertex(-start_width / 2, 0);
      s.vertex(start_width / 2, 0);
      s.vertex(end_width / 2, distance);
      s.vertex(-end_width / 2, distance);
      s.endShape(s.CLOSE);
      if (endRound) {
        s.circle(0, 0, start_width);
        s.circle(0, distance, end_width);
      }
      s.pop();
    }
    /**write the background (lines/grid/etc) to a graphics element */
    const writeBackground = (g:p5.Graphics | p5) => {
      g.push();
      g.background(BACKGROUND_COLOR)
      const GRID_COUNT = 15;
      const GRID_SIZE = g.width/(GRID_COUNT + 1);
      switch (state.current.backgroundStyle) {
        case "grid":
          g.stroke(220);
          g.strokeWeight(3);
          g.fill(BACKGROUND_COLOR);
          for (let i = 0; i < 15; i++) {
            for (let j = 0; j < g.height/GRID_SIZE - 1; j++) {
              g.rect(GRID_SIZE * (.5 + i), GRID_SIZE * (.5 + j),GRID_SIZE)
            }
          }
          break;
        case "dots":
          g.fill(150);
          for (let i = 0; i < 16; i++) {
            for (let j = 0; j < g.height/GRID_SIZE; j++) {
              g.circle(GRID_SIZE * (.5 + i), GRID_SIZE * (.5 + j),2)
            }
          }
          break;
        case "lines":
          const LINE_COUNT = 25;
          const LINE_SPACING = (g.height - GRID_SIZE)/LINE_COUNT
          g.stroke(215);
          g.strokeWeight(2);
          for (let i = 0; i <= LINE_COUNT ; i++) {
            g.line(GRID_SIZE/2, GRID_SIZE/2 + (i * LINE_SPACING),g.width-GRID_SIZE/2,GRID_SIZE/2 + (i * LINE_SPACING))
          }
          break;
        case "blank":
          break;
        }
      g.pop();
    }
  }
  /** /end p5 Sketch Code! */
  /**Passes information in to the p5 context through ref */
  useEffect(() => {p5PassInRef.current = {...props}},[props])
  /**Creates the p5 canvas instance */
  useEffect(() => {
    const myP5: p5 = new p5(sketch, canvasDivRef.current!);
    setP5Instance(myP5);
    return myP5.remove;
  }, []);
  // useEffect(() => {bufferInstance === null || bufferInstance.clear()},[props.canvasClearSwitch])
  return (
    <><div className="flex justify-center"ref={canvasDivRef}></div>
    </>
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
  toggleCanvasClearSwitch: () => void
  toggleCanvasUndoSwitch: () => void
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
        <div onClick={props.toggleCanvasUndoSwitch} className='flex flex-0 w-10 h-10 rounded-full bg-[#ededed] place-items-center place-content-center'><UndoIcon /></div>
        <div onClick={props.toggleCanvasClearSwitch}className='flex flex-0 w-10 h-10 rounded-full bg-[#ededed] place-items-center place-content-center'><CloseIcon /></div>
      </div>   </div>
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
  const [canvasClearSwitch, setCanvasClearSwitch] = useState(false)
  const [canvasUndoSwitch, setCanvasUndoSwitch] = useState(false)
  const [backgroundStyle, setBackgroundStyle] = useState("lines")
  const [activePaletteTab, setActivePaletteTab] = useState(PaletteTab.COLOR)
  const [brushStyle, setBrushStyle] = useState("ink")
  return (
    <div>
      <h1>Edit Calligraphy Block!</h1>
      <div className='flex flex-1 h-full flex-col gap-6'>
        <CalligraphyCanvas 
          width={props.width} 
          canvasClearSwitch={canvasClearSwitch}
          canvasUndoSwitch={canvasUndoSwitch}
          activeColor={activeColor} 
          backgroundStyle={backgroundStyle}
          brushStyle={brushStyle}
        />
        { activePaletteTab === PaletteTab.COLOR &&
        <CalligraphyPalette
          colors={[ '#cdb4db', '#ffc8ddff', '#ffafccff', '#bde0feff', '#a2d2ffff', '#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', ]}
          onColorSelected={color => setActiveColor(color)}
          activeColor={activeColor}
        />
        }
        <CalligraphyToolbar 
          activeColor={activeColor}
          setActivePaletteTab={setActivePaletteTab} 
          toggleCanvasUndoSwitch={() => setCanvasUndoSwitch(!canvasUndoSwitch)} 
          toggleCanvasClearSwitch={() => setCanvasClearSwitch(!canvasClearSwitch)} 
          activePaletteTab={activePaletteTab} />
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