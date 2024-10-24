import { useState } from "react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";

import { EditorDraggableTextProps } from "../types/types";

const EditorDraggableText = ({ textItem, onDrag, onTextClick }: EditorDraggableTextProps) => {
  console.log(`font size: ${textItem.fontSize}`);
  const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleStart = (_e: DraggableEvent, data: DraggableData) => {
    setStartPosition({ x: data.x, y: data.y });
  };

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    onDrag(textItem.id, data);
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
    <Draggable
      position={textItem.position}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
      bounds="parent"
    >
      <div
        style={{
          position: "absolute",
          cursor: "move",
          padding: "2px",
          userSelect: "none",

          // Meme font style
          fontFamily: '"Anton", Impact, Arial Black, sans-serif',
          fontWeight: "normal" as const,
          textTransform: "uppercase" as const,
          color: "white",
          fontSize: `${textItem.fontSize}px`,
          textAlign: "center" as const,
          textShadow: `
					  1px 1px 0 #000,
					  -1px 1px 0 #000,
					  1px -1px 0 #000,
					  -1px -1px 0 #000,
					  1px 1px 0 #000,
					  -1px 1px 0 #000,
					  0px 2px 0 #000,
					  0px -2px 0 #000
					`,
        }}
      >
        {textItem.text}
      </div>
    </Draggable>
  );
};

export default EditorDraggableText;
