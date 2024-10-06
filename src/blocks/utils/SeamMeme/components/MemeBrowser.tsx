import { useState, useEffect } from "react";
import axios from "axios";

// #region: Composer - Meme Browser


interface MemeCarousel {
    images: string[];
}

const MemeCarousel: React.FC<MemeCarousel> = ({ images }) => {
    return (
        <div className='grid grid-cols-4 overflow-y-auto scrollbar-hide w-full'>{images.map((x, index) => {
            return (
                <div
                    key={index}
                    className='h-24 w-full p-1 flex justify-center items-center'>
                    <img src={x} alt={`Image ${index}`} className='rounded-xl w-full h-full object-cover' />
                </div>
            )
        })}</div>

    )
}

interface Meme {
    box_count: number;
    captions: number;
    height: number;
    id: string;
    name: string;
    url: string;
    width: string;
}

const MemeBrowser = () => {
    const [memeData, setMemeData] = useState<Meme[]>([])
    const [memeUrls, setMemeUrls] = useState<string[]>([])

    const getMemeData = async () => {
        const res = await axios({
            method: "GET",
            url: "https://api.imgflip.com/get_memes"
        })
        const memes = res.data.data.memes as Meme[]
        const urls = memes.map(x => x.url)
        setMemeData(memes)
        setMemeUrls(urls)
    }

    useEffect(() => {
        getMemeData()
    }, [])

    return (
        <div className='flex flex-col h-full'>
            <div className='flex flex-col justify-center'>
                <div className='border-2 border-gray-200 w-full rounded-lg'>
                    <input type="text" name="" id="" placeholder='Search "memes"' className='w-full h-full p-2 rounded-lg' />
                </div>
            </div>
            <p className='font-bold py-2 p-1'>Browse Memes</p>
            <div className='py-2 w-full overflow-y-auto scrollbar-hide flex items-center justify-center'>
                <MemeCarousel images={memeUrls} />
            </div>
            {/* <div className='w-full p-1 flex items-center justify-center my-2'>
                <button className='bg-blue-600 w-full h-full h-16 rounded-lg text-white'> Create your own meme </button>
            </div> */}
            <div className='w-full p-1 flex items-center justify-center my-2'></div>
        </div>
    )
}

export default MemeBrowser