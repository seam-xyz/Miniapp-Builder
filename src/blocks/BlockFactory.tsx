import Block from './Block'
import { BlockModel, BlockTypes } from './types'
import IFrameBlock from './IFrameBlock'
// import TextEditBlock from './TextEditBlock'
import LinkBlock from './LinkBlock'
// import ImageBlock from './ImageBlock'
// import TwitterBlock from './Twitter'
// import ImageButton from './ImageButton'
// import TweetBlock from './Tweet'
// import BookmarkBlock from './BookmarkBlock'
import EmptyBlock from './EmptyBlock'
// import ProfileBlock from './ProfileBlock'
// import GiphyBlock from './GiphyBlock'
// import InstagramBlock from './InstagramBlock'

export default class BlockFactory {
  static getBlock(model: BlockModel): Block {
    switch (model.type) {
       case "iframe": return new IFrameBlock(model)
       case "link": return new LinkBlock(model)
    //   case "image": return new ImageBlock(model)
    //   case "twitter": return new TwitterBlock(model)
    //   case "text": return new TextEditBlock(model)
    //   case "Image Button": return new ImageButton(model)
    //   case "tweet": return new TweetBlock(model)
    //   case "Link Bookmark": return new BookmarkBlock(model)
    //   case "Map": return new BookmarkBlock(model)
    //   case "Music": return new BookmarkBlock(model)
    //   case "video": return new BookmarkBlock(model)
    //   case "profile": return new ProfileBlock(model)
    //   case "giphy": return new GiphyBlock(model)
    //   case "instagram": return new InstagramBlock(model)
      default: return new IFrameBlock(model)
    }
  }

  static getBlockNames() {
    return Object.keys(BlockTypes)
  }

  static getPrintableBlockName(model: BlockModel): string {
    let type = model.type
    return BlockTypes[type].displayName
  }

  static renderEmptyState(model: BlockModel, onClick: (id: string) => void): React.ReactNode {
    return (
      <EmptyBlock title={BlockFactory.getPrintableBlockName(model)} onClick={() => {
        onClick(model.uuid)
      }}/>
    );
  }
}