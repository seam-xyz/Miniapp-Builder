// Libraries
import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";

// Components
import EditorDraggableText from "./EditorDraggableText";
import EditorModal from "./EditorModal";

// Icons
import UndoIcon from '@mui/icons-material/Undo';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AbcIcon from '@mui/icons-material/Abc';

// Utils
import { dataLoader } from "./dataLoader";

// Types
import { DraggableData } from "react-draggable";
import { EditorProps, TextOverlay } from "../types/types";

const Editor = ({ model, done, meme, handleSetMeme }: EditorProps) => {
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
    const newId = Date.now();
    const newText: TextOverlay = {
      id: newId,
      text: text,
      position: {
        x: 0,
        y: 0,
      },
      fontSize: 32,
    };
    setTexts([...texts, newText]);
    setSelectedTextId(newId);
  };

  const removeLastOverlay = () => {
    if (texts.length > 0) {
      setTexts((prevTexts) => prevTexts.slice(0, -1));
      setSelectedTextId(null);
    }
  };

  const handleTextClick = (id: number) => {
    setSelectedTextId(id);
  };

  const handleDrag = (id: number, data: DraggableData) => {
    setTexts((prevTexts) =>
      prevTexts.map((text) =>
        text.id === id ? { ...text, position: { x: data.x, y: data.y } } : text
      )
    );
  };

  // Text size functionality
  const getFontSizeOfSelectedText = () => {
    const selectedText = texts.find((text) => text.id === selectedTextId);
    return selectedText ? selectedText.fontSize : 32;
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFontSize = parseInt(e.target.value, 10);
    setTexts((prevTexts) =>
      prevTexts.map((text) =>
        text.id === selectedTextId ? { ...text, fontSize: newFontSize } : text
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
			const dataURL = canvas.toDataURL("image/png");
      await dataLoader(dataURL, model, done)
		}
	};

  return (
    <div className="flex flex-col items-center h-[80%] justify-between items-center">
      {/* Top buttons with undo and delete meme functionality */}
      <div className="h-12 flex justify-end space-x-2 w-full">
        <button
          onClick={() => removeLastOverlay()}
          className="w-14 h-full border-2 border-gray-200 rounded-3xl flex items-center justify-center"
        >
          <UndoIcon className="text-gray-400" />
        </button>
        <button
          onClick={() => handleSetMeme(undefined)}
          className="w-14 h-full border-2 border-gray-200 rounded-3xl flex items-center justify-center"
        >
          <DeleteOutlineIcon className="text-gray-400" />
        </button>
      </div>

      {/* Image with draggable text */}
      <div
        ref={containerRef}
        style={{ position: "relative", display: "inline-block" }}
        className="h-[60%] w-full bg-gray-100 rounded-lg p-2 flex justify-center items-center"
      >
        <div className="relative w-full h-full flex justify-center items-center">
          <img
            src={meme.url}
            alt="Meme Background"
            className="max-w-full max-h-full object-contain mx-auto my-auto"
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
      </div>

      {/* Add Text button that opens up modal */}
      <button
        onClick={() => changeModalState(true)}
        className="w-28 border-2 rounded-xl bg-sky-500 text-white font-bold flex flex-col items-center justify-center p-2 m-2"
      >
        <div className="w-full flex justify-center flex-grow">
          <AbcIcon />
        </div>
        <div className="text-sm">Text</div>
      </button>

      {/* Text size slider */}
      <div className="w-full m-2">
        <input
          type="range"
          min="10"
          max="100"
          value={getFontSizeOfSelectedText()}
          onChange={handleFontSizeChange}
          className="w-full"
        />
      </div>

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
