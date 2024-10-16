import { BlockModel, ComposerComponentProps, FeedComponentProps } from "./types";
import AppComposer from "./utils/MemeGen/components/AppComposer";
import AppFeed from "./utils/MemeGen/components/AppFeed";

export const MemeGenComposerComponent = ({ model, done }: ComposerComponentProps) => {
	return (
		<div className="h-full w-full">
			<AppComposer model={model} done={done} />
		</div>
	);
};

export const MemeGenFeedComponent = ({ model, update }: FeedComponentProps) => {
	return (
		<div>
			<AppFeed model={model} update={update} />
		</div>
	);
};
