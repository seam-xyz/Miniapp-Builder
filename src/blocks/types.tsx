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
import justAThoughtIcon from "./blockIcons/justAThoughtIcon.png";
import vibecheckIcon from "./blockIcons/vibecheckIcon.png";

export type BlockModel = {
  type: string;
  data: { [key: string]: string };
  uuid: string; // must be unique to avoid layout issues
};

export interface AccountModel {
  readonly spotifyAccount?: any;
}

export interface Badge {
  type: string; // Badge name
}

export interface FeedComponentProps {
  model: BlockModel;
  update: (data: { [key: string]: string }) => void;
  width?: number;
}

export interface ComposerComponentProps {
  done: (data: BlockModel) => void;
  model: BlockModel;
  width?: number;
}

export type PointSplit = {
  username: string;
  split: number; // 1.0 is 100%, 0.5 is 50%, etc. Make sure to add up to 1.0!
};

export type BlockType = {
  type: string;
  displayName: string; // in add block menu
  displayDescription: string; // in add block menu
  icon: string; // in add block menu
  deprecated: boolean; // if users can continue to add the block
  doesBlockPost: boolean; // do updates of this block show up in the feed?
  doesBlockEdit: boolean; // does the user need to edit this block?
  createdBy: PointSplit[]; // the users who created the block
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
    createdBy: [{username: "seam", split: 1}],
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
    createdBy: [{username: "emilee", split: 1}],
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
    createdBy: [{username: "seam", split: 1}],
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
    createdBy: [{username: "seam", split: 1}],
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
    createdBy: [{username: "seam", split: 1}],
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
    createdBy: [{username: "seam", split: 1}],
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
    createdBy: [{username: "seam", split: 1}],
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
    createdBy: [{username: "seam", split: 1}],
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
    createdBy: [{username: "seam", split: 1}],
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
    createdBy: [{username: "seam", split: 1}],
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
    createdBy: [{username: "seam", split: 1}],
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
    createdBy: [{username: "seam", split: 1}],
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
    createdBy: [{username: "seam", split: 1}],
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
    createdBy: [{username: "seam", split: 1}],
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
    createdBy: [{username: "seam", split: 1}],
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
    createdBy: [{username: "andrew", split: 1}],
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
    createdBy: [{username: "luisenriqueg", split: 1}],
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
    createdBy: [{username: "nick", split: 1}],
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
    createdBy: [{username: "jamesburet", split: 1}],
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
    createdBy: [{username: "ttran010", split: 1}],
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
    createdBy: [{username: "coldreactor", split: 1}],
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
    createdBy: [{username: "proofofjake", split: 1}],
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
    createdBy: [{username: "nick", split: 1}],
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
    createdBy: [{username: "nick", split: 1}],
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
    createdBy: [{username: "razberry", split: 1}],
    fullscreenEdit: false,
  },
  "Mondrian": { 
    type: "Mondrian",
    displayName: "Layered Image",
    displayDescription: "Create works of art in the style of Piet Mondrian",
    icon: MondrianIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: [{username: "jamesburet", split: 0.5}, {username: "rocco", split: 0.5}],
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
    createdBy: [{username: "jakeaicher", split: 1.0}],
    fullscreenEdit: false,
  },
  "Bookshelf": {
    type: "Bookshelf",
    displayName: "Bookshelf",
    displayDescription: "Post a book you've read",
    icon: bookIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: [{username: "nick", split: 0.50}, {username: "rocco", split: 0.50}],
    fullscreenEdit: true,
  },
  "Wordle": {
    type: "Wordle",
    displayName: "Wordle",
    displayDescription: "Seam's take on the hot NYT daily game, Wordle!",
    icon: WordleIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: [{username: "jamesburet", split: 0.5}, {username: "rocco", split: 0.5}],
    fullscreenEdit: false,
  },
  "Mood": {
    type: "Mood",
    displayName: "Mood Visualizer",
    displayDescription: "Express your emotions, open up and tell the world how you're feeling!",
    icon: MoodIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: [{username: "jamesburet", split: 0.5}, {username: "rocco", split: 0.5}],
    fullscreenEdit: true,
  },
  "Whiteboard": {
    type: "Whiteboard",
    displayName: "Whiteboard",
    displayDescription: "Draw on a whiteboard!",
    icon: WhiteboardIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: [{username: "emilee", split: 0.5}, {username: "rocco", split: 0.5}],
    fullscreenEdit: false,
  },
  "ImagePuzzle": {
    type: "ImagePuzzle",
    displayName: "Image Puzzle",
    displayDescription: "Upload an image and turn it into a sliding puzzle!",
    icon: ImagePuzzleIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: [{username: "ssebexen", split: 1}],
    fullscreenEdit: false,
  },
  "Calligraphy": {
    type: "Calligraphy",
    displayName: "Calligraphy",
    displayDescription: "Draw with expressive brushstrokes",
    icon: CalligraphyIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: [{username: "chevron", split: 0.5}, {username: "ssbexen", split: 0.5}],
    fullscreenEdit: false,
  },
  "localelocatr": {
    type: "localelocatr",
    displayName: "localelocatr",
    displayDescription: "A GeoGuesser game that allows users to guess different locations based on a streetview panorama",
    icon: localelocatrIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: [{username: "mbehera", split: 1.0}],
    fullscreenEdit: false,
  },
  "Camera": {
    type: "Camera",
    displayName: "Camera",
    displayDescription: "Use your device's camera to take and upload a photo!",
    icon: CameraIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: [{username: "seam", split: 1}],
    fullscreenEdit: false,
  },
  "JustAThought": { 
    type: "JustAThought",
    displayName: "Just a Thought",
    displayDescription: "Just a thought in 120 characters or less",
    icon: justAThoughtIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: [{username: "emilee", split: 1}],
    fullscreenEdit: false,
  },
  "Voice": { 
    type: "Voice",
    displayName: "Voice Note",
    displayDescription: "Use the microphone to record a voice note. The post then allows users to play it back.",
    icon: voiceNoteIcon, 
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: [{username: "samsam", split: 1}],
    fullscreenEdit: false,
  },
  "Vibecheck": { 
    type: "Vibecheck",
    displayName: "VibeCheck",
    displayDescription: "Get a vibe check on your favorite Spotify Playlists!",
    icon: vibecheckIcon,
    deprecated: false,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: [{username: "jamesburet", split: 0.5}, {username: "rocco", split: 0.5}],
    fullscreenEdit: true,
  },
  "Unknown": {
    type: "Unknown",
    displayName: "Unknown",
    displayDescription: "Unknown",
    icon: "UnknownIcon",
    deprecated: true,
    doesBlockPost: true,
    doesBlockEdit: true,
    createdBy: [{username: "seam", split: 1}],
    fullscreenEdit: false,
  },
};
