import { BlockModel, ComposerComponentProps, FeedComponentProps } from "./types";
import AppComposer from "./utils/SeamMeme/components/AppComposer";
import AppFeed from "./utils/SeamMeme/components/AppFeed";

export const SeamComposerComponent = ({ model, done }: ComposerComponentProps) => {
	return (
		<div className="h-full w-full">
			<AppComposer model={model} done={done} />
		</div>
	);
};

export const SeamFeedComponent = ({ model, update }: FeedComponentProps) => {
	return (
		<div>
			<AppFeed model={model} update={update} />
		</div>
	);
};
