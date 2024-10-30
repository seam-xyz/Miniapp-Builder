import { useState, useEffect } from "react";
import type { BrowserProps, Meme } from "../types/types";

const Browser = ({ memes, handleSetMeme }: BrowserProps) => {
  const [filteredMemes, setFilteredMemes] = useState<Meme[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Effect to filter memes based on search query
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = memes.filter((meme) => meme.name.toLowerCase().includes(query));
    setFilteredMemes(filtered);
  }, [searchQuery, memes]);

  return (
    <div className="flex flex-col h-full min-h-screen">
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
      <div className="flex-grow w-full overflow-y-auto px-2">
        <div className="grid grid-cols-4 md:grid-cols-4 gap-1">
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

export default Browser;
