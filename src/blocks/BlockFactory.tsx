// import { ImagePuzzleFeedComponent, ImagePuzzleComposerComponent } from './ImagePuzzleBlock'
// import { LocalelocatrFeedComponent, LocalelocatrComposerComponent } from './LocalelocatrBlock'
// import { MapFeedComponent, MapComposerComponent } from './MapBlock'
// import { CameraFeedComponent, CameraComposerComponent } from './CameraBlock'
// import { CalligraphyFeedComponent, CalligraphyComposerComponent } from './CalligraphyBlock'
// import { MoodFeedComponent, MoodComposerComponent } from './MoodBlock'
import { BookshelfFeedComponent, BookshelfComposerComponent } from './BookshelfApp'
import { UnknownFeedComponent, UnknownComposerComponent } from './UnknownApp'
// import { EyesFeedComponent, EyesComposerComponent } from './EyesBlock'
// import { WhiteboardFeedComponent, WhiteboardComposerComponent } from './WhiteboardBlock'
// import { FcUserFeedComponent, FcUserComposerComponent } from './FcUserFeedBlock'
// import { TokenHoldingsFeedComponent, TokenHoldingsComposerComponent } from './TokenHoldingsBlock'
// import { NFTFeedComponent, NFTComposerComponent } from './NFTBlock'
// import { PhotoAlbumFeedComponent, PhotoAlbumComposerComponent } from './PhotoAlbumBlock'
// import { MarqueeFeedComponent, MarqueeComposerComponent } from './MarqueeBlock'
// import { PokemonFeedComponent, PokemonComposerComponent } from './PokemonBlock'
// import { NFTsFeedComponent, NFTsComposerComponent } from './NFTsBlock'
// import { PixelArtFeedComponent, PixelArtComposerComponent } from './PixelArtBlock'
// import { MusicFeedComponent, MusicComposerComponent } from './MusicBlock'
// import { IFrameFeedComponent, IFrameComposerComponent } from './IFrameBlock'
// import { TextEditFeedComponent, TextEditComposerComponent } from './TextEditBlock'
// import { LinkFeedComponent, LinkComposerComponent } from './LinkBlock'
// import { ImageFeedComponent, ImageComposerComponent } from './ImageBlock'
// import { TwitterFeedComponent, TwitterComposerComponent } from './TwitterBlock'
// import { TweetFeedComponent, TweetComposerComponent } from './TweetBlock'
// import { IFramelyFeedComponent, IFramelyComposerComponent } from './IFramelyBlock'
// import { EmptyFeedComponent, EmptyComposerComponent } from './EmptyBlock'
// import { ProfileFeedComponent, ProfileComposerComponent } from './ProfileBlock'
// import { GiphyFeedComponent, GiphyComposerComponent } from './GiphyBlock'
// import { FlashingTextFeedComponent, FlashingTextComposerComponent } from './FlashingTextBlock'
// import { CountdownFeedComponent, CountdownComposerComponent } from './CountdownBlock'
// import { LinkBookmarkFeedComponent, LinkBookmarkComposerComponent } from './LinkBookmarkBlock'
// import { VideoFeedComponent, VideoComposerComponent } from './VideoBlock'
// import { MondrianFeedComponent, MondrianComposerComponent } from './MondrianBlock'
// import { WordleFeedComponent, WordleComposerComponent } from './WordleBlock'
import { BlockModel, BlockTypes, ComposerComponentProps } from './types'

