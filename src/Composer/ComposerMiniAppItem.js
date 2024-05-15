import ComposerMiniAppPhoto from './ComposerMiniAppPhoto';

function ComposerMiniAppItem({ block, tapAction }) {
  return (
    <div className="flex flex-row items-start pb-4 pt-4" onClick={() => { tapAction() }}>
      <ComposerMiniAppPhoto block={block} size={60} />
      <div className="flex flex-col justify-center items-start">
        <h3 className='align-top'>{block.displayName}</h3>
        <h4 className="text-[#86868A]">{block.displayDescription}</h4>
        <h4 className="mt-2 mb-2 text-gray pt-2">
          Created by: <span className="text-black">{"@" + block.createdBy}</span>
        </h4>
      </div>
    </div>
  )
}

export default ComposerMiniAppItem;
