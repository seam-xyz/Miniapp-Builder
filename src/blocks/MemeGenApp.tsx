import { BlockModel, ComposerComponentProps, FeedComponentProps } from "./types";
import MemeGenAppComposer from "./utils/MemeGen/components/MemeGenAppComposer";

export const MemeGenComposerComponent = ({ model, done }: ComposerComponentProps) => {
  return (
    <div className="h-full w-full">
      <MemeGenAppComposer model={model} done={done} />
    </div>
  );
};

export const MemeGenFeedComponent = ({ model, update }: FeedComponentProps) => {
	const editedMeme = model.data["dataURL"];

  return (
    <div className="w-full h-full flex items-center justify-center">
      <img className="w-full h-full object-cover" src={editedMeme} />
    </div>
  );
};

