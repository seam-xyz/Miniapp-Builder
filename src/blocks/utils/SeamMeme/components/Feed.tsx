import { icons } from "../assets/icons";
import { images } from "../assets/images";

interface FeedButtonProps {
    count: number;
    icon: React.ElementType;
}

const feedButtonData = [
    { count: 4, icon: icons.chat },
    { count: 4, icon: icons.emoji },
    { count: 4, icon: icons.share },
]


const FeedButton: React.FC<FeedButtonProps> = ({ icon: Icon, count }) => {
    return (
        <button className='flex bg-gray-100 rounded-3xl w-14 h-10 p-2 items-center justify-between'>
            <div className='text-md p-1'><Icon fontSize="inherit" /></div>
            <p className='p-1 text-sm'>{count}</p>
        </button>
    )
}

const Feed = () => {
    return (
        <div className='border-2 border-gray-100 rounded-xl p-2 h-7/8 flex flex-col'>
            <div>
                <div className='flex items-center'>
                    <div className='p-1'><img src={images.image2} alt="" className='rounded-full h-12 w-12' /></div>
                    <div className='flex-grow p-1'>
                        <p className='font-semibold'>Seam meme</p>
                        <p className='font-light text-xs text-gray-400'>Text Block</p>
                    </div>
                    <div className=''><button className='bg-gray-100 border-2 rounded-full p-1'><icons.more /></button></div>
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
                    <img src={images.image2} alt="Meme" className='h-96 object-none' />
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
                        <FeedButton icon={icons.photo} count={5} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Feed