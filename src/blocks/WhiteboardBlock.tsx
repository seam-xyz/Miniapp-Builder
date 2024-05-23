import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'

import CSS from 'csstype';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AttributionOutlined } from '@mui/icons-material';
import BlueMarkerSvg from './assets/WhiteboardBlock/blue_marker.svg';
import BlackMarkerSvg from './assets/WhiteboardBlock/black_marker.svg';
import YellowMarkerSvg from './assets/WhiteboardBlock/yellow_marker.svg';
import RedMarkerSvg from './assets/WhiteboardBlock/red_marker.svg';
import GreenMarkerSvg from './assets/WhiteboardBlock/green_marker.svg';
import MarkerCapOnSound from './assets/WhiteboardBlock/marker_cap_on.mp3';
import MarkerCapOffSound from './assets/WhiteboardBlock/marker_cap_off.mp3';
import _ from 'lodash';

const SOUND_ATTRIBUTION = `
  dry erase marker_cap_on.wav by sjturia
  https://freesound.org/s/370922/
  License: Attribution 3.0

  dry erase marker_cap_off.wav by sjturia
  https://freesound.org/s/370917/
  License: Attribution 3.0
  `;

interface DrawableCanvasInitialUserState {
  initialBackgroundColor: string,  // Hex string e.g. '#123abc'
  initialForegroundColor: string,  // Hex string e.g. '#123abc'
}

interface DrawableCanvasProps {
  height: number,
  width: number
  userInitialState: DrawableCanvasInitialUserState,
  foregroundColor: string,
  updateState: ((
    height: number,
    width: number,
    backgroundColor: string,
    imageData: string,
  ) => void),
}

const DrawableCanvas: React.FC<DrawableCanvasProps> = (props: DrawableCanvasProps) => {
  const {
    height,
    width,
    updateState,
  } = props;

  // === Initialize ===
  const {
    initialBackgroundColor,
    initialForegroundColor,
  } = props.userInitialState;
  const foregroundColor = props.foregroundColor;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const canvasStyles: CSS.Properties = {
    cursor: 'pointer',
    aspectRatio: 1,
    backgroundColor: initialBackgroundColor,
    display: 'block',
  }

  // === Methods to Update Canvas ===
  // FUTURE: Expose as a customizable callback in props, this is default behavior
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<{ x: number, y: number }[]>([]); // Updated state to store points

  const clearCanvas = () => {
    const canvasContext = canvasRef?.current?.getContext('2d');
    if (!canvasContext) {
      return;
    }

    canvasContext.fillStyle = initialBackgroundColor;
    canvasContext.fillRect(0, 0, width, height);
  }

  const handleDrawDrag = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef?.current;
    if (!canvas) {
      return;
    }

    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) {
      return;
    }

    // Translate page coordinates to relative canvas coordinates
    const canvasBoundingRect = canvas.getBoundingClientRect();
    var pageObj: any = e;
    if ('touches' in e) {
      if(e.touches.length > 0) {
        pageObj = e.touches[0]
      }
    }

    const relativeX = Math.floor(pageObj.pageX - canvasBoundingRect.left);
    const relativeY = Math.floor(pageObj.pageY - canvasBoundingRect.top);

    if (isDrawing) {
      setPoints(prevPoints => [...prevPoints, { x: relativeX, y: relativeY }]); // Updated to add points to the state
    }
  }

  const handleStartDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setPoints([]); // Clear points at the start of drawing
    handleDrawDrag(e);
  }

  const handleStopDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(false);
    setPoints([]); // Clear points at the end of drawing
  }

  // FUTURE: Expose as a customizable callback in props, takes a canvas context as an arg, can be used to access canvas
  const draw = useCallback(() => {
    const canvasContext = canvasRef?.current?.getContext('2d');
    if (!canvasContext || points.length < 1) {
      return;
    }

    canvasContext.lineCap = 'round';
    canvasContext.lineJoin = 'round';
    canvasContext.lineWidth = 4;
    canvasContext.strokeStyle = foregroundColor;

    if (points.length == 1) {
      // Draw single dot
      // NOTE: this isn't working correctly, need to investigate if the first point is getting set correctly each time
      canvasContext.beginPath();
      canvasContext.roundRect(points[0].x, points[0].y, 4, 4, 2);
      canvasContext.fill();
      return;
    }

    canvasContext.beginPath();
    canvasContext.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length - 2; i++) {
      const cp = {
        x: (points[i].x + points[i + 1].x) / 2,
        y: (points[i].y + points[i + 1].y) / 2
      };
      canvasContext.quadraticCurveTo(points[i].x, points[i].y, cp.x, cp.y);
    }

    const lastIndex = points.length - 1;
    canvasContext.quadraticCurveTo(points[lastIndex - 1].x, points[lastIndex - 1].y, points[lastIndex].x, points[lastIndex].y);
    canvasContext.stroke();

    // Update model state on every redraw... pretty inefficient; need to be able to listen to the external button event though
    const imageData = canvasRef?.current?.toDataURL('image/png');
    if (imageData) {
      updateState(310, 480, initialBackgroundColor, imageData);
    }
  }, [points, foregroundColor, initialBackgroundColor, updateState])

  // === Handle Renders and Re-renders ===
  // Render the outline on first render
  useEffect(() => {
    const canvasContext = canvasRef?.current?.getContext('2d');
    if (!canvasContext) {
      return;
    }

    // Draw border
    canvasContext.strokeStyle = '#000000';
    const lineWidth = 6;
    canvasContext.lineWidth = lineWidth;
    canvasContext.roundRect(lineWidth / 2, lineWidth / 2, width - lineWidth, height - lineWidth, 4);
    canvasContext.stroke();

    // Add bottom "tray"
    const bottomRectHeight = (32 / 358 * width);
    canvasContext.beginPath();
    canvasContext.roundRect(lineWidth / 2, height - bottomRectHeight, width - lineWidth, bottomRectHeight - lineWidth, 4);
    canvasContext.fill();

  }, [height, width])

  // Update state variables based on changes to position
  useEffect(() => {
    if (isDrawing) {
      draw();
    }
  }, [points, isDrawing, draw])

  // === Finally, Return ===
  return (
    <canvas
        ref={canvasRef}
        width={width + 'px'}
        height={height + 'px'}
        style={canvasStyles}
        onMouseDown={handleStartDrawing}
        onMouseMove={handleDrawDrag}
        onMouseUp={handleStopDrawing}
        onTouchStart={handleStartDrawing}
        onTouchMove={handleDrawDrag}
        onTouchEnd={handleStopDrawing}
        onContextMenu={(e) => e.preventDefault()}
      />
  )
}

