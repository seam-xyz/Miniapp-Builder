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
		<div className="flex flex-col h-full w-full">
			{/* Undo and Delete buttons */}
			<div className="flex flex-row-reverse m-2">
				<div className="px-2 border-gray-200 border-2 rounded-3xl h-10 w-14 flex justify-center text-gray-400 ml-2">
					<button onClick={() => handleSetMeme(undefined)} className="w-full h-full">
						<icons.delete color="inherit" />
					</button>
				</div>
				<div className="px-2 border-gray-200 border-2 rounded-3xl h-10 w-14 flex justify-center ml-2">
					<button onClick={resetEdit} className="w-full h-full">
						<icons.undo color="inherit" />
					</button>
				</div>
			</div>

			{/* Original image */}
			<div className="flex-1 border-2 bg-gray-200 rounded-lg text-gray-400 m-2 flex justify-center items-center">
				{editedMeme ? (
					<img src={editedMeme} alt="edited" />
				) : (
					<>
						<img
							src={meme.url}
							ref={imageRef}
							alt="editable"
							crossOrigin="anonymous"
							className="w-80 h-80"
						/>
						<canvas ref={canvasRef} className="hidden w-72 h-72"></canvas>
						{overlayText && (
							<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold pointer-events-none uppercase relative">
								<span className="absolute inset-0 text-black stroke-text">
									{overlayText}
								</span>
								<span>{overlayText}</span>
							</div>
						)}
					</>
				)}
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

			{/* Text Button */}
			<div className="flex justify-center">
				<button
					onClick={openModal}
					className="m-2 p-2 w-28 border-2 rounded-xl flex flex-col items-center justify-center bg-sky-500 text-white font-bold"
				>
					<div className="w-full flex justify-center p-1 flex-grow">
						<icons.text />
					</div>
					<div className="w-full text-center p-1 flex-grow text-sm">Text</div>
				</button>
			</div>

			{/* Post */}
			<div className="w-full p-1 flex items-center justify-center my-2">
				<button
					onClick={() => handleSubmit()}
					className="bg-blue-600 w-full h-full h-16 rounded-lg text-white"
				>
					Post
				</button>
			</div>
		</div>
	);
};

export default MemeEditor;
