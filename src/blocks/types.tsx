import textIcon from "./blockIcons/textBlockIcon.png";
import websiteIcon from "./blockIcons/websiteIcon.png";
import videoIcon from "./blockIcons/videoIcon.png";
import imageIcon from "./blockIcons/imageIcon.png";
import linkIcon from "./blockIcons/linkIcon.png";
import twitterIcon from "./blockIcons/twitterIcon.png";
import bookmarkIcon from "./blockIcons/bookmarkIcon.png";
import mapIcon from "./blockIcons/mapIcon.png";
import giphyIcon from "./blockIcons/giphyLogo.png";
import profileIcon from "./blockIcons/profileHeaderIcon.png";
import musicIcon from "./blockIcons/musicIcon.png";
import randomGiphyIcon from "./blockIcons/randomGiphyIcon.png";
import pixelArtIcon from "./blockIcons/pixelArtIcon.png";
import nftIcon from "./blockIcons/nftIcon.png"
import pokemonIcon from "./blockIcons/pokeball.png"
import marqueeIcon from "./blockIcons/marqueeIcon.png"
import photoAlbumIcon from "./blockIcons/photoAlbumIcon.png"
import flashingTextIcon from "./blockIcons/flashingTextIcon.png";

export type BlockModel = {
  type: string;
  data: { [key: string]: string };
  uuid: string; // must be unique to avoid layout issues
};

export type BlockType = {
  type: string;
  displayName: string; // in add block menu
  displayDescription: string; // in add block menu
  emptyTitle: string; // before configuration in card
  emptySubtitle: string; // before configuration in card
  icon: string; // in add block menu
  minHeight?: number, // in rows, each row being 5px
  minWidth?: number, // in column units
  deprecated: boolean; // if users can continue to add the block
  feedConstrained: boolean; // does this block have a defined aspect ratio for the feed?
  doesBlockPost: boolean; // do updates of this block show up in the feed?
};

