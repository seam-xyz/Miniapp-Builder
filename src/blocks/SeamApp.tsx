import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types';
import image1 from "../blocks/assets/SeamMeme/doge.jpg"
import image2 from "../blocks/assets/SeamMeme/fine.jpg"
import image3 from "../blocks/assets/SeamMeme/glasses.jpg"
import image4 from "../blocks/assets/SeamMeme/think.jpg"
import Feed from '../Feed';

const memeCarousels = [
    { title: "Top 10", images: [image1, image2, image3, image4] },
    { title: "Browse Meme Layouts", images: [image1, image2, image3, image4] },
    { title: "Blank Layouts", images: [image1, image2, image3, image4] },
    { title: "Browse Memes", images: [image1, image2, image3, image4] },
]

// Meme Browser

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
    { title: "Canvas", icon: "" },
    { title: "Text", icon: "" },
    { title: "Media", icon: "" },
    { title: "Crop", icon: "" },
]

interface MemeEditorButtonProps {
    title: string;
    icon: string;
}

const MemeEditorButton: React.FC<MemeEditorButtonProps> = ({ title, icon }) => {
    return (
        <div className='h-24 w-24 border-2 rounded-xl flex flex-row items-center bg-sky-500 text-white font-bold'>
            <div><img src={icon} alt="" /></div>
            <div className='w-full text-center'>{title}</div>
        </div>
    )
}

const MemeEditor = () => {
    return (
        <div className='flex flex-col h-full'>
            <div className='flex justify-between'>
                <div className='flex flex-row'>
                    <div>back</div>
                    <div>forward</div>
                </div>
                <div>trash</div>
            </div>
            <div className='flex-1 border-2 bg-gray-100 rounded-lg'>
                <div>Icon</div>
                <div>Tap to Start Creating</div>
            </div>
            <div className='flex p-2'>
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
    icon: string;
    count: number;
}

const feedButtonData = [
    { icon: "", count: 4 },
    { icon: "", count: 4 },
    { icon: "", count: 4 },
    { icon: "", count: 4 },
]

const FeedButton: React.FC<FeedButtonProps> = ({ icon, count }) => {
    return (
        <button className='flex bg-gray-200 rounded-3xl w-16 p-2'>
            <div><img src={icon} alt="" /></div>
            <div>{count}</div>
        </button>
    )
}

const FeedComponent = () => {
    return (
        <div>
            <div>
                <div className='flex'>
                    <div className='p-1'><img src={image1} alt="" className='rounded-full h-12 w-12' /></div>
                    <div className='flex-grow'>
                        <p className='font-semibold'>Seam meme</p>
                        <p className='font-light text-sm text-gray-400'>Text Block</p>
                    </div>
                    <div className=''><button>...</button></div>
                </div>
                <div className='flex space-x-2 items-center'>
                    <p className='font-light text-sm text-gray-400'>Collected Into</p>
                    <p className='text-sm'>Let's Party</p>
                    <p className='font-light text-sm text-gray-400'>Feb 26</p>
                </div>
            </div>
            <div className='flex flex-col h-96'>
                <p className='text-lg'>My first Meme!!</p>
                <div className='flex-1 p-2 border-2'><img src={image2} alt="" className='' /></div>
                <div className='flex p-2 space-x-2'>
                    {feedButtonData.map((x, index) => {
                        return (
                            <FeedButton key={index} icon={x.icon} count={x.count} />
                        )
                    })}
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
            <MemeEditor />
            {/* <FeedComponent /> */}
            {/* <button onClick={() => { done(model) }} className='bg-blue-300 w-full rounded-lg'> Create your own meme </button> */}
        </div>
    );
}