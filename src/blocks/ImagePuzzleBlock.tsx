import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types'
import './BlockStyles.css'
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ImageIcon from '@mui/icons-material/Image';
import SeamSaveButton from '../components/SeamSaveButton';
import ImageBgBoard from './assets/ImagePuzzleBlock/bgBoard.webp';

// *** TYPES ***
type Coordinate2D = [number, number];
type Bounds = [Coordinate2D, Coordinate2D];

// Represents a game piece
interface Tile {
  tileId: number;  // Unique ID that corresponds to the "correct" position on the grid.
  pos: number;  // Current position of the tile on the grid.
}

// Block model .data
interface ImagePuzzleData {
  imageData: string;  // Base64 image data serialized to Block.model.
  puzzleSize: number;  // Puzzle size, in tiles.
  imagePos: Coordinate2D;  // Image position, in pixels (origin at center.)
  zoomLevel: number;  // The raw zoom level from 1.0 to maxZoomLevel.
}

// An individual tile on the game board
interface ImagePuzzleTileProps {
  puzzleSize: number;  // Puzzle size, in tiles.
  tile: Tile
  image: HTMLImageElement | undefined;  // Curently-loaded image.
  boardDims: Coordinate2D | null;  // Size of the puzzle grid, in pixels.
  onTileMoved: (tile: Tile) => void;  // Called when a tile is selected for movement.
  imagePos: Coordinate2D;  // Image position, in pixels (origin at center).
  zoomLevel: number;  // The raw zoom level from 1.0 to maxZoomLevel.
  puzzleSolved: boolean;  // Whether or not the puzzle is solved.
  onTileSwiped: (tile: Tile, dPos: Coordinate2D) => void;  // Called when a tile is swiped.
}

// Game board
interface ImagePuzzleBoardProps {
  puzzleSize: number; // Puzzle size, in tiles.
  onTileMoved: (tile: Tile) => void;  // Called when a tile is selected for movement.
  image: HTMLImageElement | undefined;  // Currently-loaded image.
  tiles: Tile[];  // A list of all tiles and their corresponding positions.
  imagePos: Coordinate2D;  // The image position, in pixels (origin at center.)
  zoomLevel: number; // The raw zoom level, from 1.0 to maxZoomLevel.
  puzzleSolved: boolean;  // Whether or not the puzzle is solved.
  onTileSwiped: (tile: Tile, dPos: Coordinate2D) => void; // Called when a tile is swiped.
}

// Button for selecting the size of the puzzle
interface ImagePuzzleSizeSelectorOptionProps {
  value: number;  // The puzzle size value represented by this component.
  onSizeChanged: (puzzleSize: number) => void;  // Called when a new size option is selected.
  puzzleSize: number;  // The current puzzle size, in tiles.
}

// Puzzle size selector; container for individual ImagePuzzleSizeSelectorOptions
interface ImagePuzzleSizeSelectorProps {
  onSizeChanged: (value: number) => void  // Called when a new size option is selected.
  puzzleSize: number // The current puzzle size, in tiles.
}

// Image uploader
interface ImagePuzzleUploadProps {
  onImageUploaded: (value: File) => void;  // Called when an image is selected from <input>
  image: HTMLImageElement | null;  // Currently-loaded image.
  imagePos: Coordinate2D;  // The image position, in pixels (origin at center.)
  setImagePos: (imagePos: Coordinate2D) => void;  // Sets the origin (anchored to center) of the loaded image.
  puzzleSize: number;  // The puzzle size, in tiles.
  zoomLevel: number;  // The raw zoom level, from 1.0 to maxZoomLevel.
  onSlideZoom: (zoomLevel: number, canvasDims: Coordinate2D) => void;  // Called on changing the range <input>.
  maxZoomLevel: number  // The maximum value for zoomLevel.
}

// Published view for the block
interface ImagePuzzleProps {
  data: ImagePuzzleData;  // The Seam block.data object
}

// Edit view for the block
interface ImagePuzzleEditProps {
  done: () => void;  // The Seam done callback.
  width?: string;  // Width provided by Seam.
  setData: (data: ImagePuzzleData) => void;  // Callback to set Seam's block.data object.
}

// *** FUNCTIONS ***

