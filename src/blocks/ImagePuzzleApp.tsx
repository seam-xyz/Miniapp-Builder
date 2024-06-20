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
  imageData: string;
  puzzleSize: number;
  imageObjPos: number[];
  zoomLevel: number;
}

// Tile for the game board
interface ImagePuzzleTileProps {
  imageData: string;
  puzzleSize: number;
  tileId: number;
  pos: number;
  image: HTMLImageElement | undefined;
  boardDimensions: Array<number | undefined>;
  onTileClicked: (tileId: number) => void;
  imageObjPos: number[];
  zoomLevel: number;
}
function ImagePuzzleTile(props: ImagePuzzleTileProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // TODO: Clean this lad up. There's stuff in here that does not need to be.
  useEffect(() => {
    if (!props.image || !props.boardDimensions[0] || !props.boardDimensions[1]) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tileDimensions = [Math.ceil(props.boardDimensions[0] / props.puzzleSize), Math.ceil(props.boardDimensions[1] / props.puzzleSize)];
    canvas.width = tileDimensions[0];
    canvas.height = tileDimensions[1];

    const context = canvas?.getContext('2d');
    if (!context) return;
    const imageDimensions = [props.image.width, props.image.height];

    // Coordinates of current tile on the puzzle grid (before shuffling tiles)
    const selfGridCoords = [props.tileId % props.puzzleSize, Math.floor(props.tileId / props.puzzleSize)];
    // Top left position of top left "tile" on the source image.
    const imageAnchorCoords = [
      (imageDimensions[0] - props.boardDimensions[0]) * props.imageObjPos[0],
      (imageDimensions[1] - props.boardDimensions[1]) * props.imageObjPos[1]
    ];

    const [sx, sy] = [
      imageAnchorCoords[0] + tileDimensions[0] * selfGridCoords[0],
      imageAnchorCoords[1] + tileDimensions[1] * selfGridCoords[1]
    ];
    const [sw, sh] = [tileDimensions[0], tileDimensions[1]];
    const [dx, dy] = [0, 0];
    const [dw, dh] = [tileDimensions[0], tileDimensions[1]];

    context.drawImage(props.image, sx, sy, sw, sh, dx, dy, dw, dh);
  }, [props.image]);

  return (
    <div
      className='flex-0 overflow-hidden aspect-square absolute transition-transform'
      style={{
        flexBasis: `calc(100%/${props.puzzleSize})`,
        transform: `translate(calc(100% * ${props.pos % props.puzzleSize}), calc(100% * ${Math.floor(props.pos / props.puzzleSize)})`
        // left: `calc(100% * ${props.pos % props.puzzleSize} / ${props.puzzleSize})`,
        // top: `calc(100% * ${Math.floor(props.pos / props.puzzleSize)} / ${props.puzzleSize})`
      }}
      onClick={() => props.onTileClicked(props.tileId)}
    >
      <canvas ref={canvasRef} />
    </div>
  )
}

// Game piece
interface Tile {
  tileId: number;
  pos: number;
}
// Image puzzle game board
interface ImagePuzzleBoardProps {
  imageData: string;
  puzzleSize: number;
  onTileClicked: (tileId: number) => void;
  image: HTMLImageElement | undefined;
  tiles: Tile[];
  imageObjPos: number[];
  zoomLevel: number;
}
function ImagePuzzleBoard(props: ImagePuzzleBoardProps) {
  const selfRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className='flex flex-0 mx-10 mt-4 aspect-square' ref={selfRef} >
      <div className='flex w-full h-full flex-row flex-wrap relative'>
        {
          props.tiles.map(tile => 
            <ImagePuzzleTile
              key={tile.tileId} imageData={props.imageData} puzzleSize={props.puzzleSize}
              tileId={tile.tileId} pos={tile.pos} image={props.image} 
              boardDimensions={[selfRef.current?.clientWidth, selfRef.current?.clientHeight]} 
              onTileClicked={(tileId: number) => props.onTileClicked(tileId)}
              imageObjPos={props.imageObjPos}
              zoomLevel={props.zoomLevel}
              />
          )
        }
      </div>
    </div>
  )
}

