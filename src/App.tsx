import { useState } from "react";
import Composer from "./Composer";
import Feed from "./Feed";
import { BlockModel } from "./blocks/types";

export default function App() {
  const [loadedPosts, setLoadedPosts] = useState<BlockModel[]>([]);
  // Add your custom block here!
  // vvvvvvvvvvvvvvvvv

  let yourBlock: BlockModel = {
    type: "Marquee",
    data: {},
    uuid: "test"
  }

  // End customization
  // ^^^^^^^^^^^^^^^^^

  function addNewPost(newPost: BlockModel) {
    setLoadedPosts((prevPosts: BlockModel[]) => [newPost, ...prevPosts]);
  }

  return (
    <div className="flex flex-row justify-between w-full h-full">
      <div className="left-0 w-[33%] h-[100%] bg-white flex flex-col items-center border-r-2 border-black/[5%]">
        <Composer addNewPost={addNewPost}/>
      </div>
      <div className="flex justify-center items-center w-full h-full">
        <Feed loadedPosts={loadedPosts} />
      </div>
      <div className="w-[33%] bg-white flex-none border-l-2 border-seam-black/[5%]"></div>
    </div>
  );
}