interface MarkerColorSelectorProps {
  color: string;
  onChange: (newColor: string) => void;
}

const markers = [
  { color: '#373737', svg: BlackMarkerSvg },
  { color: '#FEDA77', svg: YellowMarkerSvg },
  { color: '#FF1F00', svg: RedMarkerSvg },
  { color: '#679D34', svg: GreenMarkerSvg },
  { color: '#008CB4', svg: BlueMarkerSvg },
];

const MarkerColorSelector: React.FC<MarkerColorSelectorProps> = ({ color, onChange }) => {
  const [selectedColor, updateSelectedColor] = useState<string>(color);
  const playSelectedSound = () => {
    new Audio(MarkerCapOffSound).play();
  }
  const playHoverSound = () => {
    var audio = new Audio(MarkerCapOnSound);
    audio.volume = 0.2;
    audio.play();
  }

  const handleColorChange = (color: string) => {
    playSelectedSound();
    updateSelectedColor(color);
    onChange(color);
  }

  return (
    <>
      <div className='absolute right-0' title={SOUND_ATTRIBUTION}>
        <AttributionOutlined />
      </div>
      <div className='grid grid-cols-5 gap-2'>
        {markers.map((marker) => (
          <img 
            key={marker.color}
            className={`w-full transform transition-transform duration-300 ${marker.color === selectedColor ? 'translate-y-0 hover:-rotate-1' : 'hover:translate-y-8 translate-y-12'}`}
            src={marker.svg}
            onClick={() => handleColorChange(marker.color)}
            onMouseEnter={playHoverSound}
          />
        ))}
      </div>
    </>
  );
}

interface WhiteboardEditProps {
  width: number,
  initialForegroundColor: string,
  initialBackgroundColor: string,
  onSave: () => void,    // Callback for saving state when editing
  updateState: ((
    height: number,
    width: number,
    backgroundColor: string,
    imageData: string,
  ) => void),
}

const WhiteboardEdit = (props: WhiteboardEditProps) => {
  const {width, onSave} = props
  const height =  Math.floor(384/358 * width);
  const initialUserState = {
    initialForegroundColor: props.initialForegroundColor,
    initialBackgroundColor: props.initialBackgroundColor,
  }
  const [selectedColor, setSelectedColor] = useState<string>(initialUserState.initialForegroundColor);

  return (
    <>
      <DrawableCanvas
        width={width}
        height={height}
        foregroundColor={selectedColor}
        userInitialState={initialUserState}
        updateState={props.updateState}
      />
      <div className='p-4'></div>
      <MarkerColorSelector
        color={selectedColor}
        onChange={(newColor: string) => setSelectedColor(newColor)}
      />
    </>
  )
}

// stringSizeToNumber takes an input size string like '400px' and returns 400
function stringSizeToNumber(size: string | undefined): number {
  if (size === undefined) {
    // handle edge case, size should never be undefined from Seam render
    return 400
  }

  const num = parseInt(size)
  if (!isNaN(num)) {
    return num
  }

  const regexMatch = size.match(/\d+/)
  if (!regexMatch) {
    return 0
  }
  return parseInt(regexMatch[0])
}

export default class WhiteboardBlock extends Block {
  render(width?: string, height?: string) {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    const {
      backgroundColor,
      imageData,
    } = this.model.data;

    return (
      <img src={imageData} alt='a drawing' className='w-full object-contain'></img>
    );
  }

  renderEditModal(done: (data: BlockModel) => void, width?: string) {
    console.log('got the width in render', width);
    const widthInt = width !== undefined ? stringSizeToNumber(width) : 450;
    const defaultBackgroundColor = '#ffffff';
    const defaultForegroundColor = '#373737';

    // TODO: load from saved state

    const updateState = (
      height: number,
      width: number,
      backgroundColor: string,
      imageData: string
    ) => {
      this.model.data['height'] = height.toString();
      this.model.data['width'] = width.toString();
      this.model.data['backgroundColor'] = backgroundColor;
      this.model.data['imageData'] = imageData;
    }

    const onSave = () => {
      done(this.model);
    }

    return (
      <WhiteboardEdit
        width={widthInt}
        initialBackgroundColor={defaultBackgroundColor}
        initialForegroundColor={defaultForegroundColor}
        onSave={onSave}
        updateState={updateState}
      />
    )
  }

  renderErrorState() {
    return (
      <h1>Sry something went wrong with the whiteboard block</h1>
    )
  }
}
