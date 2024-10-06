import { useState, useEffect } from "react"
import axios from "axios"
import { icons } from "../assets/icons"
import type { Meme } from "../types/types"


const ChooseMediaComponent = () => {
    const [memeData, setMemeData] = useState<Meme[]>([])
    const [memeUrls, setMemeUrls] = useState<string[]>([])

    const getMemeData = async () => {
        const res = await axios({
            method: "GET",
            url: "https://api.imgflip.com/get_memes"
        })
        const memes = res.data.data.memes as Meme[]
        const urls = memes.map(x => x.url)
        // console.log(memes)
        // console.log(urls)
        setMemeData(memes)
        setMemeUrls(urls)
    }

    useEffect(() => {
        getMemeData()
    }, [])
    return (
        <div className='flex flex-col h-full w-full'>
            <div className='flex w-full'>
                <p className='flex-1 m-2 text-xl'>Choose Media</p>
                <div>
                    <button>X</button>
                </div>
            </div>
            <div className='overflow-y-auto scrollbar-hide h-[70%] my-2'>
                <div className='flex justify-between my-2'>
                    <button className='rounded-xl bg-gray-100 p-3'>
                        <div className='text-gray-400'><icons.image color='inherit' /></div>
                        <p className='font-bold text-xs'>Import Image</p>
                    </button>
                    <button className='rounded-xl bg-gray-100 p-3'>
                        <div className='text-gray-400'><icons.video color='inherit' /></div>
                        <p className='font-bold text-xs'>Import Video</p>
                    </button>
                    <button className='rounded-xl bg-gray-100 p-3'>
                        <div className='text-gray-400'><icons.photo color='inherit' /></div>
                        <p className='font-bold text-xs'>Import Camera</p>
                    </button>
                </div>
                <div className='my-2'>
                    <p className='m-2 font-bold'>Color</p>
                    <div className='flex'>
                        <div className='mr-2 bg-black h-20 w-20 rounded-full border-2 border-gray-100'>
                            <button className='w-full h-full'></button>
                        </div>
                        <div className='mr-2 bg-white h-20 w-20 rounded-full border-2 border-gray-100'>
                            <button className='w-full h-full'></button>
                        </div>
                        <div className='mr-2 bg-black h-20 w-20 rounded-full border-2 border-gray-100'>
                            <button className='w-full h-full'></button>
                        </div>
                    </div>
                </div>
                {/* <MemeCarousel title='Popular Memes' images={memeUrls} /> */}
            </div>
            <div className='w-full h-[10%] p-1 flex items-center justify-center'>
                <button className='bg-blue-600 w-full rounded-lg h-full text-white'> Create your own meme </button>
            </div>
        </div>
    )
}

export default ChooseMediaComponent