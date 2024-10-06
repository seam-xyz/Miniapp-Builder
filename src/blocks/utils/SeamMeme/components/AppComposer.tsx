import { useState, useEffect } from "react";

// components
import MemeBrowser from "./MemeBrowser";
import MemeEditor from "./MemeEditor";

// utils
import getMemes from "../utils/getMemes";

// types
import type { Meme } from "../types/types";
import { BlockModel } from "../../../types";

// AppComposer
interface AppComposerProps {
	model: BlockModel;
	done: (data: BlockModel) => void;
}

const AppComposer = ({ model, done }: AppComposerProps) => {
	// Browser component state
	const [memes, setMemes] = useState<Meme[]>([]);
	const [meme, setMeme] = useState<Meme | undefined>(undefined);

	// Editor component state
	const [editedMeme, setEditedMeme] = useState<string | null>(null);

	// Browser: Handler for setting a meme
	const handleSetMeme = (meme: Meme) => {
		setMeme(meme);
	};

	// Editor: Handler for setting an edited meme
	const handleSetEditedMeme = (editedMeme: string | null) => {
		setEditedMeme(editedMeme);
	};

	// Editor: Submit a post
	const handleSubmit = () => {
		if (editedMeme === null) {
			return;
		}
		model.data.editedMeme = editedMeme;
		done(model);
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
				<MemeBrowser memes={memes} handleSetMeme={handleSetMeme} />
			) : (
				<MemeEditor
					meme={meme}
					editedMeme={editedMeme}
					handleSetEditedMeme={handleSetEditedMeme}
					handleSubmit={handleSubmit}
				/>
			)}
		</div>
	);
};

export default AppComposer;
