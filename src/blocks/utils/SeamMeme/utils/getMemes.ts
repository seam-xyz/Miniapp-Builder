import axios from "axios"
import type { Meme } from "../types/types"

const getMemes = async (): Promise<Meme[]> => {
    const res = await axios({
        method: "GET",
        url: "https://api.imgflip.com/get_memes"
    })
    const memes = res.data.data.memes
    return memes
}

export default getMemes

