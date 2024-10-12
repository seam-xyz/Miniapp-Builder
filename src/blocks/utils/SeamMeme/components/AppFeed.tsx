import { BlockModel } from "../../../types";

interface AppFeedProps {
	model: BlockModel;
	update: (data: { [key: string]: string }) => void;
}

const AppFeed = ({ model, update }: AppFeedProps) => {
	// const caption = model.data.caption;
	const editedMeme = model.data.editedMeme;
	return (
		<div>
			{/* <div>{caption}</div> */}
			<div>
				<img src={editedMeme} />
			</div>
		</div>
	);
};

export default AppFeed;