// In order of how they should show up in the drop-down
export const BlockTypes: { [key: string]: BlockType } = {
  profile: {
    type: "profile",
    displayName: "Profile Header ",
    displayDescription: "Display a profile picture, title, and bio.",
    emptyTitle: "This is an empty profile header!",
    emptySubtitle: "Configure your profile header.",
    icon: profileIcon,
    deprecated: false,
    feedConstrained: true,
    doesBlockPost: false
  },
  text: {
    type: "text",
    displayName: "Text ",
    displayDescription: "Add text with formatting and links.",
    emptyTitle: "This is an empty Text block!",
    emptySubtitle: "Add some text here.",
    icon: textIcon,
    deprecated: false,
    feedConstrained: false,
    doesBlockPost: true
  },
  iframe: {
    type: "iframe",
    displayName: "Website ",
    displayDescription: "Embed a clickable website.",
    emptyTitle: "This is an empty IFrame block!",
    emptySubtitle: "Add a website here.",
    icon: websiteIcon,
    deprecated: false,
    feedConstrained: false,
    doesBlockPost: false
  },
  video: {
    type: "video",
    displayName: "Video",
    displayDescription: "Add a video from Youtube, Loom, or Vimeo using a URL.",
    emptyTitle: "This is an empty video block!",
    emptySubtitle: "Add a video link here.",
    icon: videoIcon,
    deprecated: false,
    feedConstrained: false,
    doesBlockPost: true
  },
  image: {
    type: "image",
    displayName: "Image ",
    displayDescription: "Add an image using a URL.",
    emptyTitle: "This is an empty Image block!",
    emptySubtitle: "Add an image here.",
    icon: imageIcon,
    deprecated: false,
    feedConstrained: true,
    doesBlockPost: true
  },
  link: {
    type: "link",
    displayName: "Link ",
    displayDescription: "Create a button.",
    emptyTitle: "This is an empty link block!",
    emptySubtitle: "Add a url for the button.",
    icon: linkIcon,
    minHeight: 5,
    deprecated: false,
    feedConstrained: false,
    doesBlockPost: true
  },
  "Link Bookmark": {
    type: "Link Bookmark",
    displayName: "Link Bookmark ",
    displayDescription: "Add a link bookmark using a URL.",
    emptyTitle: "This is an empty link bookmark block!",
    emptySubtitle: "Add a url for a bookmark.",
    icon: bookmarkIcon,
    deprecated: true,
    feedConstrained: true,
    doesBlockPost: false
  },
  twitter: {
    type: "twitter",
    displayName: "Twitter Profile ",
    displayDescription:
      "Automatically display latest tweets from a twitter profile.",
    emptyTitle: "This is an empty Twitter feed block.",
    emptySubtitle: "Add a twitter screen name.",
    icon: twitterIcon,
    deprecated: false,
    feedConstrained: false,
    doesBlockPost: false
  },
  tweet: {
    type: "tweet",
    displayName: "Single Tweet ",
    displayDescription: "Display a single tweet.",
    emptyTitle: "This is an empty tweet block!",
    emptySubtitle: "Add a tweet ID here.",
    icon: twitterIcon,
    deprecated: false,
    feedConstrained: false,
    doesBlockPost: false
  },
  Music: {
    type: "Music",
    displayName: "Music ",
    displayDescription: "Embed a song or playlist from Spotify or Soundcloud.",
    emptyTitle: "This is an empty music block!",
    emptySubtitle: "Add a music link.",
    icon: musicIcon,
    deprecated: false,
    feedConstrained: false,
    doesBlockPost: true
  },
  Map: {
    type: "Map",
    displayName: "Map ",
    displayDescription: "Display an interactive Google map.",
    emptyTitle: "This is an empty map block!",
    emptySubtitle: "Add a Google maps link.",
    icon: mapIcon,
    deprecated: false,
    feedConstrained: true,
    doesBlockPost: true
  },
  "Image Button": {
    type: "Image Button",
    displayName: "Image Button ",
    displayDescription: "Create a button with an image background.",
    emptyTitle: "This is an empty Image button block!",
    emptySubtitle: "Add an image and url to link to.",
    icon: twitterIcon,
    deprecated: true,
    feedConstrained: true,
    doesBlockPost: false
  },
  giphy: {
    type: "giphy",
    displayName: "GIPHY ",
    displayDescription: "Choose a gif.",
    emptyTitle: "This is an empty gif!",
    emptySubtitle: "Choose your gif.",
    icon: giphyIcon,
    deprecated: false,
    feedConstrained: true,
    doesBlockPost: true
  },
  instagram: {
    type: "instagram",
    displayName: "Instagram ",
    displayDescription: "Embed your Instagram.",
    emptyTitle: "No Instagram here yet!",
    emptySubtitle: "Choose your Instagram.",
    icon: giphyIcon,
    deprecated: true,
    feedConstrained: true,
    doesBlockPost: false
  },
  RefreshingGIF: {
    type: "RefreshingGIF",
    displayName: "RefreshingGIF",
    displayDescription:
      "Get a new random GIF based on your search string every load of your page",
    emptyTitle: "Empty RefreshingGIF Block",
    emptySubtitle: "Tap here to setup your RefreshingGIF block!",
    icon: randomGiphyIcon,
    deprecated: false,
    feedConstrained: true,
    doesBlockPost: false
  },
  "PixelArt": {
    type: "PixelArt",
    displayName: "Pixel Art",
    displayDescription: "A block to make then display pixel art",
    emptyTitle: "Empty Pixel Art Block",
    emptySubtitle: "Tap here to setup your Pixel Art block!",
    icon: pixelArtIcon,
    minWidth: 2,
    deprecated: false,
    feedConstrained: true,
    doesBlockPost: true
  },
  "NFTs": {
    type: "NFTs",
    displayName: "NFTs",
    displayDescription: "View the first twenty NFTs in your ethereum wallet.",
    emptyTitle: "Empty NFTs Block",
    emptySubtitle: "Tap here to setup your NFTs block!",
    icon: nftIcon,
    deprecated: false,
    feedConstrained: true,
    doesBlockPost: false
  },
  "Pokemon": {
    type: "Pokemon",
    displayName: "Random Pokemon",
    displayDescription: "Displays a random Pokemon!",
    emptyTitle: "Empty PokemonBlock Block",
    emptySubtitle: "Tap here to setup your PokemonBlock block!",
    icon: pokemonIcon,
    deprecated: false,
    feedConstrained: true,
    doesBlockPost: false
  },
  "Marquee": {
    type: "Marquee",
    displayName: "Marquee",
    displayDescription: "Displays a scrolling banner of text",
    emptyTitle: "Empty Marquee Block",
    emptySubtitle: "Tap here to setup your Marquee block!",
    icon: marqueeIcon,
    deprecated: false,
    feedConstrained: false,
    doesBlockPost: true
  },
  "PhotoAlbum": { 
    type: "PhotoAlbum",
    displayName: "Photo Album Block",
    displayDescription: "Fading photo viewer block that accepts up to 10 image URLs.",
    emptyTitle: "Empty Photo Album Block",
    emptySubtitle: "Tap here to setup your Photo Album block!",
    icon: photoAlbumIcon,
    deprecated: false,
    feedConstrained: true,
    doesBlockPost: false
  },
  "FlashingText": { 
    type: "FlashingText",
    displayName: "Flashing Text",
    displayDescription: "Text and background swap colors, creating a flashing effect.",
    emptyTitle: "Empty Flashing Text Block",
    emptySubtitle: "Tap here to setup your Flashing Text block!",
    icon: flashingTextIcon,
    deprecated: false,
    feedConstrained: false,
    doesBlockPost: true
  },
};
