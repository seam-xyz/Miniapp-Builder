import { BlockModel, ComposerComponentProps, FeedComponentProps } from "./types";
import AppComposer from "./utils/SeamMeme/components/AppComposer";

export const SeamComposerComponent = ({ model, done }: ComposerComponentProps) => {
	return (
		<div className="h-full w-full">
			<AppComposer model={model} done={done} />
		</div>
	);
};

export const SeamFeedComponent = ({ model, update }: FeedComponentProps) => {
	return <h1>Hi, I'm in the feed!</h1>;
};
