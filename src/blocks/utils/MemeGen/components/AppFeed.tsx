import { AppFeedProps } from "../types/types";

const AppFeed = ({ model, update }: AppFeedProps) => {
	const editedMeme = model.data.editedMeme;
	return (
		<div>
			<div>
				<img src={editedMeme} />
			</div>
		</div>
	);
};

export default AppFeed;
