import feelingsBlock from './feelingsBlock'
import NFTsBlock from './NFTsBlock'
import RefreshingGIFBlock from './RefreshingGIFBlock'
import PixelArtBlock from './PixelArtBlock'
import Block from './Block'
import { Theme } from "@mui/material"
import { BlockModel, BlockTypes } from './types'
import IFrameBlock from './IFrameBlock'
import TextEditBlock from './TextEditBlock'
import LinkBlock from './LinkBlock'
import ImageBlock from './ImageBlock'
import TwitterBlock from './TwitterBlock'
import TweetBlock from './TweetBlock'
import IFramelyBlock from './IFramelyBlock'
import EmptyBlock from './EmptyBlock'
import ProfileBlock from './ProfileBlock'
import GiphyBlock from './GiphyBlock'

export default class BlockFactory {
  static getBlock(model: BlockModel, theme: Theme): Block {
    switch (model.type) {
      case "iframe": return new IFrameBlock(model, theme)
      case "link": return new LinkBlock(model, theme)
      case "image": return new ImageBlock(model, theme)
      case "twitter": return new TwitterBlock(model, theme)
      case "text": return new TextEditBlock(model, theme)
      case "tweet": return new TweetBlock(model, theme)
      case "Map": return new IFramelyBlock(model, theme)
      case "Music": return new IFramelyBlock(model, theme)
      case "video": return new IFramelyBlock(model, theme)
      case "profile": return new ProfileBlock(model, theme)
      case "giphy": return new GiphyBlock(model, theme)
      case "RefreshingGIF": return new RefreshingGIFBlock(model, theme)
      case "PixelArt": return new PixelArtBlock(model, theme)
      case "NFTs": return new NFTsBlock(model, theme)
      case "feelings": return new feelingsBlock(model, theme)
      // new blocks go here
      default: return new IFrameBlock(model, theme)
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
        console.log("pooped")
        onClick(model.uuid)
      }} />
    );
  }
}
