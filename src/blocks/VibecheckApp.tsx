import React, { useState } from 'react';
import { ComposerComponentProps, FeedComponentProps } from './types';
import { getPlaylistTracks, getAudioFeatures, calculateWeightedScores } from './utils/SpotifySearch/actions/result';
import { Box, TextField } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { motion } from "framer-motion"

const useStyles = makeStyles({
  field: {
    [`& fieldset`]: {
      borderRadius: 0,
      border: 'none',
    },
    '& .MuiInputBase-input': {
      color: 'white',
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'white',
      opacity: 0.5,
    },
  },
});

interface AudioFeatures {
  danceability: number;
  energy: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
}

interface VibeDescription {
  animal: string;
  descriptions: string[];
}

type VibeLevel = 'veryLow' | 'low' | 'medium' | 'high' | 'veryHigh';

type VibeMap = {
  [K in keyof Pick<AudioFeatures, 'danceability' | 'energy' | 'valence'>]: Record<VibeLevel, VibeDescription>;
};

const generateVibeSummary = (scores: AudioFeatures) => {
  const thresholds = {
    veryLow: 0.2,
    low: 0.4,
    medium: 0.6,
    high: 0.8,
  };

  const getLevel = (score: number): VibeLevel => {
    if (score < thresholds.veryLow) return 'veryLow';
    if (score < thresholds.low) return 'low';
    if (score < thresholds.medium) return 'medium';
    if (score < thresholds.high) return 'high';
    return 'veryHigh';
  };

  const vibeMap: VibeMap = {
    danceability: {
      veryLow: { animal: "🐌 Snail", descriptions: ["slow and steady", "taking it easy", "in no rush"] },
      low: { animal: "🐢 Turtle", descriptions: ["taking it easy", "moving at a relaxed pace", "cruising along"] },
      medium: { animal: "🐈 Cat", descriptions: ["quick and nimble", "graceful and agile", "smooth moves"] },
      high: { animal: "🐒 Monkey", descriptions: ["swinging and grooving", "full of energy", "bouncing around"] },
      veryHigh: { animal: "💃 Dancer", descriptions: ["born to boogie", "can’t stop moving", "dance floor ready"] },
    },
    energy: {
      veryLow: { animal: "🦥 Sloth", descriptions: ["super chill", "taking it easy", "completely relaxed"] },
      low: { animal: "🐨 Koala", descriptions: ["laid-back", "chilled out", "calm and cozy"] },
      medium: { animal: "🦌 Deer", descriptions: ["alert and active", "ready to move", "on the go"] },
      high: { animal: "🐆 Cheetah", descriptions: ["full of energy", "speeding through", "can't be stopped"] },
      veryHigh: { animal: "⚡ Lightning Bolt", descriptions: ["electrifying", "high voltage", "charged up"] },
    },
    valence: {
      veryLow: { animal: "🦇 Bat", descriptions: ["dark and brooding", "gloomy vibes", "shadowy and mysterious"] },
      low: { animal: "🐺 Wolf", descriptions: ["creeping in the night", "lone wolf mood", "mysterious and cool"] },
      medium: { animal: "🦜 Parrot", descriptions: ["showing off their colorful character", "chatty and bright", "full of personality"] },
      high: { animal: "🐶 Dog", descriptions: ["happy-go-lucky", "always smiling", "man's best friend energy"] },
      veryHigh: { animal: "🦄 Unicorn", descriptions: ["magical and joyful", "sparkling with positivity", "pure happiness"] },
    },
  };

  const getRandomDescription = (descriptions: string[]) => {
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const getDominantVibe = (): VibeDescription | null => {
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const [topFeature, topScore] = sortedScores[0];
    const level = getLevel(topScore);
    return (topFeature in vibeMap) ? vibeMap[topFeature as keyof VibeMap][level] : null;
  };

  const dominantVibe = getDominantVibe();
  const danceLevel = getLevel(scores.danceability);
  const energyLevel = getLevel(scores.energy);
  const valenceLevel = getLevel(scores.valence);

  let result = ""
  let summary = "";
  if (dominantVibe) {
    result = `Your vibe is: ${dominantVibe.animal}`;
  } else {
    const animal = randomAnimal();
    result = `Your vibe is: ${animal.emoji}`;
  }

  summary += `It's ${getRandomDescription(vibeMap.danceability[danceLevel].descriptions)} with ${getRandomDescription(vibeMap.energy[energyLevel].descriptions)} tracks that are ${getRandomDescription(vibeMap.valence[valenceLevel].descriptions)}. `;

  if (scores.acousticness > thresholds.high) {
    summary += "The acoustic vibes are strong with this one. ";
  } else if (scores.instrumentalness > thresholds.high) {
    summary += "Instruments take the lead in this playlist. ";
  }

  if (scores.speechiness > thresholds.medium) {
    summary += "There's a lot of vocal action happening here. ";
  }

  if (scores.liveness > thresholds.high) {
    summary += "It's like a live concert in your ears! ";
  }

  return { result, summary, emoji: dominantVibe ? dominantVibe.animal.split(' ')[0] : '🎵' };
};

const randomAnimal = (): { emoji: string; text: string } => {
  const animals = [
    { emoji: "🦩 Flamingo", text: "a Flamingo—quirky and standing out" },
    { emoji: "🦔 Hedgehog", text: "a Hedgehog—cute but a little prickly" },
    { emoji: "🦜 Parrot", text: "a Parrot—colorful and talkative" },
    { emoji: "🐙 Octopus", text: "an Octopus—complex and multifaceted" },
    { emoji: "🦊 Fox", text: "a Fox—clever and adaptable" },
    { emoji: "🦚 Peacock", text: "a Peacock—showy and proud" },
    { emoji: "🐸 Frog", text: "a Frog—hopping from genre to genre" },
    { emoji: "🦉 Owl", text: "an Owl—wise and mysterious" }
  ];
  return animals[Math.floor(Math.random() * animals.length)];
};

export const VibecheckComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [url, setUrl] = useState<string>('');
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);

  const handleFetch = async () => {
    setLoading(true);

    try {
      const playlistId = extractPlaylistId(url);
      const tracks = await getPlaylistTracks(playlistId);
      const trackIds = tracks.map((track: any) => track.id);
      const audioFeatures = await getAudioFeatures(trackIds);
      
      // Calculate weighted scores for the audio features
      const scores = calculateWeightedScores(audioFeatures);
      
      // Store scores and playlist URL in model data
      model.data.scores = scores;
      model.data.playlistUrl = url; // Store the playlist URL

      done(model); // Go to feed component
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractPlaylistId = (url: string) => {
    const regex = /playlist\/([a-zA-Z0-9]+)\?/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
  };

  return (
    <div className="w-full h-full flex bg-seam-black flex-col items-center overflow-y-hidden hide-scrollbar">
      <div className="w-full h-full flex flex-col mt-[24px] items-center justify-center overflow-y-hidden hide-scrollbar">
        { !loading ? (
        <>
        <div className="flex flex-col items-center justify-center w-auto h-auto space-y-4">
          <h2 className="text-seam-white font-sans">Vibe check your playlists</h2>
          <h3 className="text-seam-white font-sans">Enter a Spotify playlist URL to get started</h3>
          <Box className="w-auto border-2 border-white-300 mt-[24px] rounded-full w-full" style={{ display: "flex", flexDirection: "row", fontFamily: "Unbounded", justifyContent: 'center', alignItems: 'center', paddingInline: '16px' }}>
            <TextField
              type="search"
              name="searchTerm"
              fullWidth
              value={url}
              onChange={(e: any) => setUrl(e.target.value)}
              autoComplete="off"
              placeholder="Playlist link"
              className={`mr-2 text-white-300 placeholder:text-white-300/20 placeholder:text-lg ${classes.field} border-2 w-full border-white-300`}
              sx={{ input: { border: 'none', fontFamily: "Public Sans", textTransform: 'none', } }} />
          </Box>
          <Box className="flex items-center justify-center bg-seam-black" style={{ paddingBottom: `calc(env(safe-area-inset-bottom, 24px) + 24px)` }} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 3, zIndex: 1301 }}>
            <button className="p-4 bg-seam-pink w-full h-auto rounded-[8px]" onClick={handleFetch} disabled={loading}>
              <h3 className="text-seam-white font-sans">{loading ? "Fetching..." : "Create your vibe"}</h3>
            </button>
          </Box>
        </div>
        </> 
        ) : ( 
        <>
        <div className="flex flex-col items-center justify-center w-auto h-auto">
          <h2 className="text-seam-white">Vibe checking your playlist ...</h2>
          <div className="flex space-x-[-4px] mt-[24px]">
            {Object.keys(featureColors).map((key) => (
              <motion.div
                key={key}
                className="w-8 h-8 rounded-full mix-blend-screen"
                style={{ backgroundColor: featureColors[key] }}
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: (Math.random() * 1),
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </div>
        </> 
        )}
      </div>
    </div>
  );
};

const featureColors: { [key: string]: string } = {
  danceability: '#66c2a5',  // Light green
  energy: '#fc8d62',        // Orange
  speechiness: '#8da0cb',   // Light blue
  acousticness: '#e78ac3',  // Pink
  instrumentalness: '#a6d854', // Lime green
  liveness: '#ffd92f',      // Yellow
  valence: '#e5c494',       // Beige
};


const generateRandomAnimation = () => {
  const duration = Math.random() * 2 + 6; // Random duration between 6-8 seconds
  const delay = Math.random() * 4; // Random delay between 0-4 seconds
  const scaleX = Math.random() * 0.5 + 0.75; // Random stretch with a wider range, allowing smaller scales
  const scaleY = Math.random() * 0.5 + 0.75; // Random stretch with a wider range, allowing smaller scales
  const rotation = Math.random() * 360; // Random rotation between 0 and 360 degrees
  const translateX = (Math.random() - 0.5) * 20; // Random movement along the X-axis
  const translateY = (Math.random() - 0.5) * 20; // Random movement along the Y-axis

  return {
    scaleX: [1, scaleX, 1],
    scaleY: [1, scaleY, 1],
    rotate: [0, rotation, -rotation, rotation, 0], // Rotation animation with more variance
    x: [0, translateX, 0], // Adding translation for fluidity
    y: [0, translateY, 0], // Adding translation for fluidity
    transition: {
      duration,
      delay,
      repeat: Infinity,
      repeatType: 'mirror' as 'mirror',
      ease: 'easeInOut', // Using a non-linear easing function
    },
  };
};

export const VibecheckFeedComponent: React.FC<FeedComponentProps> = ({ model }) => {
  const scores = model.data.scores as AudioFeatures || {};
  const playlistUrl = model.data.playlistUrl || "#"; // Retrieve the stored playlist URL

  const featureDisplayNames: { [key: string]: string } = {
    danceability: "Dance",
    energy: "Energy",
    speechiness: "Vocals",
    acousticness: "Acoustic",
    instrumentalness: "Instrumental",
    liveness: "Live Concert",
    valence: "Positivity",
  };

  const { result, summary, emoji } = generateVibeSummary(scores);

  return (
    <div className="flex items-center justify-center flex-col w-full h-auto bg-black text-white p-5 rounded-lg text-center font-sans relative">
      <div className="relative w-32 h-32 mx-4 w-full h-full my-5">
        {Object.keys(featureColors).map((key) => (
          <motion.div
            key={key}
            className="absolute w-full h-full rounded-full mix-blend-screen"
            style={{
              backgroundColor: featureColors[key],
              opacity: 1, // Adjust opacity for layering effect
              filter: 'blur(0px)', // Adds a softer look to the edges
            }}
            animate={generateRandomAnimation()}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">{emoji}</span>
        </div>
      </div>
      <h2 className="text-2xl mb-3">{result}</h2>
      <h3 className="text-lg mb-5">{summary}</h3>
      <ul className="list-none p-0 w-full text-left mt-4">
        {Object.entries(scores).map(([key, value]) => (
          <li key={key} className="mb-2 flex justify-between items-center text-base">
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: featureColors[key] }}
            ></span>
            <span className="capitalize flex-grow">
              {featureDisplayNames[key] || key}: {/* Use the display name or fall back to the original key */}
            </span>
            <span>{((value as number) * 100).toFixed(2)}%</span>
          </li>
        ))}
      </ul>
      <div className="w-full my-4 h-auto flex items-center justify-center">
        <a href={playlistUrl} className="text-seam-green underline" target="_blank" rel="noopener noreferrer">
          Explore this playlist here
        </a>
      </div>
    </div>
  );
};