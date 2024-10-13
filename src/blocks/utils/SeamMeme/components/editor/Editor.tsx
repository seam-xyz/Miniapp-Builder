import React, { useRef, useState } from "react";
import { DraggableData } from "react-draggable";
import { icons } from "../../assets/icons";
import html2canvas from "html2canvas";
import { BlockModel } from "../../../../types";

// Components
import DraggableText from "./DraggableText";
import EditorModal from "./EditorModal";

interface TextOverlay {
	id: number;
	text: string;
	position: { x: number; y: number };
}

interface EditorProps {
	model: BlockModel;
	done: (data: BlockModel) => void;
	imageSrc: string;
}

const Editor: React.FC<EditorProps> = ({ model, done, imageSrc }) => {
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
		const newText: TextOverlay = {
			id: Date.now(),
			text: text,
			position: { x: 50, y: 50 },
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
			{/* Top buttons */}
			<div className="h-12 flex justify-end space-x-2 w-full">
				<button
					onClick={() => removeLastOverlay()}
					className="w-14 h-full border-2 border-gray-200 rounded-3xl flex items-center justify-center"
				>
					<icons.undo className="text-gray-400" />
				</button>
				<button className="w-14 h-full border-2 border-gray-200 rounded-3xl flex items-center justify-center">
					<icons.delete className="text-gray-400" />
				</button>
			</div>

			{/* Image */}
			<div ref={containerRef}>
				<img src={imageSrc} alt="Meme Background" style={{ width: "100%" }} />
				{texts.map((textItem) => (
					<DraggableText
						key={textItem.id}
						textItem={textItem}
						isSelected={textItem.id === selectedTextId}
						onDrag={handleDrag}
						onTextClick={handleTextClick}
					/>
				))}
			</div>

			{/* Add Text */}
			<button
				onClick={() => changeModalState(true)}
				className="w-28 border-2 rounded-xl bg-sky-500 text-white font-bold flex flex-col items-center justify-center p-2"
			>
				<div className="w-full flex justify-center flex-grow">
					<icons.text />
				</div>
				<div className="text-sm">Text</div>
			</button>

			{/* Post */}
			<button
				onClick={() => handleSubmit()}
				className="w-full h-12 bg-blue-600 rounded-lg text-white font-bold"
			>
				Post
			</button>

			{/* Modal */}
			{modalOpen && (
				<EditorModal addTextOverlay={addTextOverlay} changeModalState={changeModalState} />
			)}
		</div>
	);
};

interface TextEditorProps {
	textItem: TextOverlay;
	onUpdateText: (id: number, newText: string) => void;
	onDeleteText: (id: number) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ textItem, onUpdateText, onDeleteText }) => {
	const [inputValue, setInputValue] = useState<string>(textItem.text);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleUpdate = () => {
		onUpdateText(textItem.id, inputValue);
	};

	const handleDelete = () => {
		onDeleteText(textItem.id);
	};

	return (
		<div className="text-editor">
			<input type="text" value={inputValue} onChange={handleChange} />
			<button onClick={handleUpdate}>Update Text</button>
			<button onClick={handleDelete}>Delete Text</button>
		</div>
	);
};

export default Editor;
