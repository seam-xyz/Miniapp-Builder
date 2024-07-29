import { ComposerComponentProps, FeedComponentProps } from './types'

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
import SeamSaveButton from '../components/SeamSaveButton';

const ATTRIBUTION = `Design by @rocco
https://seam.so/user/rocco

Code by @emilee
https://seam.so/user/emilee

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
  initialImageData?: string,       // Optional base64 image data
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
    initialImageData,
  } = props.userInitialState;
  const foregroundColor = props.foregroundColor;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const canvasStyles: CSS.Properties = {
    cursor: 'pointer',
    aspectRatio: 1,
    backgroundColor: initialBackgroundColor,
    display: 'block',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box', // Ensure the border is included in the canvas dimensions
    border: '4px solid #000',
  }

  // === Methods to Update Canvas ===
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

  const getRelativePosition = (canvas: HTMLCanvasElement, e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    // Translate page coordinates to relative canvas coordinates
    const canvasBoundingRect = canvas.getBoundingClientRect();
    var pageObj: any = e;
    if ('touches' in e) {
      if (e.touches.length > 0) {
        pageObj = e.touches[0]
      }
    }

    const relativeX = Math.floor(pageObj.pageX - canvasBoundingRect.left);
    const relativeY = Math.floor(pageObj.pageY - canvasBoundingRect.top);

    return { x: relativeX, y: relativeY }
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

    const { x: relativeX, y: relativeY } = getRelativePosition(canvas, e);

    if (isDrawing) {
      setPoints(prevPoints => [...prevPoints, { x: relativeX, y: relativeY }]); // Updated to add points to the state
    }
  }

  const handleStartDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    setIsDrawing(true);
    setPoints([getRelativePosition(canvas, e)]); // Reset points at the start of drawing
    handleDrawDrag(e);
  }

  const handleStopDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(false);
    setPoints([]);   // Clear points at the end of drawing
    saveImageData(); // Save current image state
  }

  const saveImageData = useCallback(() => {
    const canvas = canvasRef?.current;
    if (!canvas) {
      return;
    }

    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) {
      return;
    }

    const imageData = canvas.toDataURL('image/png');
    updateState(height, width, initialBackgroundColor, imageData);
  }, [updateState, height, width, initialBackgroundColor]);

  const draw = useCallback(() => {
    const canvasContext = canvasRef?.current?.getContext('2d');
    if (!canvasContext || points.length < 1) {
      return;
    }

    if (points.length === 1) {
      // Draw single point
      canvasContext.fillStyle = foregroundColor;
      canvasContext.beginPath();
      canvasContext.rect(points[0].x - 3, points[0].y - 3, 3, 3);
      canvasContext.fill();
      return;
    }

    canvasContext.lineCap = 'round';
    canvasContext.lineJoin = 'round';
    canvasContext.lineWidth = 4;
    canvasContext.strokeStyle = foregroundColor;
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
  }, [points, foregroundColor])

  // === Handle Renders and Re-renders ===
  // Render the outline on first render
  useEffect(() => {
    const canvasContext = canvasRef?.current?.getContext('2d');
    if (!canvasContext) {
      return;
    }

    if (initialImageData !== undefined) {
      const image = new Image();
      image.src = initialImageData;
      image.onload = () => {
        canvasContext.drawImage(image, 0, 0);
      }
      return;
    }

    // Clear any previous drawings
    canvasContext.clearRect(0, 0, width, height);

    // Save initial state
    saveImageData();

  }, [height, width, saveImageData, initialImageData])

  // Update state variables based on changes to position
  useEffect(() => {
    if (isDrawing) {
      draw();
    }
  }, [points, isDrawing, draw])

  // === Finally, Return ===
  return (
    <>
      <div style={{ width: `${width}px`, height: `${height}px`, position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={canvasStyles}
          onMouseDown={handleStartDrawing}
          onMouseMove={handleDrawDrag}
          onMouseUp={handleStopDrawing}
          onTouchStart={handleStartDrawing}
          onTouchMove={handleDrawDrag}
          onTouchEnd={handleStopDrawing}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      <div className='absolute right-0 flex flex-row'>
        <button onClick={clearCanvas}>
          Clear
        </button>
        <p>|</p>
        <div title={ATTRIBUTION}>
          <AttributionOutlined />
        </div>
      </div>
    </>
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
    var audio = new Audio(MarkerCapOffSound);
    audio.volume = 0.5;
    audio.play()
  }
  const playHoverSound = () => {
    var audio = new Audio(MarkerCapOnSound);
    audio.volume = 0.15;
    audio.play();
  }

  const handleColorChange = (color: string) => {
    playSelectedSound();
    updateSelectedColor(color);
    onChange(color);
  }

  return (
    <div className='grid grid-cols-5 gap-2'>
      {markers.map((marker) => (
        <img
          key={marker.color}
          alt={`Clipart of a whiteboard marker with hex color ${marker.color}`}
          className={`w-full transform transition-transform duration-300 ${marker.color === selectedColor ? 'translate-y-0 hover:-rotate-1' : 'hover:translate-y-8 translate-y-12'}`}
          src={marker.svg}
          onClick={() => handleColorChange(marker.color)}
          onMouseEnter={playHoverSound}
          onDragStart={(e) => e.preventDefault()}
        />
      ))}
    </div>
  );
}

interface WhiteboardEditProps {
  width: number,
  initialForegroundColor: string,
  initialBackgroundColor: string,
  initialImageData?: string,
  onSave: () => void,    // Callback for saving state when editing
  updateState: ((
    height: number,
    width: number,
    backgroundColor: string,
    imageData: string,
  ) => void),
}

const WhiteboardEdit = (props: WhiteboardEditProps) => {
  const { width, onSave } = props;
  const height = Math.floor(384 / 358 * width); // Ensure the height calculation is consistent with the aspect ratio
  const initialUserState = {
    initialForegroundColor: props.initialForegroundColor,
    initialBackgroundColor: props.initialBackgroundColor,
    initialImageData: props.initialImageData,
  }
  const [selectedColor, setSelectedColor] = useState<string>(initialUserState.initialForegroundColor);

  return (
    <div className='overflow-y-clip w-full h-full'>
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
      <div className='absolute bottom-0 left-0 right-0 p-4'>
        <SeamSaveButton onClick={onSave} />
      </div>
    </div>
  )
}

export const WhiteboardFeedComponent = ({ model }: FeedComponentProps) => {
  const { imageData } = model.data;

  return (
    <div className="w-full object-contain border-[4px] border-seam-black border-box">
      <img src={imageData} alt='a drawing' className='w-full object-contain'></img>
    </div>
  );
}

export const WhiteboardComposerComponent = ({ model, done, width }: ComposerComponentProps) => {
  const defaultBackgroundColor = '#ffffff';
  const defaultForegroundColor = '#373737';

  const {
    backgroundColor,
    imageData,
  } = model.data;

  const updateState = (
    height: number,
    width: number,
    backgroundColor: string,
    imageData: string
  ) => {
    model.data['height'] = height.toString();
    model.data['width'] = width.toString();
    model.data['backgroundColor'] = backgroundColor;
    model.data['imageData'] = imageData;
  }

  const onSave = () => {
    done(model);
  }

  return (
    <WhiteboardEdit
      width={width ?? 400}
      initialBackgroundColor={backgroundColor || defaultBackgroundColor}
      initialForegroundColor={defaultForegroundColor}
      initialImageData={imageData}
      onSave={onSave}
      updateState={updateState}
    />
  )
}