export default class BlockFactory {
  static getFeedComponent(model: BlockModel) {
    switch (model.type) {
      // case "iframe": return IFrameFeedComponent;
      // case "link": return LinkFeedComponent;
      // case "image": return ImageFeedComponent;
      // case "twitter": return TwitterFeedComponent;
      // case "text": return TextFeedComponent;
      // case "tweet": return TweetFeedComponent;
      // case "Link Bookmark": return LinkBookmarkFeedComponent;
      // case "Music": return MusicFeedComponent;
      // case "video": return VideoFeedComponent;
      // case "profile": return ProfileFeedComponent;
      // case "giphy": return GiphyFeedComponent;
      // case "PixelArt": return PixelArtFeedComponent;
      // case "NFTs": return NFTsFeedComponent;
      // case "Pokemon": return PokemonFeedComponent;
      // case "Marquee": return MarqueeFeedComponent;
      // case "PhotoAlbum": return PhotoAlbumFeedComponent;
      // case "FlashingText": return FlashingTextFeedComponent;
      // case "tokenHoldings": return tokenHoldingsFeedComponent;
      // case "NFT": return NFTFeedComponent;
      // case "countdown": return CountdownFeedComponent;
      // case "fcUserFeed": return fcUserFeedFeedComponent;
      // case "eyes": return eyesFeedComponent;
      // case "Mondrian": return MondrianFeedComponent;
      case "Bookshelf": return <BookshelfFeedComponent model={model} />;
      // case "Wordle": return WordleFeedComponent;
      // case "Mood": return MoodFeedComponent;
      // case "Whiteboard": return WhiteboardFeedComponent;
      // case "ImagePuzzle": return ImagePuzzleFeedComponent;
      // case "Camera": return CameraFeedComponent;
      // case "Map": return MapFeedComponent;
      // case "Calligraphy": return CalligraphyFeedComponent;
      // case "localelocatr": return localelocatrFeedComponent;
      // new feed components go here
      default: return UnknownFeedComponent({ model });
    }
  }

  static getComposerComponent({model, done}: ComposerComponentProps) {
    switch (model.type) {
      // case "iframe": return IFrameComposerComponent;
      // case "link": return LinkComposerComponent;
      // case "image": return ImageComposerComponent;
      // case "twitter": return TwitterComposerComponent;
      // case "text": return TextComposerComponent;
      // case "tweet": return TweetComposerComponent;
      // case "Link Bookmark": return LinkBookmarkComposerComponent;
      // case "Music": return MusicComposerComponent;
      // case "video": return VideoComposerComponent;
      // case "profile": return ProfileComposerComponent;
      // case "giphy": return GiphyComposerComponent;
      // case "PixelArt": return PixelArtComposerComponent;
      // case "NFTs": return NFTsComposerComponent;
      // case "Pokemon": return PokemonComposerComponent;
      // case "Marquee": return MarqueeComposerComponent;
      // case "PhotoAlbum": return PhotoAlbumComposerComponent;
      // case "FlashingText": return FlashingTextComposerComponent;
      // case "tokenHoldings": return tokenHoldingsComposerComponent;
      // case "NFT": return NFTComposerComponent;
      // case "countdown": return CountdownComposerComponent;
      // case "fcUserFeed": return fcUserFeedComposerComponent;
      // case "eyes": return eyesComposerComponent;
      // case "Mondrian": return MondrianComposerComponent;
      case "Bookshelf": return <BookshelfComposerComponent model={model} done={done} />;
      // case "Wordle": return WordleComposerComponent;
      // case "Mood": return MoodComposerComponent;
      // case "Whiteboard": return WhiteboardComposerComponent;
      // case "ImagePuzzle": return ImagePuzzleComposerComponent;
      // case "Camera": return CameraComposerComponent;
      // case "Map": return MapComposerComponent;
      // case "Calligraphy": return CalligraphyComposerComponent;
      // case "localelocatr": return localelocatrComposerComponent;
      // new composer components go here
      default: return <UnknownComposerComponent model={model} done={done} />;
    }
  }

  static getPrintableBlockName(model: BlockModel): string {
    let type = model?.type
    let blockType = BlockTypes[type]
    return blockType != undefined ? BlockTypes[type].displayName : "Unknown"
  }

  static doesBlockPost(model: BlockModel): boolean {
    let type = model.type
    return BlockTypes[type].doesBlockPost
  }

  static doesBlockEditFullscreen(type: string): boolean {
    return BlockTypes[type].fullscreenEdit
  }
}
