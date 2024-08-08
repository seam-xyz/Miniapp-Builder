import textIcon from "./blockIcons/Text.png";
import websiteIcon from "./blockIcons/websiteIcon.png";
import videoIcon from "./blockIcons/Video.png";
import imageIcon from "./blockIcons/Image.png";
import linkIcon from "./blockIcons/Button.png";
import twitterIcon from "./blockIcons/twitterIcon.png";
import bookmarkIcon from "./blockIcons/Link.png";
import mapIcon from "./blockIcons/Map.png";
import giphyIcon from "./blockIcons/GIPHY.png";
import profileIcon from "./blockIcons/profileHeaderIcon.png";
import musicIcon from "./blockIcons/Music.png";
import pixelArtIcon from "./blockIcons/pixelArtIcon.png";
import nftIcon from "./blockIcons/nftIcon.png"
import pokemonIcon from "./blockIcons/pokeball.png"
import marqueeIcon from "./blockIcons/marqueeIcon.png"
import photoAlbumIcon from "./blockIcons/photoAlbumIcon.png"
import flashingTextIcon from "./blockIcons/flashingTextIcon.png";
import tokenIcon from "./blockIcons/tokenIcon.png";
import clockIcon from "./blockIcons/clockIcon.png"
import farcasterIcon from "./blockIcons/farcasterIcon.svg"
import eyesIcon from "./blockIcons/eyeIcon.png"
import MondrianIcon from './blockIcons/MondrianIcon.png'
import bookIcon from './blockIcons/bookIcon.png'
import WordleIcon from './blockIcons/WordleIcon.png'
import MoodIcon from './blockIcons/MoodIcon.png'
import WhiteboardIcon from './blockIcons/whiteboardIcon.png'
import ImagePuzzleIcon from './blockIcons/imagePuzzleIcon.webp'
import CameraIcon from './blockIcons/CameraIcon.png'
import voiceNoteIcon from './blockIcons/voiceNoteIcon.png'
import CalligraphyIcon from "./blockIcons/calligraphyIcon.png"
import localelocatrIcon from "./blockIcons/localelocatrIcon.png";
import LayeredImageIcon from "./blockIcons/LayeredImageIcon.png"

export type BlockModel = {
  type: string;
  data: { [key: string]: string };
  uuid: string; // must be unique to avoid layout issues
};

export interface FeedComponentProps {
  model: BlockModel;
  width?: number;
}

export interface ComposerComponentProps {
  done: (data: BlockModel) => void;
  model: BlockModel;
  width?: number;
}

export type BlockType = {
  type: string;
  displayName: string; // in add block menu
  displayDescription: string; // in add block menu
  icon: string; // in add block menu
  deprecated: boolean; // if users can continue to add the block
  doesBlockPost: boolean; // do updates of this block show up in the feed?
  doesBlockEdit: boolean; // does the user need to edit this block?
  createdBy: string; // the user who created the block
  fullscreenEdit: boolean; // does the block have a fullscreen edit modal?
};

