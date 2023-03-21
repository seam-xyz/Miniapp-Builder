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

export type BlockModel = {
  type: string;
  data: { [key: string]: string };
  uuid: string; // must be unique to avoid layout issues
};

// eventually this will exist on the serverside once we have UGC blocks
export type BlockType = {
  type: string;
  displayName: string; // in add block menu
  displayDescription: string; // in add block menu
  emptyTitle: string; // before configuration in card
  emptySubtitle: string; // before configuration in card
  icon: string; // in add block menu
  deprecated: boolean; // if users can continue to add the block
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
  },
  text: {
    type: "text",
    displayName: "Text ",
    displayDescription: "Add text with formatting and links.",
    emptyTitle: "This is an empty Text block!",
    emptySubtitle: "Add some text here.",
    icon: textIcon,
    deprecated: false,
  },
  iframe: {
    type: "iframe",
    displayName: "Website ",
    displayDescription: "Embed a clickable website.",
    emptyTitle: "This is an empty IFrame block!",
    emptySubtitle: "Add a website here.",
    icon: websiteIcon,
    deprecated: false,
  },
  video: {
    type: "video",
    displayName: "Video",
    displayDescription: "Add a video from Youtube, Loom, or Vimeo using a URL.",
    emptyTitle: "This is an empty video block!",
    emptySubtitle: "Add a video link here.",
    icon: videoIcon,
    deprecated: false,
  },
  image: {
    type: "image",
    displayName: "Image ",
    displayDescription: "Add an image using a URL.",
    emptyTitle: "This is an empty Image block!",
    emptySubtitle: "Add an image here.",
    icon: imageIcon,
    deprecated: false,
  },
  link: {
    type: "link",
    displayName: "Link ",
    displayDescription: "Create a button.",
    emptyTitle: "This is an empty link block!",
    emptySubtitle: "Add a url for the button.",
    icon: linkIcon,
    deprecated: false,
  },
  "Link Bookmark": {
    type: "Link Bookmark",
    displayName: "Link Bookmark ",
    displayDescription: "Add a link bookmark using a URL.",
    emptyTitle: "This is an empty link bookmark block!",
    emptySubtitle: "Add a url for a bookmark.",
    icon: bookmarkIcon,
    deprecated: true,
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
  },
  tweet: {
    type: "tweet",
    displayName: "Single Tweet ",
    displayDescription: "Display a single tweet.",
    emptyTitle: "This is an empty tweet block!",
    emptySubtitle: "Add a tweet ID here.",
    icon: twitterIcon,
    deprecated: false,
  },
  Music: {
    type: "Music",
    displayName: "Music ",
    displayDescription: "Embed a song or playlist from Spotify or Soundcloud.",
    emptyTitle: "This is an empty music block!",
    emptySubtitle: "Add a music link.",
    icon: musicIcon,
    deprecated: false,
  },
  Map: {
    type: "Map",
    displayName: "Map ",
    displayDescription: "Display an interactive Google map.",
    emptyTitle: "This is an empty map block!",
    emptySubtitle: "Add a Google maps link.",
    icon: mapIcon,
    deprecated: false,
  },
  "Image Button": {
    type: "Image Button",
    displayName: "Image Button ",
    displayDescription: "Create a button with an image background.",
    emptyTitle: "This is an empty Image button block!",
    emptySubtitle: "Add an image and url to link to.",
    icon: twitterIcon,
    deprecated: true,
  },
  giphy: {
    type: "giphy",
    displayName: "GIPHY ",
    displayDescription: "Choose a gif.",
    emptyTitle: "This is an empty gif!",
    emptySubtitle: "Choose your gif.",
    icon: giphyIcon,
    deprecated: false,
  },
  instagram: {
    type: "instagram",
    displayName: "Instagram ",
    displayDescription: "Embed your Instagram.",
    emptyTitle: "No Instagram here yet!",
    emptySubtitle: "Choose your Instagram.",
    icon: giphyIcon,
    deprecated: true,
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
  },
  "PixelArt": {
    type: "PixelArt",
    displayName: "Pixel Art",
    displayDescription: "A block to make then display pixel art",
    emptyTitle: "Empty Pixel Art Block",
    emptySubtitle: "Tap here to setup your Pixel Art block!",
    icon: pixelArtIcon,
    deprecated: false,
  },
  "NFTs": {
    type: "NFTs",
    displayName: "NFTs",
    displayDescription: "View the first twenty NFTs in your ethereum wallet.",
    emptyTitle: "Empty NFTs Block",
    emptySubtitle: "Tap here to setup your NFTs block!",
    icon: nftIcon,
    deprecated: false
  },
  "Pokemon": { 
        type: "Pokemon",
        displayName: "PokemonBlock",
        displayDescription: "Pokemon",
        emptyTitle: "Empty PokemonBlock Block",
        emptySubtitle: "Tap here to setup your PokemonBlock block!",
        icon: "PokemonIcon", // TODO: insert your block icon here
        deprecated: false
    },
};