// Debounce hook for preventing mouse and touch from overlapping.
// Usage: if (debounce()) return;
const debouncer: Record<string, boolean> = {};
function useDebounce(key: string, delay: number): () => boolean {
  if (debouncer[key] === undefined) {
    debouncer[key] = false;
  }

  function getDebouncedValue(): boolean {
    if (debouncer[key] === true) return true;
    debouncer[key] = true;
    setTimeout(() => {debouncer[key] = false;}, delay);
    return false;
  }
  
  return getDebouncedValue;
}

// Sets only inner borders for the overlay grid, with box at index in a grid with dimensions side x side
function getBorderStyleGrid(index: number, side: number, borderWidth: string): string {
  const top = index < side ? '0px' : borderWidth;
  const right = (index + 1) % side === 0 ? '0px' : borderWidth;
  const bottom = index >= (side ** 2 - side) ? '0px' : borderWidth;
  const left = index % side === 0 ? '0px' : borderWidth;

  return `${top} ${right} ${bottom} ${left}`;
}

// Normalize the zoomLevel such that 1.0 is the furthest you can zoom without introducing whitespace.
// Returns a number to be used as a scale factor on the image.
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

// Add Coordinate2D types.
function addCoordinate2D(a: Coordinate2D, b: Coordinate2D): Coordinate2D {
  return [a[0] + b[0], a[1] + b[1]];
}

// Subtract Coordinate2D types (a - b)
function subtractCoordinate2D(a: Coordinate2D, b: Coordinate2D): Coordinate2D {
  return [a[0] - b[0], a[1] - b[1]];
}

// Returns a new Coordinate2D such that the individual components are within the min and max values of the provided Bounds.
function clampCoordinate2DToBounds(d: Coordinate2D, b: Bounds): Coordinate2D {
  const x = Math.max(b[0][0], Math.min(b[0][1], d[0]));
  const y = Math.max(b[1][0], Math.min(b[1][1], d[1]));
  const d0: Coordinate2D = [x, y];
  return d0;
}

// If two tiles are neighboring, return the string direction of travel from posA to posB
function getDirFromGridPos(tiles: Tile[], posA: number, posB: number): string | undefined {
  const puzzleSize = Math.sqrt(tiles.length + 1);
  const directions = {
    'up': -puzzleSize,
    'right': 1,
    'down': puzzleSize,
    'left': -1
  };
  const dPos = posB - posA;
  const dir = Object.entries(directions).find(direction => direction[1] === dPos);
  if (!dir) return undefined;
  return dir[0];
}

// Returns true if two tiles neighbor one another
function tileNeighbors(tiles: Tile[], posA: number, posB: number): boolean {
  const puzzleSize = Math.sqrt(tiles.length + 1);
  if (posA < 0 || posB < 0 || posA >= puzzleSize ** 2 || posB >= puzzleSize ** 2) return false;  // One of the tiles doesn't exist.
  const dir = getDirFromGridPos(tiles, posA, posB);
  if (!dir) return false;  // Tiles are not in a cardinal direction from one another.
  if ((dir === 'right' && posA % puzzleSize === puzzleSize - 1) || (dir === 'left' && posA % puzzleSize === 0)) {
    return false;  // Direction implies a row wrap
  }
  return true;
}

// Returns the empty position in a given game board
function getEmptyPos(tiles: Tile[]): number {
  const puzzleSize = Math.sqrt(tiles.length + 1)
  const result = Array(puzzleSize ** 2).fill(0)
    .map((_, i) => i)
    .filter(i => 
      !tiles.map(tile => tile.pos).includes(i)
    )[0];
  if (result === undefined) throw new Error('Could not find empty position');

  return result;
}

// Returns an array of tiles that serves as an initial/solved state for the game
function getInitPositions(puzzleSize: number) {
  return Array(puzzleSize ** 2 - 1).fill(0).map((_, i): Tile => ({tileId: i, pos: i}));
}

// Returns the result of applying the move at posTile (sliding it into the empty space if neighboring)
function applyMove(tiles: Tile[], posTile: number): Tile[] {
  const posEmpty = getEmptyPos(tiles);
  if (!tileNeighbors(tiles, posTile, posEmpty)) {
    return tiles;
  } else {
    return tiles.map(tile => tile.pos === posTile ? {tileId: tile.tileId, pos: posEmpty} : tile);
  }
}

