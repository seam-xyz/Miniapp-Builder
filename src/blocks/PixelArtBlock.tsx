import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'

import React, {useEffect, useRef, useState} from 'react';
import { Button, Stack } from '@mui/material';

interface PixelCanvasProps {
  numPixelsPerSide: number;                 // e.g. '5' represents a 5x5 pixel grid
  isEditMode: boolean;                      // True if edit mode, false if display mode
  initialPixels?: string[][];               // Used to render from an existing state
  onSave?: ((pixels: string[][]) => void);  // Callback for saving state when editing
}

function PixelCanvas({
  numPixelsPerSide,
  isEditMode,
  initialPixels,
  onSave,
}: PixelCanvasProps) {
  const generateDefaultPixelsState = () => {
    return Array.from(
      {length: numPixelsPerSide}, _ => Array(numPixelsPerSide).fill('#f2f2f2'));
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#000000');
  const [showGrid, setShowGrid] = useState(isEditMode);
  const [pixels, setPixels] = useState<string[][]>(initialPixels || generateDefaultPixelsState());
  
  const setPixelColor = (x: number, y: number, color: string) => {
    let updatedPixels = [...pixels];
    updatedPixels[x][y] = color;
    setPixels(updatedPixels);
  }

  // This value is used for logic when drawing the canvas, but the final canvas size is
  // determined by the size of the parent container by utilizing "display: 'flex'"
  const width = 1000;
  const height = 1000;
  const pixelWidth = width / numPixelsPerSide;
  const pixelHeight = height / numPixelsPerSide;

  useEffect(() => {
    drawPixelArt(showGrid);
  }, [pixels, showGrid]);

  useEffect(() => {
    initialPixels && setPixels(initialPixels);
  }, [initialPixels])

  const clearCanvas = () => {
    const canvasContext = canvasRef?.current?.getContext('2d');
    if (!canvasContext) {
      return;
    }

    setPixels(generateDefaultPixelsState());
    drawPixelArt(showGrid);
  }

  const drawPixelArt = (showGrid: boolean) => {
    const canvasContext = canvasRef?.current?.getContext('2d');
    if (!canvasContext) {
      return;
    }

    fillPixelGrid(canvasContext, pixels);
    if (showGrid) {
      drawGrid(canvasContext, '#e0e0e0');
    }
  }

  const fillPixelGrid = (
    canvasContext: CanvasRenderingContext2D,
    pixels: string[][]
  ) => {
    for(let i = 0; i < pixels.length; i++) {
      for (let j = 0; j < pixels[0].length; j++) {
        fillPixel(canvasContext, i, j, pixels[i][j]);
      }
    }
  }

  const fillPixel = (
    canvasContext: CanvasRenderingContext2D,
    x: number,
    y: number,
    colorHex: string,
  ) => {
    canvasContext.fillStyle = colorHex;

    const startX = x * pixelWidth;
    const startY = y * pixelHeight;
    canvasContext.fillRect(startX, startY, pixelWidth, pixelHeight);
  }

  const drawGrid = (
    canvasContext: CanvasRenderingContext2D,
    colorHex: string,
  ) => {
    canvasContext.strokeStyle = colorHex;
    canvasContext.lineWidth = 4;

    // Bounding box
    canvasContext.rect(0, 0, width, height);

    for (let i = 1; i < numPixelsPerSide; i++) {
      // Vertical line
      canvasContext.moveTo((width / numPixelsPerSide) * i, 0);
      canvasContext.lineTo((width / numPixelsPerSide) * i, height);

      // Horizontal line
      canvasContext.moveTo(0, (height / numPixelsPerSide) * i);
      canvasContext.lineTo(width, (height / numPixelsPerSide) * i);
    }
    
    // Draw
    canvasContext.stroke();
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (e.button !== 0) {
      return;
    }
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
    const relativeX = Math.floor(e.pageX - canvasBoundingRect.left);
    const relativeY = Math.floor(e.pageY - canvasBoundingRect.top);

    // Find the clicked pixel using the following ratio:
    // relativeX / boundingXLen = pixelIdxX / numPixels
    // pixelIdxX = relativeX * numPixels / boundingXLen
    const boundingXLen = canvasBoundingRect.right - canvasBoundingRect.left;
    const pixelIdxX = Math.floor(relativeX * numPixelsPerSide / boundingXLen);
    const boundingYLen = canvasBoundingRect.bottom - canvasBoundingRect.top;
    const pixelIdxY = Math.floor(relativeY * numPixelsPerSide / boundingYLen);
    
    // Cache pixel color and useEffect will re-draw
    setPixelColor(pixelIdxX, pixelIdxY, color);
  }

  const savePixelState = () => {
    if (onSave) {
      onSave(pixels);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: isEditMode ? 'center' : 'start'}}>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: isEditMode ? '500px' : '2000px', width: '100%'}}>
        {isEditMode &&
          <Stack direction='row' spacing={2} paddingBottom={1} justifyContent='center'>
            <div>
              <label>Set Color: </label>
              <input
                type='color'
                id='colorInput'
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div>
              <label>Show Guide: </label>
              <input
                type='checkbox'
                id='toggleGrid'
                checked={showGrid}
                onChange={() => {setShowGrid(!showGrid)}}
              />
            </div>
            <div>
              <button type='button' id='clearButton' onClick={clearCanvas}>
                Clear
              </button>
            </div>
          </Stack>
        }
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ cursor: isEditMode ? 'pointer' : 'default' }}
          onMouseDown={handleCanvasClick}
        />
        {isEditMode &&
          <Button
            type='submit'
            variant='contained'
            className='save-modal-button'
            sx={{ mt: 3, mb: 2 }}
            onClick={savePixelState}
          >
            Save
          </Button>
        }
      </div>
    </div>
  )
}

export default class PixelArtBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    const {
      numPixelsPerSide,
      pixelsArrStringified,
    } = this.model.data;
    const pixels = JSON.parse(pixelsArrStringified);

    return (
      <PixelCanvas
        numPixelsPerSide={parseInt(numPixelsPerSide)}
        isEditMode={false}
        initialPixels={pixels}
      />
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const numPixels = 5;
    const {
      numPixelsPerSide,
      pixelsArrStringified,
    } = this.model.data;
    const onSave = (pixels: string[][]) => {
      this.model.data['numPixelsPerSide'] = numPixels.toString();
      this.model.data['pixelsArrStringified'] = JSON.stringify(pixels);
      done(this.model);
    }
    return (
      <PixelCanvas
        numPixelsPerSide={(numPixelsPerSide && parseInt(numPixelsPerSide)) || numPixels}
        initialPixels={pixelsArrStringified && JSON.parse(pixelsArrStringified)}
        isEditMode={true}
        onSave={onSave}
      />
    )
  }

  renderErrorState() {
    return (
      <h1>An unexpected error has occurred</h1>
    )
  }
}
