import { Editor, EditorState, convertFromRaw } from 'draft-js';
import TextEditor from './TextEditor/TextEditor';
import './TextEditor/TextEditorStyles.css';
import BlockFactory from './BlockFactory';
import { linkDecorator } from "./TextEditor/Link";
import { ComposerComponentProps, FeedComponentProps } from './types';

export const TextEditFeedComponent = ({ model }: FeedComponentProps) => {
  let textState = model.data["textState"];
  if (textState === undefined) {
    return <h1>Error: Couldn't figure out the text</h1>;
  }

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

  const onEditorStateChange = (editorState: EditorState) => {};

  return (
    <Editor
      editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(textState)), linkDecorator)}
      blockStyleFn={blockStyleFn}
      onChange={onEditorStateChange}
      readOnly={true}
    />
  );
}

export const TextEditComposerComponent = ({ model, done }: ComposerComponentProps) => {
  let textState = model.data["textState"];
  return (
    <div className="text-center flex items-start justify-center h-full w-full" id={model.uuid}>
      <TextEditor
        data={textState}
        done={(data: string): void => {
          model.data["textState"] = data;
          done(model);
        }}
      />
    </div>
  );
}