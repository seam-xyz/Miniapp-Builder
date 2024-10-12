import { useState } from "react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";

interface TextOverlay {
	id: number;
	text: string;
	position: { x: number; y: number };
}

interface DraggableTextProps {
	textItem: TextOverlay;
	isSelected: boolean;
	onDrag: (id: number, data: DraggableData) => void;
	onTextClick: (id: number) => void;
}

const DraggableText: React.FC<DraggableTextProps> = ({
	textItem,
	isSelected,
	onDrag,
	onTextClick,
}) => {
	const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});

	const handleStart = (_e: DraggableEvent, data: DraggableData) => {
		setStartPosition({ x: data.x, y: data.y });
	};

	const handleStop = (e: DraggableEvent, data: DraggableData) => {
		const deltaX = data.x - startPosition.x;
		const deltaY = data.y - startPosition.y;
		const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		const clickThreshold = 5; // Adjust this value as needed

		if (distance < clickThreshold) {
			onTextClick(textItem.id);
		} else {
			onDrag(textItem.id, data);
		}
	};

	return (
		<Draggable position={textItem.position} onStart={handleStart} onStop={handleStop}>
			<div
				style={{
					position: "absolute",
					cursor: "move",
					border: isSelected ? "1px solid blue" : "none",
					padding: "2px",
					userSelect: "none",
				}}
			>
				{textItem.text}
			</div>
		</Draggable>
	);
};

export default DraggableText;
