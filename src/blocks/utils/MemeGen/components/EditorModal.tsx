import { useState } from "react";
import { EditorModalProps } from "../types/types";

function checkEmptyString(input: string): boolean {
	return input.trim().length > 0;
}

const EditorModal = ({ addTextOverlay, changeModalState }: EditorModalProps) => {
	const [text, setText] = useState<string>("");
	const [error, setError] = useState<boolean>(false);
	const handleSubmit = (text: string) => {
		if (checkEmptyString(text)) {
			addTextOverlay(text);
			changeModalState(false);
			setError(false);
		} else {
			setError(true);
		}
	};
	return (
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
						onClick={() => handleSubmit(text)}
						className="w-full p-3 bg-sky-500 text-sm rounded-lg text-white font-bold"
					>
						Submit
					</button>
					<button
						onClick={() => changeModalState(false)}
						className="w-full p-3 bg-sky-500 text-sm rounded-lg text-white font-bold"
					>
						Close
					</button>
				</div>
				{error && <p className="text-red-500 text-center">Can't submit empty space!</p>}
			</div>
		</div>
	);
};

export default EditorModal;
