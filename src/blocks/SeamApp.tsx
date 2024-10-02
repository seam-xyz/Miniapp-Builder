import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types';
import image1 from "../blocks/assets/SeamMeme/doge.jpg"
import image2 from "../blocks/assets/SeamMeme/fine.jpg"
import image3 from "../blocks/assets/SeamMeme/glasses.jpg"
import image4 from "../blocks/assets/SeamMeme/think.jpg"
import Feed from '../Feed';

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

// Meme Browser
const memeCarousels = [
    { title: "Top 10", images: [image1, image2, image3, image4] },
    { title: "Browse Meme Layouts", images: [image1, image2, image3, image4] },
    { title: "Blank Layouts", images: [image1, image2, image3, image4] },
    { title: "Browse Memes", images: [image1, image2, image3, image4] },
]

interface MemeCarousel {
    title: string;
    images: string[];
}

const MemeCarousel: React.FC<MemeCarousel> = ({ title, images }) => {
    return (
        <div className='p-2'>
            <p className='font-bold my-2'>{title}</p>
            <div className='flex flex-row overflow-x-auto space-x-2 scrollbar-hide'>{images.map((x, index) => {
                return (
                    <div
                        key={index}
                        className='h-24 w-24 flex-shrink-0'>
                        <img src={x} alt={`Image ${index}`} className='rounded-xl w-full h-full' />
                    </div>
                )
            })}</div>
        </div>
    )
}

const MemeBrowser = () => {
    return (
        <div>
            <div className='overflow-y-auto scrollbar-hide'>
                <div className='border-2 w-full h-10'>
                    <input type="text" name="" id="" placeholder='Search "memes"' className='w-full h-full p-2' />
                </div>
                <div className='flex w-full py-2'>
                    <div className='border-2 flex-1 py-2'>
                        <button className='w-full'>Browse memes</button>
                    </div>
                    <div className='border-2 flex-1 py-2'>
                        <button className='w-full'>Drafts</button>
                    </div>
                </div>
                <div>{memeCarousels.map((x, index) => {
                    return (
                        <MemeCarousel title={x.title} images={x.images} />
                    )
                })}</div>
            </div>
            {/* <button className='bg-blue-300 w-full rounded-lg'> Create your own meme </button> */}
        </div>

    )
}


// Meme Editor
const memeEditorButtons = [
    { title: "Canvas", icon: Grid3x3Icon },
    { title: "Text", icon: AbcIcon },
    { title: "Media", icon: AddPhotoAlternateIcon },
    { title: "Crop", icon: CropIcon },
]

interface MemeEditorButtonProps {
    title: string;
    icon: React.ElementType;
}

const MemeEditorButton: React.FC<MemeEditorButtonProps> = ({ title, icon: Icon }) => {
    return (
        <button className='p-2 h-24 w-24 border-2 rounded-xl flex flex-col items-center justify-center bg-sky-500 text-white font-bold'>
            <div className='w-full flex justify-center p-1'>
                <Icon />
            </div>
            <div className='w-full text-center p-1'>{title}</div>
        </button>
    )
}

const MemeEditor = () => {
    return (
        <div className='flex flex-col h-full'>
            <div className='flex justify-between m-2'>
                <div className='flex flex-row text-gray-400 space-x-2'>
                    <div className='px-2 border-gray-200 border-2 rounded-3xl h-10 w-14 flex justify-center'>
                        <button className='w-full h-full'><UndoIcon color='inherit' /></button>
                    </div>
                    <div className='px-2 border-gray-200 border-2 rounded-3xl h-10 w-14 flex justify-center'>
                        <button className='w-full h-full'><RedoIcon color='inherit' /></button>
                    </div>
                </div>
                <div className='px-2 border-gray-200 border-2 rounded-3xl h-10 w-14 flex justify-center text-gray-400'>
                    <button className='w-full h-full'><DeleteOutlineIcon color='inherit' /></button>
                </div>
            </div>
            <button className='flex-1 border-2 bg-gray-100 rounded-lg text-gray-400 m-2'>
                <div className='p-4'><AddCircleOutlineIcon fontSize='large' color='inherit' /></div>
                <p className='p-4 font-bold'>Tap to Start Creating</p>
            </button>
            <div className='flex space-x-2 m-2'>
                {memeEditorButtons.map((x, index) => {
                    return (
                        <MemeEditorButton key={index} title={x.title} icon={x.icon} />
                    )
                })}
            </div>
        </div>
    )
}



// Seam Feed Component
interface FeedButtonProps {
    count: number;
    icon: React.ElementType;
}

const feedButtonData = [
    { count: 4, icon: ChatBubbleOutlineIcon },
    { count: 4, icon: EmojiEmotionsIcon },
    { count: 4, icon: ShareIcon },
]


const FeedButton: React.FC<FeedButtonProps> = ({ icon: Icon, count }) => {
    return (
        <button className='flex bg-gray-100 rounded-3xl w-14 h-10 p-2 items-center justify-between'>
            <div className='text-md p-1'><Icon fontSize="inherit" /></div>
            <p className='p-1 text-sm'>{count}</p>
        </button>
    )
}

const FeedComponent = () => {
    return (
        <div className='border-2 border-gray-100 rounded-xl p-2 h-7/8 flex flex-col'>
            <div>
                <div className='flex items-center'>
                    <div className='p-1'><img src={image1} alt="" className='rounded-full h-12 w-12' /></div>
                    <div className='flex-grow p-1'>
                        <p className='font-semibold'>Seam meme</p>
                        <p className='font-light text-xs text-gray-400'>Text Block</p>
                    </div>
                    <div className=''><button className='bg-gray-100 border-2 rounded-full p-1'><MoreHorizIcon /></button></div>
                </div>
                <div className='flex space-x-2 items-center py-1'>
                    <p className='font-light text-xs text-gray-400'>Collected Into</p>
                    <p className='text-xs'>Let's Party</p>
                    <p className='font-light text-xs text-gray-400'>Feb 26</p>
                </div>
            </div>
            <div className='flex flex-col flex-1/2'>
                <p className='text-lg'>My first Meme!!</p>
                <div className='flex-1 p-2 border-2 border-gray-100 mt-2 h-full w-full flex justify-center'>
                    <img src={image3} alt="Meme" className='h-96 object-none' />
                </div>
                <div className='flex p-2 w-full justify-between'>
                    <div className='flex space-x-2'>
                        {feedButtonData.map((x, index) => {
                            return (
                                <FeedButton key={index} icon={x.icon} count={x.count} />
                            )
                        })}
                    </div>
                    <div>
                        <FeedButton icon={AddToPhotosIcon} count={5} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export const SeamFeedComponent = ({ model, update }: FeedComponentProps) => {
    return <h1>Hi, I'm in the feed!</h1>;
}

// Seam Composer Component
export const SeamComposerComponent = ({ model, done }: ComposerComponentProps) => {
    return (
        <div className='h-full'>
            {/* <MemeBrowser /> */}
            {/* <MemeEditor /> */}
            <FeedComponent />
            {/* <button onClick={() => { done(model) }} className='bg-blue-300 w-full rounded-lg'> Create your own meme </button> */}
        </div>
    );
}