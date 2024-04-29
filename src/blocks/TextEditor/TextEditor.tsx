import React from 'react';
import { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw, DraftHandleValue, Modifier } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Button as AntdButton } from "antd";
import { Map } from 'immutable';
import { List, AlignLeft, AlignCenter, AlignRight, Code } from 'react-feather'
import { ReactComponent as NumberedList } from "./images/NumberedList.svg"

interface TextEditorProps {
  data: string | null;
  done: (data: string) => void;
}

interface ColorPickerProps {
  onColorSelected: (color: string) => void;
}

interface EditorButtonProps {
  onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void;
  active: boolean;
  label: any;
  styleType: 'header' | 'style' | 'list' | 'alignment';
}

const EditorButton: React.FC<EditorButtonProps> = ({ onMouseDown, active, label, styleType }) => {
  const isActiveListOrAlignment = styleType === 'list' || styleType === 'alignment';
  
  return (
    <button
      onMouseDown={onMouseDown}
      className={`p-1 rounded-full bg-[#EFEFEF] font-bold border ${active ? "bg-seam-pink text-white" : "text-seam-black"}`}
      style={{ width: '24px', height: '24px', padding: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      {isActiveListOrAlignment ? React.cloneElement(label, { color: active ? "white" : "black" }) : label}
    </button>
  );
};

interface ButtonContainerProps {
  children: React.ReactNode;
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({ children }) => {
  return (
    <div className="rounded-full bg-[#FCFCFC] p-4 border-2 border-[#EFEFEF] space-x-2 flex">
      {children}
    </div>
  );
};

const TextEditor: React.FC<TextEditorProps> = ({ data, done }) => {
  const initialState: EditorState = data ? EditorState.createWithContent(convertFromRaw(JSON.parse(data))) : EditorState.createEmpty();
  const [editorState, setEditorState] = React.useState<EditorState>(initialState);
  const [currentColor, setCurrentColor] = React.useState<string>('black');

  const isActiveStyle = (style: string): boolean => editorState.getCurrentInlineStyle().has(style);
  const getBlockType = (): string => editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getType();
  const getBlockData = (key: string): any => editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getData().get(key);

  const handleKeyCommand = (command: string, state: EditorState): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    toggleColor(color); // Apply the selected color to the text
  };

  const toggleInlineStyle = (style: string) => () => setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  const toggleBlockType = (type: string) => () => setEditorState(RichUtils.toggleBlockType(editorState, type));

  const applyAlignment = (alignment: string) => () => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const blockData = contentState.getBlockForKey(selection.getStartKey()).getData();
    const newBlockData = blockData.set('textAlign', alignment);
    const newContentState = Modifier.mergeBlockData(contentState, selection, newBlockData);
    setEditorState(EditorState.push(editorState, newContentState, 'change-block-data'));
  };

  const blockStyleFn = (block: any) => {
    const textAlign = block.getData().get('textAlign');
    return textAlign ? `editor-alignment-${textAlign}` : '';
  };

  const styleMap = {
    STRIKETHROUGH: {
      textDecoration: 'line-through',
    },
  };

  const saveContent = () => done(JSON.stringify(convertToRaw(editorState.getCurrentContent())));

  const toggleColor = (color: string) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const nextContentState = Modifier.applyInlineStyle(contentState, selection, color);
    const nextEditorState = EditorState.push(editorState, nextContentState, 'change-inline-style');
    setEditorState(nextEditorState);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <input
        type="color"
        value={currentColor}
        onChange={(e) => handleColorChange(e.target.value)}
        style={{ margin: '8px', cursor: 'pointer' }}
      />
      <Editor
        customStyleMap={styleMap}
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        blockStyleFn={blockStyleFn}
      />
      <div className="flex flex-row overflow-x-scroll space-x-2 mt-2">
        <ButtonContainer>
          <EditorButton onMouseDown={toggleBlockType('header-one')} active={getBlockType() === 'header-one'} label="H1" styleType="header" />
          <EditorButton onMouseDown={toggleBlockType('header-two')} active={getBlockType() === 'header-two'} label="H2" styleType="header" />
          <EditorButton onMouseDown={toggleBlockType('header-three')} active={getBlockType() === 'header-three'} label="H3" styleType="header" />
        </ButtonContainer>
        <ButtonContainer>
          <EditorButton onMouseDown={toggleInlineStyle('BOLD')} active={isActiveStyle('BOLD')} label="B" styleType="style" />
          <EditorButton onMouseDown={toggleInlineStyle('ITALIC')} active={isActiveStyle('ITALIC')} label={<div className="italic">I</div>} styleType="style" />
          <EditorButton onMouseDown={toggleInlineStyle('UNDERLINE')} active={isActiveStyle('UNDERLINE')} label={<div className="underline">U</div>} styleType="style" />
          <EditorButton onMouseDown={toggleInlineStyle('STRIKETHROUGH')} active={isActiveStyle('STRIKETHROUGH')} label={<div className="line-through">S</div>} styleType="style" />
        </ButtonContainer>
        <ButtonContainer>
          <EditorButton onMouseDown={toggleBlockType('unordered-list-item')} active={getBlockType() === 'unordered-list-item'} label={<List size={24} color="black" />} styleType="list" />
          <EditorButton onMouseDown={toggleBlockType('ordered-list-item')} active={getBlockType() === 'ordered-list-item'} label={<NumberedList className="h-[16px] w-[19px]" />} styleType="list" />
          <EditorButton onMouseDown={toggleBlockType('code-block')} active={getBlockType() === 'code-block'} label={<Code size={24} color="black" />} styleType="list" />
        </ButtonContainer>
        <ButtonContainer>
          <EditorButton onMouseDown={applyAlignment('left')} active={getBlockData('textAlign') === 'left'} label={<AlignLeft size={24} color="black" />} styleType="alignment" />
          <EditorButton onMouseDown={applyAlignment('center')} active={getBlockData('textAlign') === 'center'} label={<AlignCenter size={24} color="black" />} styleType="alignment" />
          <EditorButton onMouseDown={applyAlignment('right')} active={getBlockData('textAlign') === 'right'} label={<AlignRight size={24} color="black" />} styleType="alignment" />
        </ButtonContainer>
      </div>
      <AntdButton className="mt-4" type="primary" onClick={saveContent}>
        Save
      </AntdButton>
    </div>
  );
};

export default TextEditor;