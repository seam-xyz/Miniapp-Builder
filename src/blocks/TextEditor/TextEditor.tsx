// Thanks to https://codesandbox.io/s/44ln1

import React from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  AtomicBlockUtils,
  DraftEditorCommand,
  convertToRaw,
  convertFromRaw,
  Modifier
} from "draft-js";
import "draft-js/dist/Draft.css";
import "./TextEditorStyles.css";
import '../BlockStyles.css'
import { linkDecorator } from "./Link";
import { Button, Card } from "antd";
import bold from "./images/bold.svg"
import italic from "./images/italic.svg"
import underline from "./images/underline.svg"
import strikethrough from "./images/strikethrough.svg"
import ordered from "./images/ordered.svg"
import unordered from "./images/unordered.svg"
import link from "./images/link.svg"
import { AlignCenterOutlined, AlignRightOutlined, AlignLeftOutlined } from '@ant-design/icons';

interface TextEditorProps {
  data: string | null,
  done: (data: string) => void
}

const TextEditor: React.FC<TextEditorProps> = (props) => {
  const propsd = props as TextEditorProps
  const initialState = propsd.data
    ? EditorState.createWithContent(convertFromRaw(JSON.parse(propsd.data)), linkDecorator)
    : EditorState.createEmpty(linkDecorator);
  const [editorState, setEditorState] = React.useState<EditorState>(initialState);

  const handleSave = () => {
    const data = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    propsd.done(data)
  };

  const handleInsertImage = () => {
    const src = prompt("Please enter the URL of your picture");
    if (!src) {
      return;
    }
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity("image", "IMMUTABLE", { src });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });
    return setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "));
  };

  const handleAddLink = () => {
    // Thanks to https://github.com/facebook/draft-js/blob/main/examples/draft-0-10-0/link/link.html
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
    const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

    let url = '';
    if (linkKey) {
      const linkInstance = contentState.getEntity(linkKey);
      url = linkInstance.getData().url;
    }
    let link = prompt("Please enter the URL of your link", url);
    if (!link) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
      return;
    }
    link = (link.indexOf(':') === -1) ? 'http://' + link : link;
    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity("LINK", "MUTABLE", {
      url: link
    });
    const newEditorState = EditorState.push(editorState, contentWithEntity, "apply-entity");
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    setEditorState(RichUtils.toggleLink(newEditorState, selection, entityKey));
  };

  // thanks to https://medium.com/@ibraheems.ali95/text-alignment-in-draftjs-and-using-with-statetohtml-caecd0138251
  const alignmentStyles = ['left', 'right', 'center'];
  const applyAlignment = (newStyle: string) => {
    let styleForRemove = alignmentStyles.filter(style => style !== newStyle);
    let currentContent = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    let focusBlock = currentContent.getBlockForKey(selection.getFocusKey());
    let anchorBlock = currentContent.getBlockForKey(selection.getAnchorKey());
    let isBackward = selection.getIsBackward();

    let selectionMerge = {
      anchorOffset: 0,
      focusOffset: focusBlock.getLength(),
    };

    if (isBackward) {
      selectionMerge.anchorOffset = anchorBlock.getLength();
    }
    let finalSelection = selection.merge(selectionMerge);
    let finalContent = styleForRemove.reduce((content, style) => Modifier.removeInlineStyle(content, finalSelection, style), currentContent);
    let modifiedContent = Modifier.applyInlineStyle(finalContent, finalSelection, newStyle);
    const nextEditorState = EditorState.push(editorState, modifiedContent, 'change-inline-style');
    setEditorState(nextEditorState);
  };

  const blockStyleFn = (block: any) => {
    let alignment = 'left';
    block.findStyleRanges((e: any) => {
      if (e.hasStyle('center')) {
        alignment = 'center';
      }
      if (e.hasStyle('right')) {
        alignment = 'right';
      }
    });
    return `editor-alignment-${alignment}`;
  };

  const handleKeyCommand = (command: DraftEditorCommand) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleTogggleClick = (e: React.MouseEvent, inlineStyle: string) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const handleBlockClick = (e: React.MouseEvent, blockType: string) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState);
  };

  return (
    <div className="texteditor">
      <Editor
        editorState={editorState}
        onChange={onEditorStateChange}
        handleKeyCommand={handleKeyCommand}
        blockStyleFn={blockStyleFn}
        spellCheck={true}
      />
      <Card className="editorBar">
        <button onMouseDown={(e) => handleBlockClick(e, "header-one")}>H1</button>
        <button onMouseDown={(e) => handleBlockClick(e, "header-two")}>H2</button>
        <button onMouseDown={(e) => handleBlockClick(e, "header-four")}>H3</button>
        <button onMouseDown={(e) => handleBlockClick(e, "unstyled")}>P</button>
        <button onMouseDown={(e) => handleTogggleClick(e, "BOLD")}><img src={bold} /></button>
        <button onMouseDown={(e) => handleTogggleClick(e, "UNDERLINE")}><img src={underline} /></button>
        <button onMouseDown={(e) => handleTogggleClick(e, "ITALIC")}><img src={italic} /></button>
        <button onMouseDown={(e) => handleTogggleClick(e, "STRIKETHROUGH")}><img src={strikethrough} /></button>
        <button onMouseDown={(e) => handleBlockClick(e, "ordered-list-item")}><img src={ordered} /></button>
        <button onMouseDown={(e) => handleBlockClick(e, "unordered-list-item")}><img src={unordered} /></button>
        <button onMouseDown={(e) => applyAlignment('left')}><AlignLeftOutlined /></button>
        <button onMouseDown={(e) => applyAlignment('center')}> <AlignCenterOutlined /></button>
        <button onMouseDown={(e) => applyAlignment('right')}><AlignRightOutlined /></button>
        <button
          disabled={editorState.getSelection().isCollapsed()}
          onMouseDown={(e) => {
            e.preventDefault();
            handleAddLink();
          }}>
          <img src={link} />
        </button>
      </Card>
      <Button className="save-modal-button" type="primary"
        onClick={(e) => {
          e.preventDefault();
          handleSave();
        }}>
        Save
      </Button>
    </div>
  );
};

export default TextEditor;