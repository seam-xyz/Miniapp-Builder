import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import WhiteboardImage from './assets/WhiteboardBlock/background.png'

import CSS from 'csstype';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Grid }  from '@mui/material';

interface DrawableCanvasInitialUserState {
  initialBackgroundColor: string,  // Hex string e.g. '#123abc'
  initialForegroundColor: string,  // Hex string e.g. '#123abc'
}

interface DrawableCanvasProps {
  height: number,
  width: number
  userInitialState: DrawableCanvasInitialUserState,
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
  // {lastX: -1, lastY: -1, x: 1, y: 1}
  // Negative vals for lastX, lastY mean this is the first point
  const [lastPos, setLastPos] = useState({x: -1, y: -1});
  const [currPos, setCurrPos] = useState({x: 0, y: 0});

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

    // Cache pixel color and useEffect will re-draw
    if (isDrawing) {
      setLastPos({x: currPos.x, y: currPos.y});
    }
    setCurrPos({x: relativeX, y: relativeY});
  }

  const handleStartDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    handleDrawDrag(e);
    // TODO: Draw single dot
  }

  const handleStopDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(false);
    setLastPos({x: -1, y: -1});
  }

  // FUTURE: Expose as a customizable callback in props, takes a canvas context as an arg, can be used to access canvas
  const draw = useCallback(() => {
    const canvasContext = canvasRef?.current?.getContext('2d');
    if (!canvasContext) {
      return;
    }

    if (!isDrawing) {
      return;
    }

    // Don't draw anything if we haven't moved from one spot to another
    if(!(lastPos.x >= 0 && lastPos.y >= 0)) {
      return;
    }

    canvasContext.moveTo(lastPos.x, lastPos.y);
    canvasContext.lineWidth = 4;
    canvasContext.strokeStyle = initialForegroundColor;
    canvasContext.lineTo(currPos.x, currPos.y);
    canvasContext.stroke();

    // Update model state on every redraw... pretty inefficient; need to be able to listen to the external button event though
    const imageData = canvasRef?.current?.toDataURL('image/png');
    if (imageData) {
      updateState(310, 480, initialBackgroundColor, imageData);
    }
  }, [isDrawing, lastPos, currPos, initialForegroundColor, initialBackgroundColor, updateState])

  // === Handle Renders and Re-renders ===
  // Update sate variables based on changes to position
  useEffect(() => {
    draw();
  }, [lastPos, currPos, draw])

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
  const height =  Math.floor(292/450 * width);
  const initialUserState = {
    initialForegroundColor: props.initialForegroundColor,
    initialBackgroundColor: props.initialBackgroundColor,
  }

  return (
    <>
      <div className='relative'>
        <img src={WhiteboardImage} className='object-cover'></img>
        <div className='absolute top-2 left-2'>
          <DrawableCanvas
            width={width}
            height={height}
            userInitialState={initialUserState}
            updateState={props.updateState}
          />
        </div>
      </div>
      <Grid container>
        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', pt: 0, }}>
          <Button
              type='submit'
              variant='contained'
              className='save-modal-button'
              onClick={onSave}
            >
              PREVIEW
          </Button>
        </Grid>
      </Grid>
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

    const styles: CSS.Properties = {};
    const hundredPercentKey = width && height && width > height ? 'height' : 'width';
    styles[hundredPercentKey] = '100%';

    return (
      <>
        <img src={imageData} style={styles}></img>
      </>
    );
  }

  renderEditModal(done: (data: BlockModel) => void, width?: string) {
    console.log('got the width in render', width);
    const widthInt = width !== undefined ? stringSizeToNumber(width) - 20 : 450;
    const defaultBackgroundColor = '#ffffff';
    const defaultForegroundColor = '#000000';

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