// In order of how they should show up in the drop-down
export const BlockTypes: { [key: string]: BlockType } = {
  profile: {
    type: "profile",
    displayName: "Profile Header ",
    displayDescription: "Display a profile picture, title, and bio.",
    icon: profileIcon,
    deprecated: false,
    doesBlockPost: false,
    doesBlockEdit: true,
    createdBy: "seam",
    fullscreenEdit: false,
  },
  "PixelArt": {
    type: "PixelArt",
    displayName: "Pixel Art",
    displayDescription: "A block to make then display pixel art",
    icon: pixelArtIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: "emilee",
    fullscreenEdit: false,
  },
  giphy: {
    type: "giphy",
    displayName: "GIPHY ",
    displayDescription: "Choose a gif.",
    icon: giphyIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: "seam",
    fullscreenEdit: false,
  },
  text: {
    type: "text",
    displayName: "Text ",
    displayDescription: "Add text with formatting and links.",
    icon: textIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: "seam",
    fullscreenEdit: false,
  },
  iframe: {
    type: "iframe",
    displayName: "Website ",
    displayDescription: "Embed a clickable website.",
    icon: websiteIcon,
    deprecated: false,
    doesBlockPost: false,
    doesBlockEdit: true,
    createdBy: "seam",
    fullscreenEdit: false,
  },
  video: {
    type: "video",
    displayName: "Video",
    displayDescription: "Add a video from Youtube, Loom, or Vimeo using a URL.",
    icon: videoIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: "seam",
    fullscreenEdit: false,
  },
  image: {
    type: "image",
    displayName: "Image ",
    displayDescription: "Add an image using a URL.",
    icon: imageIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: "seam",
    fullscreenEdit: false,
  },
  link: {
    type: "link",
    displayName: "Button ",
    displayDescription: "Create a button.",
    icon: linkIcon,
    deprecated: false,
    doesBlockPost: false,
    doesBlockEdit: true,
    createdBy: "seam",
    fullscreenEdit: false,
  },
  "Link Bookmark": {
    type: "Link Bookmark",
    displayName: "Link ",
    displayDescription: "Add a link using a URL.",
    icon: bookmarkIcon,
    deprecated: false,
    doesBlockPost: false,
    doesBlockEdit: true,
    createdBy: "seam",
    fullscreenEdit: false,
  },
  twitter: {
    type: "twitter",
    displayName: "Twitter Profile ",
    displayDescription: "Automatically display latest tweets from a twitter profile.",
    icon: twitterIcon,
    deprecated: true,
    doesBlockPost: false,
    doesBlockEdit: true,
    createdBy: "seam",
    fullscreenEdit: false,
  },
  tweet: {
    type: "tweet",
    displayName: "Single Tweet ",
    displayDescription: "Display a single tweet.",
    icon: twitterIcon,
    deprecated: true,
    doesBlockPost: false,
    doesBlockEdit: true,
    createdBy: "seam",
    fullscreenEdit: false,
  },
  Music: {
    type: "Music",
    displayName: "Music ",
    displayDescription: "Embed a song or playlist from Spotify or Soundcloud.",
    icon: musicIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: "seam",
    fullscreenEdit: true,
  },
  Map: {
    type: "Map",
    displayName: "Map ",
    displayDescription: "Display an interactive Google map.",
    icon: mapIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: "seam",
    fullscreenEdit: true,
  },
  "Image Button": {
    type: "Image Button",
    displayName: "Image Button ",
    displayDescription: "Create a button with an image background.",
    icon: twitterIcon,
    deprecated: true,
    doesBlockPost: false,
    doesBlockEdit: true,
    createdBy: "seam",
    fullscreenEdit: false,
  },
  instagram: {
    type: "instagram",
    displayName: "Instagram ",
    displayDescription: "Embed your Instagram.",
    icon: giphyIcon,
    deprecated: true,
    doesBlockPost: false,
    doesBlockEdit: true,
    createdBy: "seam",
    fullscreenEdit: false,
  },
  "NFTs": {
    type: "NFTs",
    displayName: "NFTs",
    displayDescription: "View the first twenty NFTs in your ethereum wallet.",
    icon: nftIcon,
    deprecated: false,
    doesBlockPost: false,
    doesBlockEdit: true,
    createdBy: "andrew",
    fullscreenEdit: false,
  },
  "Pokemon": {
    type: "Pokemon",
    displayName: "Random Pokemon",
    displayDescription: "Displays a random Pokemon!",
    icon: pokemonIcon,
    deprecated: false,
    doesBlockPost: false,
    doesBlockEdit: false,
    createdBy: "luisenriqueg",
    fullscreenEdit: false,
  },
  "Marquee": {
    type: "Marquee",
    displayName: "Marquee",
    displayDescription: "Displays a scrolling banner of text",
    icon: marqueeIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: "nick",
    fullscreenEdit: false,
  },
  "PhotoAlbum": {
    type: "PhotoAlbum",
    displayName: "Photo Album Block",
    displayDescription: "Fading photo viewer block that accepts up to 10 image URLs.",
    icon: photoAlbumIcon,
    deprecated: false,
    doesBlockPost: false,
    doesBlockEdit: true,
    createdBy: "jamesburet",
    fullscreenEdit: false,
  },
  "FlashingText": {
    type: "FlashingText",
    displayName: "Flashing Text",
    displayDescription: "Text and background swap colors, creating a flashing effect.",
    icon: flashingTextIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: "ttran010",
    fullscreenEdit: false,
  },
  "countdown": {
    type: "countdown",
    displayName: "Countdown Timer",
    displayDescription: "A Countdown Timer",
    icon: clockIcon,
    deprecated: true,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: "coldreactor",
    fullscreenEdit: false,
  },
  "tokenHoldings": {
    type: "tokenHoldings",
    displayName: "Token Holdings",
    displayDescription: "a block for displaying your ERC20 token holdings",
    icon: tokenIcon,
    deprecated: false,
    doesBlockPost: false,
    doesBlockEdit: true,
    createdBy: "proofofjake",
    fullscreenEdit: false,
  },
  "NFT": {
    type: "NFT",
    displayName: "NFT",
    displayDescription: "Display a single NFT",
    icon: nftIcon,
    deprecated: false,
    doesBlockPost: false,
    doesBlockEdit: true,
    createdBy: "nick",
    fullscreenEdit: false,
  },
  "fcUserFeed": {
    type: "fcUserFeed",
    displayName: "Farcaster User Feed",
    displayDescription: "Top 10 most popular Farcaster casts",
    icon: farcasterIcon,
    deprecated: false,
    doesBlockPost: false,
    doesBlockEdit: true,
    createdBy: "nick",
    fullscreenEdit: false,
  },
  "eyes": {
    type: "eyes",
    displayName: "eyes",
    displayDescription: "cute eyes, watching ur every move",
    icon: eyesIcon,
    deprecated: false,
    doesBlockPost: false,
    doesBlockEdit: false,
    createdBy: "razberry",
    fullscreenEdit: false,
  },
  "LayeredImage": { 
    type: "LayeredImage",
    displayName: "Layered Image",
    displayDescription: "Tell stories through sequential images",
    icon: LayeredImageIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: "jakeaicher",
    fullscreenEdit: false,
  },
};
