import { useState, useEffect } from "react";

// components
import Browser from "./Browser";
import Editor from "./Editor";

// utils
import getMemes from "../utils/getMemes";

// types
import type { MemeGenAppComposerProps, Meme } from "../types/types";

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
