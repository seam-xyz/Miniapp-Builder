// Libraries
import React, { useRef, useState } from "react";
import { icons } from "../assets/icons";
import html2canvas from "html2canvas";

// Components
import EditorDraggableText from "./EditorDraggableText";
import EditorModal from "./EditorModal";

// Types
import { DraggableData } from "react-draggable";
import { BlockModel } from "../../../types";
import { Meme } from "../types/types";

interface TextOverlay {
	id: number;
	text: string;
	position: { x: number; y: number };
}

interface EditorProps {
	model: BlockModel;
	done: (data: BlockModel) => void;
	meme: Meme;
	handleSetMeme: (meme: Meme | undefined) => void;
}

const Editor: React.FC<EditorProps> = ({ model, done, meme, handleSetMeme }) => {
	const [texts, setTexts] = useState<TextOverlay[]>([]);
	const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Modal
	const changeModalState = (state: boolean) => {
		setModalOpen(state);
	};

	// Text overlay functionality
	const addTextOverlay = (text: string) => {
		const container = containerRef.current;
		const containerRect = container?.getBoundingClientRect();
		const newText: TextOverlay = {
			id: Date.now(),
			text: text,
			position: {
				x: 100,
				y: -200,
			},
		};
		setTexts([...texts, newText]);
	};

	const removeLastOverlay = () => {
		if (texts.length > 0) {
			setTexts((prevTexts) => prevTexts.slice(0, -1));
			setSelectedTextId(null);
		}
	};

	const handleTextClick = (id: number) => {
		setSelectedTextId(id);
		// Implement additional logic for editing, resizing, or deleting
	};

	const handleDrag = (id: number, data: DraggableData) => {
		setTexts((prevTexts) =>
			prevTexts.map((text) =>
				text.id === id ? { ...text, position: { x: data.x, y: data.y } } : text
			)
		);
	};

	// Submit new meme image
	const handleSubmit = async () => {
		if (containerRef.current) {
			const canvas = await html2canvas(containerRef.current, {
				useCORS: true,
				allowTaint: false,
			});
			const dataUrl = canvas.toDataURL("image/png");
			model.data.editedMeme = dataUrl;
			done(model);
		}
	};

	return (
		<div style={{ position: "relative" }} className="flex flex-col items-center space-y-2">
			{/* Top buttons with undo and delete meme functionality */}
			<div className="h-12 flex justify-end space-x-2 w-full">
				<button
					onClick={() => removeLastOverlay()}
					className="w-14 h-full border-2 border-gray-200 rounded-3xl flex items-center justify-center"
				>
					<icons.undo className="text-gray-400" />
				</button>
				<button
					onClick={() => handleSetMeme(undefined)}
					className="w-14 h-full border-2 border-gray-200 rounded-3xl flex items-center justify-center"
				>
					<icons.delete className="text-gray-400" />
				</button>
			</div>

			{/* Image with draggable text */}
			<div ref={containerRef} style={{ position: "relative", display: "inline-block" }}>
				<img
					src={meme.url}
					alt="Meme Background"
					style={{ width: "100%" }}
					className="object-contain"
				/>
				{texts.map((textItem) => (
					<EditorDraggableText
						key={textItem.id}
						textItem={textItem}
						isSelected={textItem.id === selectedTextId}
						onDrag={handleDrag}
						onTextClick={handleTextClick}
					/>
				))}
			</div>

			{/* Add Text button that opens up modal */}
			<button
				onClick={() => changeModalState(true)}
				className="w-28 border-2 rounded-xl bg-sky-500 text-white font-bold flex flex-col items-center justify-center p-2"
			>
				<div className="w-full flex justify-center flex-grow">
					<icons.text />
				</div>
				<div className="text-sm">Text</div>
			</button>

			{/* Post button that takes user to Feed */}
			<button
				onClick={() => handleSubmit()}
				className="w-full h-12 bg-blue-600 rounded-lg text-white font-bold"
			>
				Post
			</button>

			{/* Modal for adding text */}
			{modalOpen && (
				<EditorModal addTextOverlay={addTextOverlay} changeModalState={changeModalState} />
			)}
		</div>
	);
};

export default Editor;
