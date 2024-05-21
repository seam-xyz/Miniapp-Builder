import React from 'react';
import ComposerMiniAppPhoto from './ComposerMiniAppPhoto'; // Update the path if necessary

function ComposerMiniAppItem({ block, tapAction }) {
  return (
    <div className="flex flex-row items-start w-full truncate" onClick={tapAction}>
      <ComposerMiniAppPhoto block={block} size={60} />
      <div className="flex flex-col justify-between items-start ml-4 truncate h-[60px] w-full">
        <div className="w-full h-full">
          <h3 className="align-top">{block.displayName}</h3>
          <h4 className="text-[#86868A] truncate overflow-ellipsis whitespace-nowrap w-auto">{block.displayDescription}</h4>
        </div>
        <h4 className="mt-2 mb-2 text-gray">
          Created by: <span className="text-black">{"@" + block.createdBy}</span>
        </h4>
      </div>
    </div>
  );
}

export default ComposerMiniAppItem;
