import { ComposerComponentProps, FeedComponentProps } from './types'
import './BlockStyles.css'

import CSS from 'csstype';
import React, { useEffect, useRef, useState } from 'react';
import { Grid, Box } from '@mui/material';
import SeamSaveButton from '../components/SeamSaveButton';

interface PixelCanvasProps {
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

const PixelCanvas: React.FC<PixelCanvasProps> = (props: PixelCanvasProps) => {
  const {
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

    const isAnyPixelColored = pixels.some(row => row.some(pixelColor => pixelColor !== backgroundColor));

    if (!isAnyPixelColored) {
      alert("Please add at least one pixel before saving.");
      return;
    }

    if (onSave) {
      onSave(numPixelsPerSide, pixels, showGridInViewMode, backgroundColor);
    }
  }

  const canvasStyles: CSS.Properties = {
    cursor: isEditMode ? 'pointer' : 'default',
    aspectRatio: 1,
    backgroundColor: backgroundColor,
    display: 'block',
  }

  canvasStyles['width'] = '100%';

  return (
    <div>
      {isEditMode &&
        <Grid container spacing={0} sx={{ pt: 0, }} justifyContent='center'>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', pt: 0, }}>
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
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', pt: 0, }}>
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
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', paddingTop: 0, }}>
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
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', paddingTop: 0, }}>
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
          <Grid item xs={6} sx={{ margin: 0, pt: 0, }}>
            <div style={{ paddingTop: 0 }}>
              <label>Show Guides on Post? </label>
              <input
                type='checkbox'
                id='toggleShowGridInViewMode'
                checked={showGridInViewMode}
                onChange={() => { setShowGridInViewMode(!showGridInViewMode) }}
              />
            </div>
          </Grid>
          <Grid item xs={6} sx={{ margin: 0, pt: 0, }}>
            <p style={{ margin: 0 }}>Tip: Right-click to undo</p>
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
        <Box className="space-y-2" style={{ paddingBottom: `calc(env(safe-area-inset-bottom, 24px) + 24px)` }} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 3, bgcolor: 'background.paper', boxShadow: 3, zIndex: 1301 }}>
          <SeamSaveButton onClick={savePixelState} />
        </Box>
      }
    </div>
  );
};

const PixelCanvasWithSize = (props: PixelCanvasProps) => {
  return (
    <div style={{
      backgroundColor: props.initialBackgroundColor,
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'between',

    }}>
      <PixelCanvas {...props} />
    </div>
  );
}

export const PixelArtFeedComponent = ({ model }: FeedComponentProps) => {
  const {
    numPixelsPerSide,
    pixelsArrStringified,
    shouldShowGridInViewMode,
    backgroundColor,
  } = model.data;
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

export const PixelArtComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const defaultNumPixels = 5;
  const {
    numPixelsPerSide,
    pixelsArrStringified,
    shouldShowGridInViewMode,
    backgroundColor,
  } = model.data;

  const onSave = (
    numPixelsPerSide: number,
    pixels: string[][],
    showGridInViewMode: boolean,
    backgroundColor: string
  ) => {
    model.data['numPixelsPerSide'] = numPixelsPerSide.toString();
    model.data['pixelsArrStringified'] = JSON.stringify(pixels);
    model.data['shouldShowGridInViewMode'] = Number(showGridInViewMode).toString();
    model.data['backgroundColor'] = backgroundColor;
    done(model);
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
