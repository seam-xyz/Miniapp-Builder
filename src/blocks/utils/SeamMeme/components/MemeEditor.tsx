import { useState, useEffect, useRef } from "react";
import { icons } from "../assets/icons";
import { Meme } from "../types/types";

interface MemeEditorProps {
	meme: Meme;
	editedMeme: string | null;
	handleSetEditedMeme: (editedMeme: string | null) => void;
	handleSubmit: (caption: string) => void;
}

const MemeEditor: React.FC<MemeEditorProps> = ({
	meme,
	editedMeme,
	handleSetEditedMeme,
	handleSubmit,
}) => {
	const [caption, setCaption] = useState<string>("");
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

				// Draw the overlayed text
				ctx.font = "20px Arial";
				ctx.fillStyle = "white";
				ctx.textAlign = "center";
				ctx.fillText(overlayText, canvas.width / 2, canvas.height / 2);

				// Convert canvas to a data URL and save it in state
				const dataURL = canvas.toDataURL();
				// setEditedImage(dataURL);
				handleSetEditedMeme(dataURL);
			}
		}
	}, [overlayText]);

	return (
		<div className="flex flex-col h-full">
			<div className="flex justify-between m-2">
				<div className="flex flex-row text-gray-400 space-x-2">
					<div className="px-2 border-gray-200 border-2 rounded-3xl h-10 w-14 flex justify-center">
						<button className="w-full h-full">
							<icons.undo color="inherit" />
						</button>
					</div>
					<div className="px-2 border-gray-200 border-2 rounded-3xl h-10 w-14 flex justify-center">
						<button className="w-full h-full">
							<icons.redo color="inherit" />
						</button>
					</div>
				</div>
				<div className="px-2 border-gray-200 border-2 rounded-3xl h-10 w-14 flex justify-center text-gray-400">
					<button className="w-full h-full">
						<icons.delete color="inherit" />
					</button>
				</div>
			</div>

			{/* original image */}
			<div className="flex-1 border-2 bg-gray-200 rounded-lg text-gray-400 m-2">
				{/* Conditionally render the image or canvas */}
				{editedMeme ? (
					// Show edited image when available
					<img src={editedMeme} alt="edited" />
				) : (
					<>
						{/* Show the image before editing */}
						<img
							src={meme.url}
							ref={imageRef}
							alt="editable"
							crossOrigin="anonymous"
							className=""
						/>
						{/* The canvas, initially hidden */}
						<canvas ref={canvasRef} className="hidden"></canvas>
						{overlayText && (
							<span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-lg font-bold pointer-events-none">
								{overlayText}
							</span>
						)}
					</>
				)}
			</div>
			{/* Open text-add modal */}
			<button onClick={openModal}>Add Text</button>
			{/* <button onClick={resetEdit}>Reset Edit</button> */}

			{/* Modal */}
			{isModalVisible && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
					<div>
						<input
							placeholder="Enter text here"
							value={text}
							onChange={(e) => setText(e.target.value)}
						/>
						<button onClick={handleTextSubmit}>Submit</button>
						<button onClick={closeModal}>Close</button>
					</div>
				</div>
			)}
			{/* <div className='flex justify-between'>
                {memeEditorButtons.map((x, index) => {
                    return (
                        <MemeEditorButton key={index} title={x.title} icon={x.icon} />
                    )
                })}
            </div> */}
			<div className="w-full p-1 flex items-center justify-center my-2 border-t-2 border-gray-200">
				<div className="bg-black rounded-full m-2">Image</div>
				<input
					value={caption}
					onChange={(e) => setCaption(e.target.value)}
					className="w-full m-2 text-sm text-gray-400 h-full p-2"
					placeholder="Say Something..."
				/>
			</div>
			<div className="w-full p-1 flex items-center justify-center my-2">
				<button
					onClick={() => handleSubmit(caption)}
					className="bg-blue-600 w-full h-full h-16 rounded-lg text-white"
				>
					Post
				</button>
			</div>
		</div>
	);
};

export default MemeEditor;
