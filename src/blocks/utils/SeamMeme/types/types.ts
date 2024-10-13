import { BlockModel } from "../../../types";
import { DraggableData } from "react-draggable";

export type Meme = {
	box_count: number;
	captions: number;
	height: number;
	id: string;
	name: string;
	url: string;
	width: string;
};

export interface AppComposerProps {
	model: BlockModel;
	done: (data: BlockModel) => void;
}

export interface AppFeedProps {
	model: BlockModel;
	update: (data: { [key: string]: string }) => void;
}

export interface BrowserProps {
	memes: Meme[];
	handleSetMeme: (meme: Meme) => void;
}

export interface TextOverlay {
	id: number;
	text: string;
	position: { x: number; y: number };
	fontSize: number;
}

export interface EditorProps {
	model: BlockModel;
	done: (data: BlockModel) => void;
	meme: Meme;
	handleSetMeme: (meme: Meme | undefined) => void;
}

export interface EditorModalProps {
	addTextOverlay: (text: string) => void;
	changeModalState: (state: boolean) => void;
}

export interface EditorDraggableTextProps {
	textItem: TextOverlay;
	isSelected: boolean;
	onDrag: (id: number, data: DraggableData) => void;
	onTextClick: (id: number) => void;
}
