import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types'
import BlockFactory from './BlockFactory';
import { loadLocalFont } from './utils/Fonts';
import './BlockStyles.css'
import { useEffect, useState } from 'react';

const ThoughtPreview: React.FC<{ content: string }> = ({ content }) => {
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);
  useEffect(() => {
    loadLocalFont('Seam Community Font', 'blocks/assets/common/SeamCommunityFont-Regular.ttf', 'fantasy')
    setFontLoaded(true);
  }, []);
  return (
    <p style={fontLoaded ? { fontFamily: 'Seam Community Font, fantasy', color: 'purple', fontSize: "20px" } : {}}>{content}</p>
  )
}

export const JustAThoughtFeedComponent = ({ model }: FeedComponentProps) => {
  return <ThoughtPreview content={model.data.content} />;
}

export const JustAThoughtComposerComponent = ({ model, done }: ComposerComponentProps) => {
  return (
    <div>
      <ThoughtPreview content={model.data.content} />
      <button onClick={() => { done(model) }}> Post </button>
    </div>
  );
}
