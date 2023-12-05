import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'

import CSS from 'csstype';
import React, { useEffect, useRef, useState } from 'react';
import { SizeMe, SizeMeProps } from 'react-sizeme';
import { Button, Stack, Grid } from '@mui/material';

interface BasePixelCanvasProps {
  initialNumPixelsPerSide: number;          // e.g. '5' represents a 5x5 pixel grid
  isEditMode: boolean;                      // True if edit mode, false if display mode
  initialPixels?: string[][];               // Used to render from an existing state
  shouldShowGridInViewMode?: boolean;       // User sets this value
  initialBackgroundColor?: string;         // Sets the initial background color, important for loading state
  onSave?: ((                               // Callback for saving state when editing
    numPixelsPerSide: number,
    pixels: string[][],
    showGridInViewMode: boolean,
    backgroundColor: string,
  ) => void);
}

interface PixelCanvasProps extends BasePixelCanvasProps {
  size: SizeMeProps['size'];
}

const PixelCanvas: React.FC<PixelCanvasProps> = (props: PixelCanvasProps) => {
  const {
    size,
    initialNumPixelsPerSide,
    isEditMode,
    initialPixels,
    shouldShowGridInViewMode,
    initialBackgroundColor,
    onSave,
  } = props;
  const [backgroundColor, setBackgroundColor] = useState(initialBackgroundColor || '#f2f2f2');
  const [numPixelsPerSide, setNumPixelsPerSide] = useState<number>(initialNumPixelsPerSide);
  const generateDefaultPixelsState = () => {
    return Array.from(
      { length: numPixelsPerSide }, _ => Array(numPixelsPerSide).fill(backgroundColor));
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#000000');
  const [pixels, setPixels] = useState<string[][]>(initialPixels || generateDefaultPixelsState());
  const [
    showGridInViewMode,
    setShowGridInViewMode,
  ] = useState(shouldShowGridInViewMode || false);
  const [showGrid, setShowGrid] = useState(showGridInViewMode || isEditMode);
  const [isMouseDownOnCanvas, setIsMouseDownOnCanvas] = useState(false);
  const [buttonClicked, setButtonClicked] = useState<number | null>(null);

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
    ensureValidPixelsArray();
    drawPixelArt(showGrid);
  }, [backgroundColor, pixels, showGrid, numPixelsPerSide]);

  useEffect(() => {
    // Update state variables based on changes to props
    initialPixels && setPixels(initialPixels);
    setShowGrid(shouldShowGridInViewMode || isEditMode);
  }, [props])

  const clearCanvas = () => {
    const canvasContext = canvasRef?.current?.getContext('2d');
    if (!canvasContext) {
      return;
    }

    setPixels(generateDefaultPixelsState());
    drawPixelArt(showGrid);
  }

  const ensureValidPixelsArray = () => {
    if (pixels.length === numPixelsPerSide) {
      return;
    }
    const newPixels = generateDefaultPixelsState();
    for (let i = 0; i < newPixels.length; i++) {
      for (let j = 0; j < newPixels.length; j++) {
        if (i < pixels.length && j < pixels.length) {
          newPixels[i][j] = pixels[i][j];
        }
      }
    }
    setPixels(newPixels);
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
    for (let i = 0; i < pixels.length; i++) {
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

  const resetBackground = (
    colorHex: string,
  ) => {
    const canvasContext = canvasRef?.current?.getContext('2d');
    if (!canvasContext) {
      return;
    }
    for (let i = 0; i < pixels.length; i++) {
      for (let j = 0; j < pixels.length; j++) {
        if (pixels[i][j] === backgroundColor) {
          pixels[i][j] = colorHex;
        }
      }
    }
    setBackgroundColor(colorHex);
  }

  const drawGrid = (
    canvasContext: CanvasRenderingContext2D,
    colorHex: string,
  ) => {
    canvasContext.beginPath();
    canvasContext.strokeStyle = colorHex;
    canvasContext.lineWidth = getGridLineWidth();

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

    // Bounding rectangle
    canvasContext.beginPath();
    canvasContext.lineWidth = canvasContext.lineWidth;
    canvasContext.rect(0, 0, width, height);
    canvasContext.stroke();
  }

  const getGridLineWidth = () => {
    if (numPixelsPerSide < 10) {
      return 4;
    } else if (numPixelsPerSide < 20) {
      return 2;
    } else {
      return 1;
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setIsMouseDownOnCanvas(true);
    setButtonClicked(e.button);
    handleMouseOverPixel(e);
  }

  const handleCanvasDrag = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isMouseDownOnCanvas) {
      return;
    }
    handleMouseOverPixel(e);
  }

  const handleMouseOverPixel = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isEditMode) {
      return;
    }

    if (!(buttonClicked === 0 || buttonClicked === 2)) {
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
    setPixelColor(pixelIdxX, pixelIdxY, buttonClicked === 0 ? color : backgroundColor);
  }

  const savePixelState = () => {
    if (onSave) {
      onSave(numPixelsPerSide, pixels, showGridInViewMode, backgroundColor);
    }
  }

  const handleCanvasMouseUp = () => {
    setIsMouseDownOnCanvas(false);
    setButtonClicked(null);
  }

  const canvasStyles: CSS.Properties = {
    cursor: isEditMode ? 'pointer' : 'default',
    aspectRatio: 1,
    backgroundColor: backgroundColor,
    display: 'block',
  }
  const hundredPercentKey = size && size.width && size.height && size.width > size.height ? 'height' : 'width';
  canvasStyles[hundredPercentKey] = '100%';

  return (
    <div>
      {isEditMode &&
        <Grid container spacing={2} justifyContent='center'>
          <Grid item xs={6} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                style={{ border: "none", backgroundColor: "white", padding: 0, margin: 0, marginRight: '12px', }}
                type='color'
                id='colorInput'
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <label>Pixel color</label>
            </div>
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', alignItems: 'center', }}>
            <div style={{ display: 'flex', alignItems: 'center', }}>
              <input
                style={{ border: "none", backgroundColor: "white", padding: 0, margin: 0, marginRight: '12px' }}
                type='checkbox'
                id='toggleGrid'
                checked={showGrid}
                onChange={() => { setShowGrid(!showGrid) }}
              />
              <label>Show guides</label>
            </div>
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', alignItems: 'center', paddingTop: 4, }}>
            <div style={{ display: 'flex', alignItems: 'center', }}>
              <input
                style={{ border: "none", outline: "none", backgroundColor: "white", padding: 0, margin: 0, marginRight: '12px', }}
                type='color'
                id='colorInput'
                value={backgroundColor}
                onChange={(e) => resetBackground(e.target.value)}
              />
              <label>Background color</label>
            </div>
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', alignItems: 'center', paddingTop: 4, }}>
            <div style={{ display: 'flex', alignItems: 'center', }}>
              {/* TODO: How can i make this a set of exclusive radio buttons? */}
              <input
                style={{ width: '100%', maxWidth: '60px', padding: 0, margin: 0, marginRight: '12px', }}
                type='range'
                id='pixelsPerSideInput'
                min={2}
                max={30}
                value={numPixelsPerSide}
                onChange={(e) => setNumPixelsPerSide(parseInt(e.target.value))}
              />
              <label>Pixels per side</label>
            </div>
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', }}>
              <label>Show Guides on Post? </label>
              <input
                type='checkbox'
                id='toggleShowGridInViewMode'
                checked={showGridInViewMode}
                onChange={() => { setShowGridInViewMode(!showGridInViewMode) }}
              />
            </div>
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
            <p>Tip: Right-click to undo</p>
          </Grid>
        </Grid>
      }
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={canvasStyles}
        onMouseDown={handleCanvasClick}
        onMouseMove={handleCanvasDrag}
        onMouseUp={() => setIsMouseDownOnCanvas(false)}
        onContextMenu={(e) => e.preventDefault()}
      />
      {isEditMode &&
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '10px', }}>
          <Button 
            style={{ 
              width: '50%', 
              backgroundColor: '#E9E9E9', 
              color: 'black', 
              fontFamily: 'Public Sans',
              borderRadius: 24,
              fontSize: '16px', 
              fontWeight: 'bold', 
              border: 'none', 
              paddingBlock: '12px', 
              paddingInline: '4px', 
            }}
            type='button' 
            id='clearButton' 
            onClick={clearCanvas}
          >
            Start Over
          </Button>
          <Button
            style={{ fontWeight: 'bold', width: '33%', fontFamily: 'Public Sans', paddingBlock: '12px', paddingInline: '4px', fontSize: '16px', }}
            type='submit'
            variant='contained'
            className='save-modal-button'
            onClick={savePixelState}
          >
            Save
          </Button>
        </div>
      }
    </div>
  );
};

