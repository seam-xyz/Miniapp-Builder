import { ColorFeedComponent, ColorComposerComponent } from './ColorApp'
import { VibecheckFeedComponent, VibecheckComposerComponent } from './VibecheckApp'
import { ImagePuzzleFeedComponent, ImagePuzzleComposerComponent } from './ImagePuzzleBlock'
import { LocalelocatrFeedComponent, LocalelocatrComposerComponent } from './localelocatrBlock'
import { MapFeedComponent, MapComposerComponent } from './MapApp'
import { CameraFeedComponent, CameraComposerComponent } from './CameraApp'
import { CalligraphyFeedComponent, CalligraphyComposerComponent } from './CalligraphyApp'
import { MoodFeedComponent, MoodComposerComponent } from './MoodApp'
import { BookshelfFeedComponent, BookshelfComposerComponent } from './BookshelfApp'
import { UnknownFeedComponent, UnknownComposerComponent } from './UnknownApp'
import { EyesFeedComponent, EyesComposerComponent } from './eyesBlock'
import { WhiteboardFeedComponent, WhiteboardComposerComponent } from './WhiteboardBlock'
import { FcUserFeedComponent, FcUserComposerComponent } from './fcUserFeedBlock'
import { TokenHoldingsFeedComponent, TokenHoldingsComposerComponent } from './tokenHoldingsBlock'
import { NFTFeedComponent, NFTComposerComponent } from './NFTBlock'
import { PhotoAlbumFeedComponent, PhotoAlbumComposerComponent } from './PhotoAlbumBlock'
import { MarqueeFeedComponent, MarqueeComposerComponent } from './MarqueeBlock'
import { PokemonFeedComponent, PokemonComposerComponent } from './PokemonBlock'
import { NFTsFeedComponent, NFTsComposerComponent } from './NFTsBlock'
import { PixelArtFeedComponent, PixelArtComposerComponent } from './PixelArtBlock'
import { MusicFeedComponent, MusicComposerComponent } from './MusicBlock'
import { IFrameFeedComponent, IFrameComposerComponent } from './IFrameBlock'
import { TextEditFeedComponent, TextEditComposerComponent } from './TextEditBlock'
import { LinkFeedComponent, LinkComposerComponent } from './LinkBlock'
import { ImageFeedComponent, ImageComposerComponent } from './ImageBlock'
import { TwitterFeedComponent, TwitterComposerComponent } from './TwitterBlock'
import { TweetFeedComponent, TweetComposerComponent } from './TweetBlock'
import { ProfileFeedComponent, ProfileComposerComponent } from './ProfileBlock'
import { GiphyFeedComponent, GiphyComposerComponent } from './GiphyBlock'
import { FlashingTextFeedComponent, FlashingTextComposerComponent } from './FlashingTextBlock'
import { CountdownFeedComponent, CountdownComposerComponent } from './CountdownBlock'
import { LinkBookmarkFeedComponent, LinkBookmarkComposerComponent } from './LinkBookmarkBlock'
import { VideoFeedComponent, VideoComposerComponent } from './VideoBlock'
import { MondrianFeedComponent, MondrianComposerComponent } from './MondrianBlock'
import { WordleFeedComponent, WordleComposerComponent } from './WordleBlock'
import { VoiceFeedComponent, VoiceComposerComponent } from './VoiceApp'
import { BlockModel, BlockTypes, ComposerComponentProps } from './types'

