import { useState, useEffect } from "react";

// components
import MemeBrowser from "./MemeBrowser";
// import MemeEditor from "./MemeEditor";
// import Test from "./Test";
import Editor from "./editor/Editor";

// utils
import getMemes from "../utils/getMemes";

// types
import type { Meme } from "../types/types";
import { BlockModel } from "../../../types";
import MemeEditor2 from "./editor/Editor";

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
	const handleSetMeme = (meme: Meme | undefined) => {
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
			{/* {!meme ? (
				<MemeBrowser memes={memes} handleSetMeme={handleSetMeme} />
			) : (
				<MemeEditor
					meme={meme}
					editedMeme={editedMeme}
					handleSetMeme={handleSetMeme}
					handleSetEditedMeme={handleSetEditedMeme}
					handleSubmit={handleSubmit}
				/>
			)} */}
			{/* <Test /> */}
			<Editor
				model={model}
				done={done}
				imageSrc="https://images.theconversation.com/files/38926/original/5cwx89t4-1389586191.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=926&fit=clip"
			/>
		</div>
	);
};

export default AppComposer;
