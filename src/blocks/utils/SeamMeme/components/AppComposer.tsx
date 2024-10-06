import { useState, useEffect } from "react";

// components
import MemeBrowser from "./MemeBrowser";
import MemeEditor from "./MemeEditor";

// utils
import getMemes from "../utils/getMemes";

// types
import type { Meme } from "../types/types";

const AppComposer = () => {
	const [memes, setMemes] = useState<Meme[]>([]);
	const [selectedMeme, setSelectedMeme] = useState<Meme | undefined>(undefined);

	// Handler for selecting a meme
	const handleSetSelectedMeme = (meme: Meme) => {
		setSelectedMeme(meme);
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
			{selectedMeme ? (
				<MemeBrowser memes={memes} handleSetSelectedMeme={handleSetSelectedMeme} />
			) : (
				<MemeEditor />
			)}
		</div>
	);
};

export default AppComposer;
