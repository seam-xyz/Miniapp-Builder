import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import React, { useEffect, useRef, useState } from 'react';

import ImageIcon from '@mui/icons-material/Image';
import SeamSaveButton from '../components/SeamSaveButton';
import { propsToClassKey } from '@mui/styles';
import { SelfImprovement } from '@mui/icons-material';

// Block model .data
interface ImagePuzzleData {
  imageData: string;  // Base64 image data serialized to Block.model.
  puzzleSize: number;  // Puzzle size, in tiles.
  imagePos: Coordinate2D;  // Image position, in pixels (origin at center.)
  zoomLevel: number;  // The raw zoom level from 1.0 to maxZoomLevel.
}

// Tile for the game board
interface ImagePuzzleTileProps {
  puzzleSize: number;  // Puzzle size, in tiles.
  tileId: number;  // Unique ID that corresponds to the "correct" position in the puzzle.
  pos: number;  // The current position on the grid.
  image: HTMLImageElement | undefined;  // Curently-loaded image.
  boardDims: Coordinate2D;  // Size of the puzzle grid, in pixels.
  onTileClicked: (tileId: number) => void;
  imagePos: Coordinate2D;  // Image position, in pixels (origin at center).
  zoomLevel: number;  // The raw zoom level from 1.0 to maxZoomLevel.
  puzzleSolved: boolean;
}
function ImagePuzzleTile(props: ImagePuzzleTileProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState<number>(100);
  
  // Render image.
  useEffect(() => {
    if (!props.image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas?.getContext('2d');
    if (!context) return;

    const tileDims = [Math.ceil(props.boardDims[0] / props.puzzleSize), Math.ceil(props.boardDims[1] / props.puzzleSize)];
    canvas.width = tileDims[0];
    canvas.height = tileDims[1];
    
    const imageDims: Coordinate2D = [props.image.width, props.image.height];
    const canvasDims: Coordinate2D = [canvas.width, canvas.height];
    const zoom = normalizeZoomLevel(props.zoomLevel, imageDims, props.boardDims);

    // Coordinates of current tile on the puzzle grid (before shuffling tiles). Origin at (0, 0) in center of grid.
    // For example, a 4x4 grid will have values [-1.5, -0.5, 0.5, 1.5] since canvases are measured from their top left.
    const selfGridCoords = [
      props.tileId % props.puzzleSize - (props.puzzleSize - 1) / 2,
      Math.floor(props.tileId / props.puzzleSize) - (props.puzzleSize - 1) / 2
    ];
    // Transform the global image position to a local (per-tile) one.
    const imagePos = [
      props.imagePos[0] + selfGridCoords[0] * canvasDims[0] / zoom,
      props.imagePos[1] + selfGridCoords[1] * canvasDims[1] / zoom
    ];

    const [sx, sy, sw, sh] = [
      imagePos[0] + imageDims[0] / 2 - canvasDims[0] / 2 / zoom,
      imagePos[1] + imageDims[1] / 2 - canvasDims[1] / 2 / zoom,
      canvasDims[0] / zoom,
      canvasDims[1] / zoom
    ];
    const [dx, dy, dw, dh] = [0, 0, canvasDims[0], canvasDims[1]]; 

    context.drawImage(props.image, sx, sy, sw, sh, dx, dy, dw, dh);
  }, [props.image]);

  // Trigger win animation.
  useEffect(() => {
    if (!props.puzzleSolved) return;
    console.log('Playing anim');
    const initDelayCoeff = 100;
    const scaleSize = 75;
    const delay = 350;
    const diagonal = getDiagonal();

    const initDelay = 300 + initDelayCoeff * diagonal;
    setTimeout(() => {
      setScale(scaleSize);
      console.log(1);
      setTimeout(() => {
        setScale(100);
        console.log(2);
      }, delay);
    }, initDelay);
  }, [props.puzzleSolved]);

  // Returns which "diagonal" the tile sits on for win animation.
  function getDiagonal(): number {
    const row = Math.floor(props.pos / props.puzzleSize);
    const col = props.pos % props.puzzleSize;
    return row + col;
  }

  console.log(props.puzzleSolved);

  return (
    <div
      className='aspect-square absolute transition-transform duration-300 border border-white rounded-lg overflow-hidden'
      style={{
        transform: `translate(calc(100% * ${props.pos % props.puzzleSize}), calc(100% * ${Math.floor(props.pos / props.puzzleSize)})) scale(${scale}%)`,
      }}
      onClick={() => props.onTileClicked(props.tileId)}
    >
      <canvas ref={canvasRef} />
    </div>
  )
}

// Game piece (abstract)
interface Tile {
  tileId: number;  // Unique ID that corresponds to the "correct" position on the grid.
  pos: number;  // Current position of the tile on the grid.
}
// Game board
interface ImagePuzzleBoardProps {
  puzzleSize: number; // Puzzle size, in tiles.
  onTileClicked: (tileId: number) => void;
  image: HTMLImageElement | undefined;  // Currently-loaded image.
  tiles: Tile[];  // A list of all tiles and their corresponding positions.
  imagePos: Coordinate2D;  // The image position, in pixels (origin at center.)
  zoomLevel: number; // The raw zoom level, from 1.0 to maxZoomLevel.
  puzzleSolved: boolean;  // Whether or not the puzzle is solved.
}
function ImagePuzzleBoard(props: ImagePuzzleBoardProps) {
  const selfRef = useRef<HTMLDivElement | null>(null);

  function getBoardDims(): Coordinate2D {
    const board = selfRef.current;
    if (!board) return [0, 0];
    else return [board.clientWidth, board.clientHeight];
  }

  return (
    <div className='flex flex-0 w-full max-w-[50vh] aspect-square self-center' ref={selfRef} >
        {
          props.tiles.map(tile => 
            <ImagePuzzleTile
              key={tile.tileId} puzzleSize={props.puzzleSize}
              tileId={tile.tileId} pos={tile.pos} image={props.image} 
              boardDims={getBoardDims()} 
              onTileClicked={(tileId: number) => props.onTileClicked(tileId)}
              imagePos={props.imagePos} zoomLevel={props.zoomLevel}
              puzzleSolved={props.puzzleSolved}
            />
          )
        }
    </div>
  );
}

// Puzzle size selector option
interface ImagePuzzleSizeSelectorOptionProps {
  value: number;  // The puzzle size value represented by this component.
  onSizeChanged: (puzzleSize: number) => void;
  puzzleSize: number;  // The current puzzle size, in tiles.
}
function ImagePuzzleSizeSelectorOption(props: ImagePuzzleSizeSelectorOptionProps) {
  return (
    <div 
      className='flex-1 basis-1/3 drop-shadow-sm p-4 text-center text-lg rounded-md'
      onClick={() => props.onSizeChanged(props.value)}
      style={{ border: props.puzzleSize === props.value ? 'solid 2px #a61aad' : 'solid 1px #aaaaaa' }}
    >
      {props.value}x{props.value}
    </div>
  );
}

// Puzzle size selector
interface ImagePuzzleSizeSelectorProps {
  onSizeChanged: (value: number) => void
  puzzleSize: number // The current puzzle size, in tiles.
}
function ImagePuzzleSizeSelector(props: ImagePuzzleSizeSelectorProps) {
  return (
    <div className='flex flex-row items-center gap-4'>
      <p className='flex-0'>Size</p>
      <ImagePuzzleSizeSelectorOption value={3} onSizeChanged={props.onSizeChanged} puzzleSize={props.puzzleSize} />
      <ImagePuzzleSizeSelectorOption value={4} onSizeChanged={props.onSizeChanged} puzzleSize={props.puzzleSize} />
      <ImagePuzzleSizeSelectorOption value={5} onSizeChanged={props.onSizeChanged} puzzleSize={props.puzzleSize} />
    </div>
  )
}

// Sets only inner borders for the overlay grid, with box at index in a grid with dimensions side x side
function getBorderStyleGrid(index: number, side: number, borderWidth: string): string {
  const top = index < side ? '0px' : borderWidth;
  const right = index % side === side - 1 ? '0px' : borderWidth;
  const bottom = index >= (side ** 2 - side) ? '0px' : borderWidth;
  const left = index % side === 0 ? '0px' : borderWidth;

  return [top, right, bottom, left].join(' ');
}

type Coordinate2D = [number, number];
type Bounds = [Coordinate2D, Coordinate2D];

// Normalize zoom such that 1.0 is the furthest you can zoom without introducing whitespace
function normalizeZoomLevel(zoomLevel: number, imageDims: Coordinate2D, canvasDims: Coordinate2D): number {
  return Math.max(canvasDims[0] / imageDims[0], canvasDims[1] / imageDims[1]) * zoomLevel;
}

// Get the minimum and maximum allowable values for the image position without introducing whitespace
function getImagePosBounds(zoom: number, imageDims: Coordinate2D, canvasDims: Coordinate2D): Bounds {
  const xMin = -(imageDims[0] - canvasDims[0] / zoom) / 2;
  const xMax = (imageDims[0] - canvasDims[0] / zoom) / 2;
  const yMin = -(imageDims[1] - canvasDims[1] / zoom) / 2;
  const yMax = (imageDims[1] - canvasDims[1] / zoom) / 2;

  return [[xMin, xMax], [yMin, yMax]];
}

function addCoordinateXY(a: Coordinate2D, b: Coordinate2D): Coordinate2D {
  return [a[0] + b[0], a[1] + b[1]];
}

function clampCoordinateXYToBounds(d: Coordinate2D, b: Bounds): Coordinate2D {
  const x = Math.max(b[0][0], Math.min(b[0][1], d[0]));
  const y = Math.max(b[1][0], Math.min(b[1][1], d[1]));
  const d0: Coordinate2D = [x, y];
  return d0;
}

// Image uploader
interface ImagePuzzleUploadProps {
  onImageUploaded: (value: File) => void;
  image: HTMLImageElement | null;  // Currently-loaded image.
  imagePos: Coordinate2D;  // The image position, in pixels (origin at center.)
  setImagePos: (imagePos: Coordinate2D) => void;
  puzzleSize: number;  // The puzzle size, in tiles.
  zoomLevel: number;  // The raw zoom level, from 1.0 to maxZoomLevel
  onSlideZoom: (zoomLevel: number, canvasDims: Coordinate2D) => void;  // Called on changing the range <input>
  maxZoomLevel: number  // The maximum value for zoomLevel
}
function ImagePuzzleUpload(props: ImagePuzzleUploadProps) {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [prevMousePos, setPrevMousePos] = useState<Coordinate2D | null>(null);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [prevTouchPos, setPrevTouchPos] = useState<Coordinate2D | null>(null);
  const [prevTouchDistance, setPrevTouchDistance] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  // Render image.
  useEffect(() => {
    if (!props.image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const imageDims: Coordinate2D = [props.image.width, props.image.height];
    const canvasDims: Coordinate2D = [canvas.width, canvas.height];
    const zoom = normalizeZoomLevel(props.zoomLevel, imageDims, canvasDims);
    
    const [sx, sy, sw, sh] = [
      props.imagePos[0] + imageDims[0] / 2 - canvasDims[0] / 2 / zoom,
      props.imagePos[1] + imageDims[1] / 2 - canvasDims[1] / 2 / zoom,
      canvasDims[0] / zoom,
      canvasDims[1] / zoom
    ];
    const [dx, dy, dw, dh] = [0, 0, canvasDims[0], canvasDims[1]];
    
    context.clearRect(0, 0, canvasDims[0], canvasDims[1]);
    context.drawImage(props.image, sx, sy, sw, sh, dx, dy, dw, dh);
  }, [props.imagePos, props.zoomLevel, props.image]);

  function onTouchMove(e: React.TouchEvent) {
    if (!props.image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const zoom = normalizeZoomLevel(props.zoomLevel, [props.image.width, props.image.height], [canvas.width, canvas.height]);

    const dragCoeff = -1 / zoom;
    
    if (e.touches.length === 1) {
      const touchPos = [e.touches[0].screenX, e.touches[0].screenY]
      if (prevTouchPos) {
        const dTouchPos: Coordinate2D = [(touchPos[0] - prevTouchPos[0]) * dragCoeff, (touchPos[1] - prevTouchPos[1]) * dragCoeff];
        const imagePosBounds = getImagePosBounds(zoom, [props.image.width, props.image.height], [canvas.width, canvas.height]);
        const imagePos0 = clampCoordinateXYToBounds(addCoordinateXY(props.imagePos, dTouchPos), imagePosBounds);
        props.setImagePos(imagePos0);
      }
      setPrevTouchPos([touchPos[0], touchPos[1]]);
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (e.touches.length === 1) {
      setPrevTouchDistance(null);
    } else if (e.touches.length === 0) {
      setPrevTouchPos(null);
    }
  }

  function onZoomLevelInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const zoomLevel = Number(e.target.value);
    const canvasDims: Coordinate2D = [canvas.width, canvas.height];
    props.onSlideZoom(zoomLevel, canvasDims)
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isMouseDown) return;
    if (!props.image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const zoom = normalizeZoomLevel(props.zoomLevel, [props.image.width, props.image.height], [canvas.width, canvas.height]);

    const dragCoeff = -1 / zoom;
    
    const mousePos: Coordinate2D = [e.clientX, e.clientY]
    if (prevMousePos) {
      const dMousePos: Coordinate2D = [(mousePos[0] - prevMousePos[0]) * dragCoeff, (mousePos[1] - prevMousePos[1]) * dragCoeff];
      const imagePosBounds = getImagePosBounds(zoom, [props.image.width, props.image.height], [canvas.width, canvas.height]);
      const imagePos0 = clampCoordinateXYToBounds(addCoordinateXY(props.imagePos, dMousePos), imagePosBounds);
      props.setImagePos(imagePos0);
    }
    setPrevMousePos([mousePos[0], mousePos[1]]);
  }

  function onMouseDown() {
    setIsMouseDown(true);
  }

  function onMouseUp() {
    setIsMouseDown(false);
    setPrevMousePos(null);
  }

  return (
    <>
      <div className='flex flex-col flex-0 basis-full mt-4 max-w-[50vh] w-full mx-auto gap-4'>
        <div
          className='flex flex-col w-full h-full aspect-square border-2 border-[#cccccc] rounded-lg drop-shadow-md items-center justify-center overflow:hidden relative'
          onClick={() => props.image || fileInput.current?.click()}
          onTouchMove={e => onTouchMove(e)}
          onTouchEnd={e => onTouchEnd(e)}
          onMouseMove={e => onMouseMove(e)}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          ref={divRef}
        >
          {
            props.image
            ? <>
              <div className='absolute flex flex-wrap flex-0 t-0 r-0 b-0 l-0 w-full h-full rounded-lg'>
                {
                  Array(props.puzzleSize ** 2).fill(0).map((_, i) =>
                    <div key={i}
                      className='flex-0 border-[#ffffff99]'
                      style={{ borderWidth: getBorderStyleGrid(i, props.puzzleSize, '1px'), flexBasis: `calc(100% / ${props.puzzleSize})` }}
                    />
                  )
                }
              </div>
              <canvas ref={canvasRef} width={divRef.current?.clientWidth} height={divRef.current?.clientHeight} />
            </>
            : <>
              <ImageIcon htmlColor='#aaaaaa' style={{ fontSize: '6rem' }} />
              <p className='text-[#aaaaaa] select-none'>Upload Image</p>
            </>
          }
        </div>
        <input ref={fileInput} type='file' name='file' accept='image/*' onChange={e => e.target.files?.item(0) && props.onImageUploaded(e.target.files[0])} hidden />
      <input type='range' min={1.0} max={props.maxZoomLevel} step='0.1' value={props.zoomLevel} onChange={onZoomLevelInputChange} />
      </div>
    </>
  )
}

// Default view for the block
interface ImagePuzzleProps {
  data: ImagePuzzleData;
}
function ImagePuzzle(props: ImagePuzzleProps) {
  const [tiles, setTiles] = useState<Array<Tile>>([])
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  const [solved, setSolved] = useState<boolean>(false);

  const puzzleSize = props.data.puzzleSize;
  const imageData = props.data.imageData;
  const imagePos = props.data.imagePos;
  const zoomLevel = props.data.zoomLevel;

  // Init image and shuffle.
  useEffect(() => {
    const image = new Image();
    image.src = imageData;
    image.onload = () => {
      setImage(image);
    };
    const tiles0 = getRandomMove(getInitPositions(), 500);
    setTiles(tiles0);
  }, []);

  function tileNeighbors(tiles: Tile[], posA: number, posB: number): boolean {
    if (posA < 0 || posB < 0 || posA >= puzzleSize ** 2 || posB >= puzzleSize ** 2) return false;  // One of the tiles doesn't exist.
    const directions = {
      'up': -puzzleSize,
      'right': 1,
      'down': puzzleSize,
      'left': -1
    };
    const dPos = posB - posA;
    const dir = Object.entries(directions).find(direction => direction[1] === dPos)?.at(0);
    if (!dir) return false;  // Tiles are not in a cardinal direction from one another.
    if ((dir === 'right' && posA % puzzleSize === puzzleSize - 1) || (dir === 'left' && posA % puzzleSize === 0)) {
      return false;  // Direction implies a row wrap
    }
    return true;
  }

  function findEmptyPos(tiles: Tile[]): number {
    const result = Array(puzzleSize ** 2).fill(0)
      .map((_, i) => i)
      .filter(i => 
        !tiles.map(tile => tile.pos).includes(i)
      )
      .at(0);
    if (result === undefined) throw new Error('Could not find empty position');

    return result;
  }

  function getInitPositions() {
    return Array(puzzleSize ** 2 - 1).fill(0).map((_, i): Tile => ({tileId: i, pos: i}));
  }

  function applyMove(tiles: Tile[], posTile: number): Tile[] {
    const posEmpty = findEmptyPos(tiles);
    if (!tileNeighbors(tiles, posTile, posEmpty)) {
      return tiles;
    } else {
      return tiles.map(tile => tile.pos === posTile ? {tileId: tile.tileId, pos: posEmpty} : tile);
    }
  }

  function getRandomMove(tiles: Tile[], depth: number): Tile[] {
    if (depth <= 0) return tiles;
    const emptyPos = findEmptyPos(tiles);
    const neighbors = [1, -1, puzzleSize, -puzzleSize].filter(neighbor => tileNeighbors(tiles, emptyPos, emptyPos + neighbor))
    const chosenMove = emptyPos + neighbors[Math.floor(Math.random() * neighbors.length)];
    return getRandomMove(applyMove(tiles, chosenMove), depth - 1);
  }

  function checkSolved(tiles: Array<Tile>): boolean {
    return tiles.every(tile => tile.pos === tile.tileId);
  }

  function onTileClicked(tileId: number): void {
    if (checkSolved(tiles)) return;

    const posTile = tiles.find(x => x.tileId === tileId)?.pos;
    if (posTile === undefined) {throw new Error('Something went seriously wrong.')};
    const tiles0 = applyMove(tiles, posTile);

    if (checkSolved(tiles0)) {
      setSolved(true);
      return;
    }
    else {
      setTiles(tiles0);
    }
  }

  function onSolveClicked() {
    const tiles0 = getInitPositions();
    setTiles(tiles0);
    setSolved(true);
  }

  function onRestartClicked() {
    const tiles0 = getRandomMove(getInitPositions(), 500);
    setTiles(tiles0);
    setSolved(false);
  }

  return (
    <div className='flex flex-1 basis-full flex-col gap-4 justify-between'>
      <ImagePuzzleBoard puzzleSize={puzzleSize} imagePos={imagePos} puzzleSolved={solved}
        image={image} tiles={tiles} onTileClicked={(tileId) => onTileClicked(tileId)} zoomLevel={zoomLevel} />
      <div className='flex flex-row justify-around text-md p-4 gap-8'>
        <button className='flex-1 py-2 drop-shadow-md border border-solid rounded-md border-[#aaaaaa]' onClick={onSolveClicked}>Solve</button>
        <button className='flex-1 py-2 drop-shadow-md border border-solid rounded-md border-[#aaaaaa]' onClick={onRestartClicked}>Restart</button>
      </div>
    </div>
  )
}

// Edit view for the block
interface ImagePuzzleEditProps {
  done: () => void;
  width?: string;
  setData: (data: ImagePuzzleData) => void;
}
function ImagePuzzleEdit(props: ImagePuzzleEditProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [puzzleSize, setPuzzleSize] = useState<number>(3);
  const [imagePos, setImagePos] = useState<Coordinate2D>([0, 0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const maxZoomLevel = 8.0;

  function onSave() {
    if (!imageFile || !imagePos) return;
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = () => {
      if (reader.result) {
        const imageData = reader.result.toString();
        props.setData({ imageData, puzzleSize, imagePos, zoomLevel });
        props.done();
      } else {
        console.log('No image selected');
      }
    }
  }

  function onImageUploaded(value: File) {
    setImageFile(value);
    const img = new Image();
    img.src = URL.createObjectURL(value);
    img.onload =  () => {
      setImage(img);
    }
  }

  function setZoomLevelAndComputeImagePos(zoomLevel: number, canvasDims: Coordinate2D): void {
    setZoomLevel(zoomLevel);
    if (!image) return;
    const imageDims: Coordinate2D = [image.width, image.height];
    const zoom = normalizeZoomLevel(zoomLevel, imageDims, canvasDims);
    const imagePosBounds = getImagePosBounds(zoom, imageDims, canvasDims);
    const imagePos0 = clampCoordinateXYToBounds(imagePos, imagePosBounds)
    setImagePos(imagePos0);
  }

  return (
    <>
      <div
        className='flex w-full flex-col gap-4'
        style={{ width: props.width || '100%' }}
      >
        <ImagePuzzleUpload image={image} puzzleSize={puzzleSize} onImageUploaded={(value: File) => onImageUploaded(value)}
          imagePos={imagePos} setImagePos={setImagePos} zoomLevel={zoomLevel} onSlideZoom={setZoomLevelAndComputeImagePos}
           maxZoomLevel={maxZoomLevel} />
        <ImagePuzzleSizeSelector onSizeChanged={ (value: number) => setPuzzleSize(value) } puzzleSize={puzzleSize} />
      </div>
      <div className='absolute right-4 left-4 transition-all' style={{bottom: image ? '1rem' : '-16rem'}}>
        <SeamSaveButton onClick={() => onSave()} />
      </div>
    </>
  )
}

// Top-level component for the block; wraps the functional component views
export default class ImageBlock extends Block {
  setData(data: ImagePuzzleData) {
    Object.assign(this.model.data, data);
  }

  render() {
    const data = this.model.data as any;
    return (
      <ImagePuzzle data={data} />
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <ImagePuzzleEdit done={ () => done(this.model) } setData={ (data: ImagePuzzleData) => this.setData(data) } />
    )
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}