// #region: imports
import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types';
import image1 from "../blocks/assets/SeamMeme/doge.jpg"
import image2 from "../blocks/assets/SeamMeme/fine.jpg"
import image3 from "../blocks/assets/SeamMeme/glasses.jpg"
import image4 from "../blocks/assets/SeamMeme/think.jpg"
import Feed from '../Feed';

// libraries
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// icons
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import AbcIcon from '@mui/icons-material/Abc';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CropIcon from '@mui/icons-material/Crop';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ShareIcon from '@mui/icons-material/Share';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
// #endregion

// types
import type { Meme } from './utils/SeamMeme/types/types';


// #region: Composer - Seam Composer Component
export const SeamComposerComponent = ({ model, done }: ComposerComponentProps) => {
    return (
        <div className='h-full w-full'>
            {/* <MemeBrowser /> */}
            <MemeEditor />
            {/* <FeedComponent /> */}
            {/* <ChooseMediaComponent /> */}
            {/* <button onClick={() => { done(model) }} className='bg-blue-300 w-full rounded-lg'> Create your own meme </button> */}
        </div>
    );
}


export const SeamFeedComponent = ({ model, update }: FeedComponentProps) => {
    return <h1>Hi, I'm in the feed!</h1>;
}

// #endregion

