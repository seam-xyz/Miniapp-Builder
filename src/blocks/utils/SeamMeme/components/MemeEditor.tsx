import { useState, useEffect, useRef } from "react";
import { icons } from "../assets/icons";
import { Meme } from "../types/types";

interface MemeEditorProps {
	meme: Meme;
	editedMeme: string | null;
	handleSetMeme: (meme: Meme | undefined) => void;
	handleSetEditedMeme: (editedMeme: string | null) => void;
	handleSubmit: () => void;
}

const MemeEditor: React.FC<MemeEditorProps> = ({
	meme,
	editedMeme,
	handleSetMeme,
	handleSetEditedMeme,
	handleSubmit,
}) => {
	const [text, setText] = useState<string>("");
	const [overlayText, setOverlayText] = useState<string | null>(null);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

	const imageRef = useRef<HTMLImageElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	console.log("text:", text);
	console.log("overlayText:", overlayText);
	console.log("isModalVisible:", isModalVisible);

	const openModal = () => {
		setIsModalVisible(true);
		resetEdit();
	};

	const closeModal = () => {
		setIsModalVisible(false);
	};

	const handleTextSubmit = () => {
		setOverlayText(text);
		closeModal();
	};

	const resetEdit = () => {
		setOverlayText(null);
		setText("");
		handleSetEditedMeme(null);
	};

	useEffect(() => {
		if (overlayText && imageRef.current && canvasRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");
			const image = imageRef.current;

			if (ctx && image) {
				// Set canvas dimensions to match the image
				canvas.width = image.width;
				canvas.height = image.height;

				// Clear canvas
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				// Draw the image on the canvas
				ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

				// Set initial font size and calculate text width
				let fontSize = 40;
				ctx.font = `bold ${fontSize}px Impact`;

				// Shrink text size if it exceeds the canvas width
				while (ctx.measureText(overlayText).width > canvas.width - 20 && fontSize > 20) {
					fontSize -= 1;
					ctx.font = `bold ${fontSize}px Impact`;
				}

				// Draw the overlayed text
				ctx.fillStyle = "white";
				ctx.strokeStyle = "black";
				ctx.lineWidth = fontSize / 8;
				ctx.textAlign = "center";
				ctx.textBaseline = "top";

				// Position the text at the top, with a margin of 10px
				const x = canvas.width / 2;
				const y = 10;

				ctx.strokeText(overlayText, x, y);
				ctx.fillText(overlayText, x, y);

				// Convert canvas to a data URL and save it in state
				const dataURL = canvas.toDataURL();
				handleSetEditedMeme(dataURL);
			}
		}
	}, [overlayText]);

	return (
		<div className="flex flex-col h-[80%] justify-between">
			{/* Undo and Delete buttons */}
			<div className="h-12 flex justify-end space-x-2">
				<button
					onClick={() => handleSetMeme(undefined)}
					className="w-14 h-full border-2 border-gray-200 rounded-3xl flex items-center justify-center"
				>
					<icons.delete className="text-gray-400" />
				</button>
				<button
					onClick={resetEdit}
					className="w-14 h-full border-2 border-gray-200 rounded-3xl flex items-center justify-center"
				>
					<icons.undo className="text-gray-400" />
				</button>
			</div>

			{/* Image container */}
			<div className="h-full relative border-2 bg-gray-200 rounded-lg m-2 overflow-hidden">
				<div className="absolute inset-0 flex items-center justify-center">
					{editedMeme ? (
						<img
							src={editedMeme}
							alt="edited"
							className="max-h-full max-w-full object-contain"
						/>
					) : (
						<>
							<img
								src={meme.url}
								ref={imageRef}
								alt="editable"
								crossOrigin="anonymous"
								className="max-h-full max-w-full object-contain"
							/>
							<canvas ref={canvasRef} className="hidden"></canvas>
							{overlayText && (
								<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
									<div className="relative">
										<span className="absolute inset-0 text-black stroke-text uppercase font-bold text-4xl">
											{overlayText}
										</span>
										<span className="text-white uppercase font-bold text-4xl">
											{overlayText}
										</span>
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</div>

			{/* Bottom buttons */}
			<div className="p-2 space-y-2 flex flex-col">
				<div className="flex justify-center">
					<button
						onClick={openModal}
						className="w-28 border-2 rounded-xl bg-sky-500 text-white font-bold flex flex-col items-center justify-center p-2"
					>
						<div className="w-full flex justify-center flex-grow">
							<icons.text />
						</div>
						<div className="text-sm">Text</div>
					</button>
				</div>

				<button
					onClick={() => handleSubmit()}
					className="w-full h-12 bg-blue-600 rounded-lg text-white font-bold"
				>
					Post
				</button>
			</div>

			{/* Modal */}
			{isModalVisible && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
					<div className="bg-white h-60 w-80 flex flex-col p-2 rounded-lg">
						<input
							placeholder="Enter text here"
							value={text}
							onChange={(e) => setText(e.target.value)}
							className="h-full p-2 border-[0.25px] m-2 outline-none"
						/>
						<div className="flex space-x-2 p-2">
							<button
								onClick={handleTextSubmit}
								className="w-full p-3 bg-sky-500 text-sm rounded-lg text-white font-bold"
							>
								Submit
							</button>
							<button
								onClick={closeModal}
								className="w-full p-3 bg-sky-500 text-sm rounded-lg text-white font-bold"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MemeEditor;