export default class BlockFactory {
  static getFeedComponent(model: BlockModel) {
    switch (model.type) {
      case "iframe": return <IFrameFeedComponent model={model} />;
      case "link": return <LinkFeedComponent model={model} />;
      case "image": return <ImageFeedComponent model={model} />;
      case "twitter": return <TwitterFeedComponent model={model} />;
      case "text": return <TextEditFeedComponent model={model} />;
      case "tweet": return <TweetFeedComponent model={model} />;
      case "Link Bookmark": return <LinkBookmarkFeedComponent model={model} />;
      case "Music": return <MusicFeedComponent model={model} />;
      case "video": return <VideoFeedComponent model={model} />;
      case "profile": return <ProfileFeedComponent model={model} />;
      case "giphy": return <GiphyFeedComponent model={model} />;
      case "PixelArt": return <PixelArtFeedComponent model={model} />;
      case "NFTs": return <NFTsFeedComponent model={model} />;
      case "Pokemon": return <PokemonFeedComponent model={model} />;
      case "Marquee": return <MarqueeFeedComponent model={model} />;
      case "PhotoAlbum": return <PhotoAlbumFeedComponent model={model} />;
      case "FlashingText": return <FlashingTextFeedComponent model={model} />;
      case "tokenHoldings": return <TokenHoldingsFeedComponent model={model} />;
      case "NFT": return <NFTFeedComponent model={model} />;
      case "countdown": return <CountdownFeedComponent model={model} />;
      case "fcUserFeed": return <FcUserFeedComponent model={model} />;
      case "eyes": return <EyesFeedComponent model={model} />;
      case "Mondrian": return <MondrianFeedComponent model={model} />;
      case "Bookshelf": return <BookshelfFeedComponent model={model} />;
      case "Wordle": return <WordleFeedComponent model={model} />;
      case "Mood": return <MoodFeedComponent model={model} />;
      case "Whiteboard": return <WhiteboardFeedComponent model={model} />;
      case "ImagePuzzle": return <ImagePuzzleFeedComponent model={model} />;
      case "Camera": return <CameraFeedComponent model={model} />;
      case "Map": return <MapFeedComponent model={model} />;
      case "Calligraphy": return <CalligraphyFeedComponent model={model} />;
      case "localelocatr": return <LocalelocatrFeedComponent model={model} />;
      case "Voice": return <VoiceFeedComponent model={model} />;
      case "Vibecheck": return <VibecheckFeedComponent model={model} />;
      case "Color": return <ColorFeedComponent model={model} />;
      // new feed components go here
      default: return UnknownFeedComponent({ model });
    }
  }

  static getComposerComponent(props: ComposerComponentProps) {
    const { model } = props;
    switch (model.type) {
      case "iframe": return IFrameComposerComponent(props);
      case "link": return LinkComposerComponent(props);
      case "image": return ImageComposerComponent(props);
      case "twitter": return TwitterComposerComponent(props);
      case "text": return TextEditComposerComponent(props);
      case "tweet": return TweetComposerComponent(props);
      case "Link Bookmark": return LinkBookmarkComposerComponent(props);
      case "Music": return MusicComposerComponent(props);
      case "video": return VideoComposerComponent(props);
      case "profile": return ProfileComposerComponent(props);
      case "giphy": return GiphyComposerComponent(props);
      case "PixelArt": return PixelArtComposerComponent(props);
      case "NFTs": return NFTsComposerComponent(props);
      case "Pokemon": return PokemonComposerComponent(props);
      case "Marquee": return MarqueeComposerComponent(props);
      case "PhotoAlbum": return PhotoAlbumComposerComponent(props);
      case "FlashingText": return FlashingTextComposerComponent(props);
      case "tokenHoldings": return TokenHoldingsComposerComponent(props);
      case "NFT": return NFTComposerComponent(props);
      case "countdown": return CountdownComposerComponent(props);
      case "fcUserFeed": return FcUserComposerComponent(props);
      case "eyes": return EyesComposerComponent(props);
      case "Mondrian": return MondrianComposerComponent(props);
      case "Bookshelf": return BookshelfComposerComponent(props);
      case "Wordle": return WordleComposerComponent(props);
      case "Mood": return MoodComposerComponent(props);
      case "Whiteboard": return WhiteboardComposerComponent(props);
      case "ImagePuzzle": return ImagePuzzleComposerComponent(props);
      case "Camera": return CameraComposerComponent(props);
      case "Map": return MapComposerComponent(props);
      case "Calligraphy": return CalligraphyComposerComponent(props);
      case "localelocatr": return LocalelocatrComposerComponent(props);
      case "Voice": return VoiceComposerComponent(props);
      case "Vibecheck": return VibecheckComposerComponent(props);
      case "Color": return ColorComposerComponent(props);
      // new composer components go here
      default: return UnknownComposerComponent(props);
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
