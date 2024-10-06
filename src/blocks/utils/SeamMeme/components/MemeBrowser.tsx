import { useState, useEffect } from "react";
import type { Meme } from "../types/types";

interface MemeBrowserProps {
	memes: Meme[];
	handleSetMeme: (meme: Meme) => void;
}

const MemeBrowser: React.FC<MemeBrowserProps> = ({ memes, handleSetMeme }) => {
	const [filteredMemes, setFilteredMemes] = useState<Meme[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");

	// Effect to filter memes based on search query
	useEffect(() => {
		const query = searchQuery.toLowerCase();
		const filtered = memes.filter((meme) => meme.name.toLowerCase().includes(query));
		setFilteredMemes(filtered);
	}, [searchQuery, memes]);

	return (
		<div className="flex flex-col h-full">
			{/* Search box */}
			<div className="flex flex-col justify-center">
				<div className="border-2 border-gray-200 w-full rounded-lg">
					<input
						placeholder='Search "memes"'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full h-full p-2 rounded-lg"
					/>
				</div>
			</div>
			{/* Browse Memes */}
			<p className="font-bold py-2 p-1">Browse Memes</p>
			{/* Memes */}
			<div className="py-2 w-full overflow-y-auto scrollbar-hide flex items-center justify-center">
				<div className="grid grid-cols-4 overflow-y-auto scrollbar-hide w-full">
					{filteredMemes.map((meme, index) => {
						return (
							<button
								key={index}
								className="h-24 w-full p-1 flex justify-center items-center"
								onClick={() => handleSetMeme(meme)}
							>
								<img
									src={meme.url}
									alt={`Image ${index}`}
									className="rounded-xl w-full h-full object-cover"
								/>
							</button>
						);
					})}
				</div>
			</div>
			{/* Spacer div */}
			<div className="h-24 w-full"></div>
		</div>
	);
};

export default MemeBrowser;