// Puzzle size selector
interface ImagePuzzleSizeProps {
  value: number
  onSizeChanged: (value: number) => void
  puzzleSize: number
}
function ImagePuzzleSize(props: ImagePuzzleSizeProps) {
  return (
    <div className='flex flex-row items-center gap-4'>
      <p className='flex-0'>Size</p>
      <div 
        className='flex-1 basis-1/3 drop-shadow-sm p-4 text-center text-lg rounded-md'
        onClick={() => props.onSizeChanged(3)}
        style={{ border: props.puzzleSize === 3 ? 'solid 2px #a61aad' : 'solid 1px #aaaaaa' }}>3x3</div>
      <div 
        className='flex-1 basis-1/3 drop-shadow-sm p-4 text-center text-lg rounded-md'
        onClick={() => props.onSizeChanged(4)}
        style={{ border: props.puzzleSize === 4 ? 'solid 2px #a61aad' : 'solid 1px #aaaaaa' }}>4x4</div>
      <div 
        className='flex-1 basis-1/3 drop-shadow-sm p-4 text-center text-lg rounded-md'
        onClick={() => props.onSizeChanged(5)}
        style={{ border: props.puzzleSize === 5 ? 'solid 2px #a61aad' : 'solid 1px #aaaaaa' }}>5x5</div>
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

// Image uploader
interface ImagePuzzleUploadProps {
  onImageUploaded: (value: File | null) => void;
  setImageObjPos: (imageObjPos: number[]) => void;
  image: File | null;
  imageObjPos: number[]
  puzzleSize: number;
  zoomLevel: number;
  setZoomLevel: (zoomLevel: number) => void;
}
function ImagePuzzleUpload(props: ImagePuzzleUploadProps) {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [prevTouchPos, setPrevTouchPos] = useState<Array<number | null>>([null, null]);
  const [prevTouchDistance, setPrevTouchDistance] = useState<number | null>(null);

  function onTouchMove(e: React.TouchEvent) {
    const dragCoeff = -0.002;  // Adjusts the ratio between pixels and object position coords.
    const pinchCoeff = .05;
    if (e.touches.length === 1) {
      const touchPos = [e.touches[0].screenX, e.touches[0].screenY]
      if (prevTouchPos[0] && prevTouchPos[1]) {
        const dTouchPos = [touchPos[0] - prevTouchPos[0], touchPos[1] - prevTouchPos[1]];
        const imageObjPos0 = [
          Math.max(0, Math.min(1, props.imageObjPos[0] + dTouchPos[0] * dragCoeff)),
          Math.max(0, Math.min(1, props.imageObjPos[1] + dTouchPos[1] * dragCoeff))
        ];
        props.setImageObjPos(imageObjPos0);
      }
      setPrevTouchPos([touchPos[0], touchPos[1]]);
    } else if (e.touches.length === 2) {
      const touchDistance = Math.hypot(e.touches[1].screenX - e.touches[0].screenX, e.touches[1].screenY - e.touches[0].screenY);
      if (prevTouchDistance) {
        const dTouchDistance = touchDistance - prevTouchDistance;
        props.setZoomLevel(Math.max(0, Math.min(1, props.zoomLevel + dTouchDistance * pinchCoeff)));
      }
      setPrevTouchDistance(touchDistance);
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (e.touches.length === 1) {
      setPrevTouchDistance(null);
    } else if (e.touches.length === 0) {
      setPrevTouchPos([null, null]);
    }
  }

  return (
    <div className='flex flex-col flex-0 mx-10 mt-4 aspect-square'>
      <div
        className='flex flex-col flex-1 border-2 border-[#cccccc] rounded-lg drop-shadow-md place-items-center place-content-center overflow:hidden relative'
        onClick={() => props.image || fileInput.current?.click()}
        onTouchMove={e => onTouchMove(e)}
        onTouchEnd={e => onTouchEnd(e)}
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
            <img className='min-w-full min-h-full object-none rounded-md'
              src={URL.createObjectURL(props.image)}
              style={{objectPosition: `${props.imageObjPos[0] * 100}% ${props.imageObjPos[1] * 100}%`}} />
          </>
          : <>
            <ImageIcon htmlColor='#aaaaaa' style={{ fontSize: '6rem' }} />
            <p className='text-[#aaaaaa] select-none'>Upload Image</p>
          </>
        }
      </div>
      <input ref={fileInput} type='file' name='file' accept='image/*' onChange={e => props.onImageUploaded(e.target.files && e.target.files[0])} hidden />
      <input type='range' min='1' max='4.0' step='0.25' value={props.zoomLevel} onChange={e => {props.setZoomLevel(Number(e.target.value)); console.log(e.target.value)}} />
    </div>
    // TODO: Remove slider; it's just to test easily without phone.
  )
}

// Public view for the block
interface ImagePuzzlePublicProps {
  data: ImagePuzzleData;
}
function ImagePuzzlePublic(props: ImagePuzzlePublicProps) {
  const [tiles, setTiles] = useState<Array<Tile>>([])
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  const selfRef = useRef<HTMLDivElement>(null);

  const puzzleSize = props.data.puzzleSize;
  const imageData = props.data.imageData;
  const imageObjPos = props.data.imageObjPos;

  useEffect(() => {
    const image = new Image();
    image.src = imageData;
    image.onload = () => {
      setImage(image);
    };
    setTiles(Array(puzzleSize ** 2 - 1).fill(0).map((_, i): Tile => { return ({ tileId: i, pos: i }) }));
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
      return tiles.map(tile => tile.pos === posTile ? { tileId: tile.tileId, pos: posEmpty} : tile);
    }
  }

  function getRandomMove(tiles: Tile[], depth: number): Tile[] {
    if (depth <= 0) return tiles;
    const emptyPos = findEmptyPos(tiles);
    const neighbors = [1, -1, puzzleSize, -puzzleSize].filter(neighbor => tileNeighbors(tiles, emptyPos, emptyPos + neighbor))
    const chosenMove = emptyPos + neighbors[Math.floor(Math.random() * neighbors.length)];
    return getRandomMove(applyMove(tiles, chosenMove), depth - 1);
  }

  function onTileClicked(tileId: number): void {
    const posTile = tiles.find(x => x.tileId === tileId)?.pos;
    if (posTile === undefined) {throw new Error('Something went seriously wrong.')};
    const tiles0 = applyMove(tiles, posTile);
    setTiles(tiles0);
  }

  return (
    <div className='flex w-full flex-col gap-4 justify-between'>
      <ImagePuzzleBoard imageData={imageData} puzzleSize={puzzleSize} imageObjPos={imageObjPos}
        image={image} tiles={tiles} onTileClicked={(tileId) => onTileClicked(tileId)} zoomLevel={props.data.zoomLevel} />
      <div className='flex flex-row justify-around text-md p-4 gap-8'>
        <button className='flex-1 py-2 drop-shadow-md border border-solid rounded-md border-[#aaaaaa]' onClick={() => setTiles(getInitPositions())}>Solve</button>
        <button className='flex-1 py-2 drop-shadow-md border border-solid rounded-md border-[#aaaaaa]' onClick={() => setTiles(getRandomMove(tiles, 500))}>Shuffle</button>
      </div>
    </div>
  )
}

// Edit view for the block
interface ImagePuzzleProps {
  done: () => void;
  width?: string;
  setData: (data: ImagePuzzleData) => void;
}
function ImagePuzzleEdit(props: ImagePuzzleProps) {
  const [image, setImage] = useState<File | null>(null);
  const [puzzleSize, setPuzzleSize] = useState<number>(3);
  const [imageObjPos, setImageObjPos] = useState<number[]>([0.5, 0.5]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  function onSave() {
    if (!image) return;
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = () => {
      if (reader.result) {
        const imageData = reader.result.toString();
        props.setData({ imageData, puzzleSize, imageObjPos, zoomLevel });
        props.done();
      } else {
        // TODO: Prompt for image
        console.log('No image selected');
      }
    }
  }

  return (
    <>
      <div
        className='flex flex-col gap-4'
        style={{ width: props.width || '100%' }}
      >
        <ImagePuzzleUpload image={image} puzzleSize={puzzleSize} onImageUploaded={(value: File | null) => setImage(value)}
          imageObjPos={imageObjPos} setImageObjPos={setImageObjPos} zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
        <ImagePuzzleSize value={puzzleSize} onSizeChanged={ (value: number) => setPuzzleSize(value) } puzzleSize={puzzleSize} />
      </div>
      <div className='absolute right-4 bottom-4 left-4'>
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
      <ImagePuzzlePublic data={data} />
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