import { useState, useEffect } from "react";
import axios from "axios"

// components
import Browser from "./Browser";
import Editor from "./Editor";

// types
import type { MemeGenAppComposerProps, Meme } from "../types/types";

// Get memes
const getMemes = async (): Promise<Meme[]> => {
    const res = await axios({
        method: "GET",
        url: "https://api.imgflip.com/get_memes"
    })
    const memes = res.data.data.memes
    return memes
}

// AppComposer
const MemeGenAppComposer = ({ model, done }: MemeGenAppComposerProps) => {
	// Browser component state
	const [memes, setMemes] = useState<Meme[]>([]);
	const [meme, setMeme] = useState<Meme | undefined>(undefined);

	// Browser: Handler for setting a meme
	const handleSetMeme = (meme: Meme | undefined) => {
		setMeme(meme);
	};

	// Effect for loading memes
	useEffect(() => {
		const fetch = async () => {
			const res = await getMemes();
			setMemes(res);
		};
		fetch();
	}, []);

	return (
		<div className="h-full w-full">
			{!meme ? (
				<Browser memes={memes} handleSetMeme={handleSetMeme} />
			) : (
				<Editor model={model} done={done} meme={meme} handleSetMeme={handleSetMeme} />
			)}
		</div>
	);
};

export default MemeGenAppComposer;
