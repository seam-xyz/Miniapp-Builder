import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types'
import { loadLocalFont } from './utils/Fonts';
import './BlockStyles.css'
import { useEffect, useState } from 'react';
import SeamSaveButton from '../components/SeamSaveButton';

const seamFontStyle = (textColor: string, bgColor: string) => {
  return { fontFamily: 'Seam Community Font, fantasy', color: textColor, backgroundColor: bgColor, fontSize: "1.8rem" }
};

const ThoughtPreview: React.FC<{ content: string, textColor: string, bgColor: string }> = ({ content, textColor, bgColor }) => {
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);
  useEffect(() => {
    loadLocalFont('Seam Community Font', 'blocks/assets/common/SeamCommunityFont-Regular.ttf', 'fantasy')
    setFontLoaded(true);
  }, []);
  return (
    <div className="whitespace-pre items-center" style={fontLoaded ? seamFontStyle(textColor, bgColor) : {}}>{content}</div>
  )
}

interface ThoughtEditorProps {
  model: BlockModel;
  done: (data: BlockModel) => void;
}

const ThoughtEditor: React.FC<ThoughtEditorProps> = ({ model, done }) => {
  const [thought, setThought] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);
  useEffect(() => {
    loadLocalFont('Seam Community Font', 'blocks/assets/common/SeamCommunityFont-Regular.ttf', 'fantasy')
    setFontLoaded(true);
  }, []);

  const handleSubmit = () => {
    done({
      ...model,
      data: {
        thought,
        bgColor,
        textColor
      }
    });
  };

  return (
    <>
      <h2 className="text-xl mb-4">Just A Thought</h2>
      <textarea
        style={(fontLoaded && thought) ? seamFontStyle(textColor, bgColor) : {}}
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        maxLength={120}
        className="w-full p-2 mb-4 border rounded"
        placeholder="Enter your thought (max 120 characters)"
        rows={5}
      />
      <div className="grid grid-cols-2 mb-4">
        <div className="mb-4">
          <label className="block mb-2">Background Color:</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Text Color:</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      <SeamSaveButton onClick={handleSubmit} />
      <div className="pt-4">font credit goes to <a href="https://seam.so/post/IGcc1GIwtM">@mrlando</a></div>
      <div className="pt-4">p.s. want to help me make this miniapp prettier? hmu <a href="https://seam.so/user/emilee">@emilee</a></div>
    </>
  )
}

export const JustAThoughtFeedComponent = ({ model }: FeedComponentProps) => {
  const { bgColor, textColor, thought } = model.data;
    return (
      <div className="inline-block">
        <ThoughtPreview content={thought} bgColor={bgColor} textColor={textColor} />
      </div>
    );
}

export const JustAThoughtComposerComponent = ({ model, done }: ComposerComponentProps) => {
  return (
    <div>
      <ThoughtEditor model={model} done={done} />
    </div>
  );
}
