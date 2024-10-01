import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types';

export const SeamFeedComponent = ({ model, update }: FeedComponentProps) => {
  return <h1>Hi, I'm in the feed!</h1>;
}

export const SeamComposerComponent = ({ model, done }: ComposerComponentProps) => {
  return (
    <div>
      <h1>Hi, I'm in the composer!</h1>
      <button onClick={() => { done(model) }}> Post </button>
    </div>
  );
}