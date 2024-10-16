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
	const editedMeme = model.data.editedMeme;

	return (
		<div>
				<img src={editedMeme} />
			</div>
	);
};

