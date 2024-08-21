import { WardrobeFeedComponent, WardrobeComposerComponent } from './WardrobeApp'
import { JournalFeedComponent, JournalComposerComponent } from './JournalApp'
import { HaikuraFeedComponent, HaikuraComposerComponent } from './HaikuraApp'
import { TatergangsFeedComponent, TatergangsComposerComponent } from './TatergangsApp'
import { HoroscopeFeedComponent, HoroscopeComposerComponent } from './HoroscopeApp'
import { DizzyFeedComponent, DizzyComposerComponent } from './DizzyApp'
import { JustAThoughtFeedComponent, JustAThoughtComposerComponent } from './JustAThoughtApp'
import { VibecheckFeedComponent, VibecheckComposerComponent } from './VibecheckApp'
import { MagicCardFeedComponent, MagicCardComposerComponent } from './MagicCardApp'
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
  static getFeedComponent(model: BlockModel, update: ((data: { [key: string]: string; }) => void)) {
    switch (model.type) {
      case "iframe": return <IFrameFeedComponent model={model} update={update}/>;
      case "link": return <LinkFeedComponent model={model}update={update}/>;
      case "image": return <ImageFeedComponent model={model} update={update}/>;
      case "twitter": return <TwitterFeedComponent model={model} update={update}/>;
      case "text": return <TextEditFeedComponent model={model} update={update}/>;
      case "tweet": return <TweetFeedComponent model={model} update={update}/>;
      case "Link Bookmark": return <LinkBookmarkFeedComponent model={model} update={update}/>;
      case "Music": return <MusicFeedComponent model={model} update={update}/>;
      case "video": return <VideoFeedComponent model={model} update={update}/>;
      case "profile": return <ProfileFeedComponent model={model} update={update}/>;
      case "giphy": return <GiphyFeedComponent model={model} update={update}/>;
      case "PixelArt": return <PixelArtFeedComponent model={model} update={update}/>;
      case "NFTs": return <NFTsFeedComponent model={model} update={update}/>;
      case "Pokemon": return <PokemonFeedComponent model={model} update={update}/>;
      case "Marquee": return <MarqueeFeedComponent model={model} update={update}/>;
      case "PhotoAlbum": return <PhotoAlbumFeedComponent model={model} update={update}/>;
      case "FlashingText": return <FlashingTextFeedComponent model={model} update={update}/>;
      case "tokenHoldings": return <TokenHoldingsFeedComponent model={model} update={update}/>;
      case "NFT": return <NFTFeedComponent model={model} update={update}/>;
      case "countdown": return <CountdownFeedComponent model={model} update={update}/>;
      case "fcUserFeed": return <FcUserFeedComponent model={model} update={update}/>;
      case "eyes": return <EyesFeedComponent model={model} update={update}/>;
      case "Mondrian": return <MondrianFeedComponent model={model} update={update}/>;
      case "Bookshelf": return <BookshelfFeedComponent model={model} update={update}/>;
      case "Wordle": return <WordleFeedComponent model={model} update={update}/>;
      case "Mood": return <MoodFeedComponent model={model} update={update}/>;
      case "Whiteboard": return <WhiteboardFeedComponent model={model} update={update}/>;
      case "ImagePuzzle": return <ImagePuzzleFeedComponent model={model} update={update}/>;
      case "Camera": return <CameraFeedComponent model={model} update={update} />;
      case "Map": return <MapFeedComponent model={model} update={update}/>;
      case "Calligraphy": return <CalligraphyFeedComponent model={model} update={update} />;
      case "localelocatr": return <LocalelocatrFeedComponent model={model} update={update}/>;
      case "Tatergangs": return <TatergangsFeedComponent model={model} update={update}/>;
      case "Voice": return <VoiceFeedComponent model={model} update={update}/>;
      case "Vibecheck": return <VibecheckFeedComponent model={model} update={update}/>;
      case "JustAThought": return <JustAThoughtFeedComponent model={model} update={update}/>;
      case "Dizzy": return <DizzyFeedComponent model={model} update={update}/>;
      case "Horoscope": return <HoroscopeFeedComponent model={model} update={update}/>;
      case "MagicCard": return <MagicCardFeedComponent model={model} update={update}/>;
      case "Wardrobe": return <WardrobeFeedComponent model={model} update={update}/>;
      case "Haikura": return <HaikuraFeedComponent model={model} update={update}/>;
      case "Journal": return <JournalFeedComponent model={model} update={update}/>;
      // new feed components go here
      default: return UnknownFeedComponent({ model, update });
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
      case "Tatergangs": return TatergangsComposerComponent(props);
      case "JustAThought": return JustAThoughtComposerComponent(props);
      case "Voice": return VoiceComposerComponent(props);
      case "Vibecheck": return VibecheckComposerComponent(props);
      case "Wardrobe": return WardrobeComposerComponent(props);
      case "Journal": return JournalComposerComponent(props);
      case "Haikura": return HaikuraComposerComponent(props);
      case "MagicCard": return MagicCardComposerComponent(props);
      case "Horoscope": return HoroscopeComposerComponent(props);
      case "Dizzy": return DizzyComposerComponent(props);
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