const PixelCanvasWithSize = (props: BasePixelCanvasProps) => {
  return (
    <SizeMe monitorHeight refreshMode='debounce'>
      {({ size }) => (
        <div style={{
          backgroundColor: props.initialBackgroundColor,
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

        }}>
          <PixelCanvas
            {...props}
            size={size}
          />
        </div>
      )}
    </SizeMe>
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
      shouldShowGridInViewMode,
      backgroundColor,
    } = this.model.data;
    const pixels = JSON.parse(pixelsArrStringified);
    const showGridInViewMode = shouldShowGridInViewMode
      ? Boolean(parseInt(shouldShowGridInViewMode))
      : false;

    return (
      <div style={{
        backgroundColor: backgroundColor,
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

      }}>
        <PixelCanvasWithSize
          initialNumPixelsPerSide={parseInt(numPixelsPerSide)}
          isEditMode={false}
          initialPixels={pixels}
          shouldShowGridInViewMode={showGridInViewMode}
          initialBackgroundColor={backgroundColor}
        />
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const defaultNumPixels = 5;
    const {
      numPixelsPerSide,
      pixelsArrStringified,
      shouldShowGridInViewMode,
      backgroundColor,
    } = this.model.data;

    const onSave = (
      numPixelsPerSide: number,
      pixels: string[][],
      showGridInViewMode: boolean,
      backgroundColor: string
    ) => {
      this.model.data['numPixelsPerSide'] = numPixelsPerSide.toString();
      this.model.data['pixelsArrStringified'] = JSON.stringify(pixels);
      this.model.data['shouldShowGridInViewMode'] = Number(showGridInViewMode).toString();
      this.model.data['backgroundColor'] = backgroundColor;
      done(this.model);
    }

    return (
      <PixelCanvasWithSize
        initialNumPixelsPerSide={(numPixelsPerSide && parseInt(numPixelsPerSide)) || defaultNumPixels}
        initialPixels={pixelsArrStringified && JSON.parse(pixelsArrStringified)}
        isEditMode={true}
        shouldShowGridInViewMode={Boolean(parseInt(shouldShowGridInViewMode))}
        initialBackgroundColor={backgroundColor}
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
