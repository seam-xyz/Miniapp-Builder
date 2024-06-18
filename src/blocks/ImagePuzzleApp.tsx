import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import { useRef, useState } from 'react';

import ImageIcon from '@mui/icons-material/Image';
import SeamSaveButton from '../components/SeamSaveButton';
import { propsToClassKey } from '@mui/styles';

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

  console.log([top, right, bottom, left].join(' '));
  return [top, right, bottom, left].join(' ');
}

// Image uploader
interface ImagePuzzleUploadProps {
  onImageUploaded: (value: File | null) => void;
  image: File | null;
  puzzleSize: number;
}
function ImagePuzzleUpload(props: ImagePuzzleUploadProps) {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <div className='flex flex-0 mx-10 mt-4 aspect-square'>
      <div
        className='flex flex-col flex-1 border-2 border-[#cccccc] rounded-lg drop-shadow-md place-items-center place-content-center overflow:hidden relative'
        onClick={() => fileInput.current?.click()}
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
            <img className='min-w-full min-h-full object-cover rounded-lg' src={URL.createObjectURL(props.image)} />
          </>
          : <>
            <ImageIcon htmlColor='#aaaaaa' style={{ fontSize: '6rem' }} />
            <p className='text-[#aaaaaa]'>Upload Image</p>
          </>
        }
      </div>
      <input ref={fileInput} type='file' name='file' accept='image/*' onChange={e => props.onImageUploaded(e.target.files && e.target.files[0])} hidden />
    </div>
  )
}

// Edit mode view for the block
interface ImagePuzzleProps {
  done: () => void;
  width?: string;
  setData: (data: object) => void;
}
function ImagePuzzleEdit(props: ImagePuzzleProps) {
  const [image, setImage] = useState<File | null>(null);
  const [puzzleSize, setPuzzleSize] = useState<number>(3);

  async function onSave() {
    const imageData = await image?.text();
    if (imageData) {
      props.setData({ imageData, puzzleSize });
      props.done();
    } else {
      // TODO: Prompt for image
      console.log('No image selected');
    }
  }

  return (
    <>
      <div
        className='flex flex-col gap-4'
        style={{ width: props.width || '100%' }}
      >
        <ImagePuzzleUpload image={image} puzzleSize={puzzleSize} onImageUploaded={ (value: File | null) => { setImage(value); console.log(value); } } />
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
  setData(data: object) {
    Object.assign(this.model.data, data);
  }

  render(width?: string) {
    return (
      <h1>Image Block!</h1>
    );
  }

  renderEditModal(done: (data: BlockModel) => void, width?: string) {
    return (
      <ImagePuzzleEdit done={() => { console.log(this.model); done(this.model); }} setData={ (data: object) => this.setData(data) } />
    )
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}