// Recursively gets a board with one random move applied to it
function applyRandomMove(tiles: Tile[], depth: number): Tile[] {
  if (depth <= 0) return tiles;
  const puzzleSize = Math.sqrt(tiles.length + 1);
  const emptyPos = getEmptyPos(tiles);
  const neighbors = [1, -1, puzzleSize, -puzzleSize].filter(neighbor => tileNeighbors(tiles, emptyPos, emptyPos + neighbor))
  const chosenMove = emptyPos + neighbors[Math.floor(Math.random() * neighbors.length)];
  return applyRandomMove(applyMove(tiles, chosenMove), depth - 1);
}

// Returns true if the given board is solved
function checkSolved(tiles: Array<Tile>): boolean {
  return tiles.every(tile => tile.pos === tile.tileId);
}

// Returns which "diagonal" the tile sits on for win animation.
function getDiagonal(tile: Tile, puzzleSize: number): number {
  const row = Math.floor(tile.pos / puzzleSize);
  const col = tile.pos % puzzleSize;
  return row + col;
}

// *** COMPONENTS ***

// Tile for the game board
function ImagePuzzleTile(props: ImagePuzzleTileProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState<number>(100);
  const [cursorStartPos, setCursorStartPos] = useState<Coordinate2D | null>(null);
  const debounceMouseDown = useDebounce('mouseDown', 150);
  const debounceMouseUp = useDebounce('mouseUp', 150);
  
  // Render image to canvas.
  useEffect(() => {
    if (!props.image || !props.boardDims) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas?.getContext('2d');
    if (!context) return;
    
    // .99 is used to offset the 103% translate in CSS to avoid subpixel shenanigans.
    const tileDims = [Math.floor(props.boardDims[0] / props.puzzleSize) * .99, Math.floor(props.boardDims[1] / props.puzzleSize) * .99];
    canvas.width = tileDims[0];
    canvas.height = tileDims[1];
    
    const imageDims: Coordinate2D = [props.image.width, props.image.height];
    const canvasDims: Coordinate2D = [canvas.width, canvas.height];
    const zoom = normalizeZoomLevel(props.zoomLevel, imageDims, props.boardDims);

    // Coordinates of current tile on the puzzle grid (before shuffling tiles). Origin at (0, 0) in center of grid.
    // For example, a 4x4 grid will have values [-1.5, -0.5, 0.5, 1.5] since canvases are measured from their top left.
    const selfGridCoords = [
      props.tile.tileId % props.puzzleSize - (props.puzzleSize - 1) / 2,
      Math.floor(props.tile.tileId / props.puzzleSize) - (props.puzzleSize - 1) / 2
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
  }, [props.image, props.boardDims, props.imagePos, props.tile, props.zoomLevel, props.puzzleSize]);

  // Trigger win animation.
  useEffect(() => {
    if (!props.puzzleSolved) return;
    const initDelayCoeff = 100;
    const scaleSize = 85;
    const delay = 300;
    const diagonal = getDiagonal(props.tile, props.puzzleSize);

    const initDelay = 300 + initDelayCoeff * diagonal;
    setTimeout(() => {
      setScale(scaleSize);
      setTimeout(() => {
        setScale(100);
      }, delay);
    }, initDelay);
  }, [props.puzzleSolved, props.tile, props.puzzleSize]);

  useEffect(() => {
  }, [cursorStartPos]);

  function onMouseDown(e: React.MouseEvent) {
    if (debounceMouseDown()) return;
    setCursorStartPos([e.clientX, e.clientY]);
  }

  function onTouchStart(e: React.TouchEvent) {
    if (debounceMouseDown()) return;
    setCursorStartPos([e.touches[0].clientX, e.touches[0].clientY]);
  }

  function onMouseUp(e: React.MouseEvent) {
    if (debounceMouseUp()) return;
    if (!cursorStartPos) return;
    props.onTileMoved(props.tile);
    setCursorStartPos(null);
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (debounceMouseUp()) return;
    if (!cursorStartPos) return;
    props.onTileMoved(props.tile);
    setCursorStartPos(null);
  }

  function onCursorMove(pos: Coordinate2D) {
    // Distance, in pixels, before a gesture event is registered.
    const moveThreshold = 14;
    
    if (!cursorStartPos) return;
    const dPos = subtractCoordinate2D(pos, cursorStartPos);
    if (Math.hypot(dPos[0], dPos[1]) >= moveThreshold) {
      setCursorStartPos(null);
      props.onTileSwiped(props.tile, dPos);
    }
  }

  function onTouchMove(e: React.TouchEvent) {
    onCursorMove([e.touches[0].clientX, e.touches[0].clientY]);
  }

  function onMouseMove(e: React.MouseEvent) {
    onCursorMove([e.clientX, e.clientY]);
  }

  return (
    <div
      className='basis-0 aspect-square absolute transition-transform duration-300 ease-in-out rounded-lg overflow-hidden drop-shadow-md'
      style={{
        // Borders introduced kinda hackily to circumvent CSS subpixel shenanigans. There's absolutely a cleaner way to do this but I'm
        // honestly terrified of breaking the layout on iPhone again.
        transform: `translate(calc(103% * ${props.tile.pos % props.puzzleSize}), calc(103% * ${Math.floor(props.tile.pos / props.puzzleSize)})) scale(${scale}%)`,
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}
    >
      <canvas ref={canvasRef} />
    </div>
  )
}

// Game board
function ImagePuzzleBoard(props: ImagePuzzleBoardProps) {
  const selfRef = useRef<HTMLDivElement | null>(null);
  const [boardDims, setBoardDims] = useState<Coordinate2D | null>(null);
  const updateBoardDimsCallback = useCallback(updateBoardDims, [selfRef]);

  // Resize puzzle tile canvases on window resize; they weren't doing this by default.
  useEffect(() => {
    window.addEventListener('resize', updateBoardDimsCallback);
  }, [updateBoardDimsCallback])

  // Resize puzzle tile canvases when the ref to the ImagePuzzleBoard div updates.
  useEffect(() => {
    updateBoardDimsCallback();
  }, [updateBoardDimsCallback]);

  // Set the board dimensions that get passed down to the child tiles.
  function updateBoardDims(): void {
    const board = selfRef.current;
    if (!board) return;
    setBoardDims([board.clientWidth, board.clientHeight]);
  }

  return (
    <div className='flex w-full max-w-[50vh] aspect-square self-center relative' ref={selfRef} >
        {
          props.tiles.map(tile => 
            <ImagePuzzleTile
              key={tile.tileId} puzzleSize={props.puzzleSize}
              tile={tile} image={props.image} 
              boardDims={boardDims} 
              onTileMoved={props.onTileMoved}
              imagePos={props.imagePos} zoomLevel={props.zoomLevel}
              puzzleSolved={props.puzzleSolved}
              onTileSwiped={props.onTileSwiped}
            />
          )
        }
    </div>
  );
}

// Button for selecting the size of the puzzle
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

// Puzzle size selector; container for individual ImagePuzzleSizeSelectorOptions
function ImagePuzzleSizeSelector(props: ImagePuzzleSizeSelectorProps) {
  return (
    <div className='flex flex-row items-center gap-4'>
      <ImagePuzzleSizeSelectorOption value={3} onSizeChanged={props.onSizeChanged} puzzleSize={props.puzzleSize} />
      <ImagePuzzleSizeSelectorOption value={4} onSizeChanged={props.onSizeChanged} puzzleSize={props.puzzleSize} />
      <ImagePuzzleSizeSelectorOption value={5} onSizeChanged={props.onSizeChanged} puzzleSize={props.puzzleSize} />
    </div>
  )
}

// Image uploader
function ImagePuzzleUpload(props: ImagePuzzleUploadProps) {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [prevMousePos, setPrevMousePos] = useState<Coordinate2D | null>(null);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [prevTouchPos, setPrevTouchPos] = useState<Coordinate2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  // (Re-)render image to canvas when necessary.
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
        const imagePos0 = clampCoordinate2DToBounds(addCoordinate2D(props.imagePos, dTouchPos), imagePosBounds);
        props.setImagePos(imagePos0);
      }
      setPrevTouchPos([touchPos[0], touchPos[1]]);
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    setPrevTouchPos(null);
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
      const imagePos0 = clampCoordinate2DToBounds(addCoordinate2D(props.imagePos, dMousePos), imagePosBounds);
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
      <div className='flex flex-col basis-full mt-4 max-w-[50vh] w-full mx-auto gap-4'>
        <div
          className='flex flex-col w-full h-full aspect-square border-2 border-[#cccccc] rounded-lg drop-shadow-md items-center justify-center overflow-hidden relative'
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
              <div className='absolute flex flex-wrap t-0 r-0 b-0 l-0 w-full h-full rounded-lg'>
                {
                  Array(props.puzzleSize ** 2).fill(0).map((_, i) =>
                    <div key={i}
                      className='border-[#ffffff99]'
                      style={{ 
                        borderWidth: getBorderStyleGrid(i, props.puzzleSize, '1px'), 
                        flexBasis: `calc(100% / ${props.puzzleSize})`,
                        height: `calc(100% / ${props.puzzleSize})`,
                        boxSizing: 'border-box'
                      }}
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
      <input type='range' min={1.0} max={props.maxZoomLevel} step='0.01' value={props.zoomLevel} onChange={onZoomLevelInputChange} disabled={props.image === null} />
      </div>
    </>
  )
}

// Published view for the block
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
    const tiles0 = applyRandomMove(getInitPositions(puzzleSize), 500);
    setTiles(tiles0);
  }, [imageData, puzzleSize]);

  function onTileMoved(tile: Tile): void {
    const tiles0 = applyMove(tiles, tile.pos);
    setTiles(tiles0);
    setSolved(checkSolved(tiles0));
  }

  function onSolveClicked(): void {
    if (checkSolved(tiles)) return;
    const tiles0 = getInitPositions(puzzleSize);
    setTiles(tiles0);
    setSolved(true);
  }

  function onRestartClicked(): void {
    const tiles0 = applyRandomMove(getInitPositions(puzzleSize), 500);
    setTiles(tiles0);
    setSolved(false);
  }

  function onTileSwiped(tile: Tile, dPos: Coordinate2D): void {
    const theta = Math.atan2(dPos[1], dPos[0]);
    const dirTheta =
      theta >= -1/4 * Math.PI && theta < 1/4 * Math.PI
      ? 'right'
      : theta >= 1/4 * Math.PI && theta < 3/4 * Math.PI
      ? 'down'
      : theta >= -3/4 * Math.PI && theta < -1/4 * Math.PI
      ? 'up'
      : 'left';

    const emptyPos = getEmptyPos(tiles);
    const dirToEmptyPos = getDirFromGridPos(tiles, tile.pos, emptyPos);


    if (dirToEmptyPos !== dirTheta) return;
    onTileMoved(tile);
  }

  return (
    <div className='flex flex-1 basis-full flex-col justify-center p-2 rounded-md bg-cover' style={{backgroundImage: `url(${ImageBgBoard})`}}>
      <ImagePuzzleBoard puzzleSize={puzzleSize} imagePos={imagePos} puzzleSolved={solved}
        image={image} tiles={tiles} onTileMoved={onTileMoved} zoomLevel={zoomLevel} onTileSwiped={onTileSwiped} />
      <div className='flex flex-row justify-around text-md md:text-xl p-4 gap-8'>
        <button className='flex-1 py-2 drop-shadow-md border border-solid rounded-md border-[#aaaaaa] bg-white' onClick={onSolveClicked}>Solve</button>
        <button className='flex-1 py-2 drop-shadow-md border border-solid rounded-md border-[#aaaaaa] bg-white' onClick={onRestartClicked}>Restart</button>
      </div>
    </div>
  )
}

// Edit view for the block
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
    const imagePos0 = clampCoordinate2DToBounds(imagePos, imagePosBounds)
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

export const ImagePuzzleFeedComponent = ({ model }: FeedComponentProps) => {
  const data = model.data as any;
  return (
    <ImagePuzzle data={data} />
  );
}

export const ImagePuzzleComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const setData = (data: any) => {
    Object.assign(model.data, data);
  }

  return (
    <ImagePuzzleEdit done={() => done(model)} setData={setData} />
  );
}