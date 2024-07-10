import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types'
import BlockFactory from './BlockFactory';
import { loadLocalFont } from './utils/Fonts';
import './BlockStyles.css'
import { useEffect, useState } from 'react';

const ThoughtPreview: React.FC<{ content: string, textColor: string, bgColor: string }> = ({ content, textColor, bgColor }) => {
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);
  useEffect(() => {
    loadLocalFont('Seam Community Font', 'blocks/assets/common/SeamCommunityFont-Regular.ttf', 'fantasy')
    setFontLoaded(true);
  }, []);
  return (
    <p style={fontLoaded ? { fontFamily: 'Seam Community Font, fantasy', color: textColor, backgroundColor: bgColor, fontSize: "20px" } : {}}>{content}</p>
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
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        maxLength={120}
        className="w-full p-2 mb-4 border rounded"
        placeholder="Enter your thought (max 120 characters)"
      />
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
      <div className="mb-4">
        <p>Preview:<br/></p>
        <div className="inline-block">
          <ThoughtPreview content={thought} textColor={textColor} bgColor={bgColor} />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Post Thought
      </button>
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
