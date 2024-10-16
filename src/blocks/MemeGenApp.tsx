import { BlockModel, ComposerComponentProps, FeedComponentProps } from "./types";
import AppComposer from "./utils/MemeGen/components/AppComposer";

export const MemeGenComposerComponent = ({ model, done }: ComposerComponentProps) => {
	return (
		<div className="h-full w-full">
			<AppComposer model={model} done={done} />
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

