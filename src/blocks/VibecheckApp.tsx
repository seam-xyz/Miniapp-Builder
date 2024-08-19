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

type VibeLevel = 'veryLow' | 'low' | 'medium' | 'high' | 'veryHigh';

interface VibeDescription {
  messages: string[];
}

const determineAnimal = (scores: AudioFeatures) => {
  const animals = [
    {
      emoji: "🐌",
      name: "Snail",
      blurb: "cruisin’ along, reflectively! As the Snail, you’re in touch with your inner self, as you glide effortlessly along to your solemnest tunes."
    },
    {
      emoji: "🐢",
      name: "Turtle",
      blurb: "the green MACHINE, Turtle! Chew away on your veggies and let the chillest of vibes wash over you. Enjoy the ride!"
    },
    {
      emoji: "🦥",
      name: "Sloth",
      blurb: "hanging from a branch, in a cocoon of vibey tunes, Sloth! No one can say you don’t know how to take it easy."
    },
    {
      emoji: "🐁",
      name: "Mouse",
      blurb: "nibbling something reflective, Mouse. You love sleeping in your cozy little hole-in-the-wall, floating on a dreamy cloud of low-energy beats."
    },
    {
      emoji: "🐝",
      name: "Honeybee",
      blurb: "flying from flower to flower, Honeybee! Your tunes are addictively chill. Your playlists could heal the world!"
    },
    {
      emoji: "🐨",
      name: "Koala",
      blurb: "a great reminder to stop and smell the eucalyptus, Koala! Cozy and calm energy surrounds you, as you relax to your infectious beats."
    },
    {
      emoji: "🐈",
      name: "Cat",
      blurb: "having a slinky little listen! Strut along smoothly, dodging bad vibes and swaying to your gentle beats."
    },
    {
      emoji: "🐗",
      name: "Boar",
      blurb: "searching the forest floor with your keen nose for delicious nuggets of rhythm, Boar! Your steady and unstoppable presence is noted wherever you go."
    },
    {
      emoji: "🐐",
      name: "Goat",
      blurb: "bouncing and leaping up the side of a mountain, Goat! Your music is motivating and exciting, my silly and stubborn friend."
    },
    {
      emoji: "🦊",
      name: "Fox",
      blurb: "sniffing out something groovy, Fox? Trot on to your upbeat tracks, you one-of-a-kind creature!"
    },
    {
      emoji: "🐒",
      name: "Monkey",
      blurb: "swinging high in the treetops, you can’t be stopped, Monkey! You love a good vibe and a deep laugh more than anyone."
    },
    {
      emoji: "🐆",
      name: "Cheetah",
      blurb: "sprinting on, Cheetah! You can’t be slowed down, and who would want you to anyways?"
    },
    {
      emoji: "🦄",
      name: "Unicorn",
      blurb: "shining bright, you beautiful fantasy of a creature! As the unicorn, you prance along to the most magical of rhythms, bouncing over bad energy and lighting up the world."
    },
  ]; // 14 animals

  // Calculate individual feature scores
  const energyScore = scores.energy * 2;  // 0-2
  const danceScore = scores.danceability * 2;  // 0-2
  const valenceScore = scores.valence * 2;  // 0-2
  const acousticScore = (1 - scores.acousticness) * 1;  // 0-1 (inverted)
  const livenessScore = scores.liveness * 1;  // 0-1
  
  // Combine scores
  const totalScore = energyScore + danceScore + valenceScore + acousticScore + livenessScore;
  // Max possible score is 8 (2 + 2 + 2 + 1 + 1)

  // Define score thresholds for each animal with a bell curve distribution
  const thresholds = [
    { max: 3.0, animal: animals[0] },
    { max: 3.1, animal: animals[1] },
    { max: 3.2, animal: animals[2] },
    { max: 3.3, animal: animals[3] },
    { max: 3.4, animal: animals[4] },
    { max: 3.5, animal: animals[5] },  // Snail (covers 3.0 points)
    { max: 3.6, animal: animals[6] },  // Turtle (covers 0.5 points)
    { max: 3.8, animal: animals[7] },  // Sloth (covers 0.3 points)
    { max: 4.0, animal: animals[8] },  // Koala (covers 0.4 points)
    { max: 4.2, animal: animals[9] },  // Cat (covers 0.3 points)
    { max: 4.4, animal: animals[10] },  // Fox (covers 0.3 points)
    { max: 4.6, animal: animals[11] },  // Monkey (covers 0.2 points)
    { max: 4.8, animal: animals[12] },  // Cheetah (covers 0.5 points)
    { max: 5.0, animal: animals[13] },  // Unicorn (covers 2.5 points)
  ];
  
  // Determine which animal corresponds to the total score
  for (let i = 0; i < thresholds.length; i++) {
    if (totalScore <= thresholds[i].max) {
      return thresholds[i].animal;
    }
  }

  // Fallback in case of rounding errors
  return animals[animals.length - 1]; // Unicorn
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

  const getRandomMessage = (messages: string[]) => {
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const valenceMessages = {
    veryLow: ["cranky", "lugubrious", "anxious", "insomniac", "whining"],
    low: ["nostalgic", "crawling", "swaying", "humming"],
    medium: ["cool", "calm", "glowing", "vibrant", "elevated"],
    high: ["shining", "rambling", "beaming", "fired up", "floating"],
    veryHigh: ["exuberant", "sleepless", "hyper", "chaotic"],
  };

  const danceabilityMessages = {
    veryLow: ["rock", "vegetable", "ghost", "rain", "cloud"], 
    low: ["tree", "sandwich", "canoe", "giant", "thumbs-up", "clock"],
    medium: ["windmill", "river", "bicycle", "high-five", "smile"],
    high: ["paper airplane", "ocean", "ballerina", "laugh", "twirl"],
    veryHigh: ["engine", "disco ball", "kite", "angel", "demon", "live wire"],
  };

  const bonusMessages = {
    acousticness: {
      high: "taking your bare feet out and digging your piggies into the dirt",
      veryHigh: "making ASMR content in your voice memos app and then never sharing it with anyone"
    },
    instrumentalness: {
      high: "playing your guitar at the wrong time",
      veryHigh: "scoffing at other people's music taste",
    },
    liveness: {
      high: "spying on your ex's social media",
      veryHigh: "hopping the fence to get into music festivals"
    },
    speechiness: {
      high: "lying in bed ruminating on everything you said that day",
      veryHigh: "shaming your friends for watching the movie before they read the book",
    }
  };

  const valenceLevel = getLevel(scores.valence);
  const danceLevel = getLevel(scores.danceability);
  const animal = determineAnimal(scores);

  let summary = `You are ${animal.blurb}\n\n`;
  summary += `This playlist’s energy is like a ${getRandomMessage(valenceMessages[valenceLevel])} ${getRandomMessage(danceabilityMessages[danceLevel])}.\n\n`;

  // Add bonus messages if thresholds are met
  ['acousticness', 'instrumentalness', 'liveness', 'speechiness'].forEach((feature) => {
    const level = getLevel(scores[feature as keyof AudioFeatures]);
    if (level === 'high' || level === 'veryHigh') {
      summary += `We're assuming you're really into ${bonusMessages[feature as keyof typeof bonusMessages][level]}?`;
    }
  });

  return { summary, animal };
};

export const VibecheckComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const classes = useStyles();

  const triggerErrorAnimation = () => {
    // Reset the showError state to restart the animation
    setShowError(false);
    setTimeout(() => {
      setShowError(true);
    }, 10); // Small delay to ensure state change is recognized
  };

  const handleFetch = async () => {
    setLoading(true);
    setError('');
  
    try {
      const playlistId = extractPlaylistId(url);
      if (!playlistId) {
        throw new Error("Invalid Playlist URL");
      }
  
      const tracks = await getPlaylistTracks(playlistId);
      if (!tracks || tracks.length === 0) {
        throw new Error("No tracks found in playlist");
      }
  
      const trackIds = tracks.map((track: any) => track.id);
      const audioFeatures = await getAudioFeatures(trackIds);
      
      // Calculate weighted scores for the audio features
      const scores = calculateWeightedScores(audioFeatures);
      
      // Store scores and playlist URL in model data as a JSON string
      model.data.scores = JSON.stringify(scores);
      model.data.playlistUrl = url; // Store the playlist URL
  
      done(model); // Go to feed component
    } catch (error) {
      console.error("Error fetching playlist data:", error);
      setError("Must be a valid public Spotify Playlist link.");
      triggerErrorAnimation();  // Trigger the error message to flash
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
          <h3 className="text-seam-white font-sans">Enter a Spotify playlist URL</h3>
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
          {error && (
            <motion.div
              animate={{ opacity: showError ? [0.2, 1, 0.2, 1] : 1 }}
              transition={{ duration: 0.8, repeat: 0 }}
            >
              <h3 className="text-seam-pink mt-2">{error}</h3>
            </motion.div>
          )}
          <Box className="flex items-center justify-center bg-seam-black" style={{ paddingBottom: `calc(env(safe-area-inset-bottom, 24px) + 24px)` }} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 3, zIndex: 1301 }}>
            <button className="p-4 bg-seam-pink w-full h-auto rounded-[8px]" onClick={handleFetch} disabled={loading}>
              <h3 className="text-seam-white font-sans">{loading ? "Fetching..." : "Check the vibe"}</h3>
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
  const scores = JSON.parse(model.data.scores) as AudioFeatures || {};
  const playlistUrl = model.data.playlistUrl || "#";

  const featureDisplayNames: { [key: string]: string } = {
    danceability: "Groovy",
    energy: "Energized",
    acousticness: "Acoustic",
    instrumentalness: "Instrumental",
    valence: "Positivity",
  };

  const { summary, animal } = generateVibeSummary(scores);

  return (
    <div className="flex items-center justify-center flex-col w-full h-auto bg-black text-white p-5 rounded-lg text-center font-sans relative">
      <div className="relative w-32 h-32 mx-4" style={{ marginTop: '24px', marginBottom: '32px' }}>
        {Object.keys(featureColors).map((key) => (
          <motion.div
            key={key}
            className="absolute w-full h-full rounded-full mix-blend-screen"
            style={{
              backgroundColor: featureColors[key],
              opacity: 1,
              filter: 'blur(0px)',
            }}
            animate={generateRandomAnimation()}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">{animal.emoji}</span>
        </div>
      </div>
      <h2 className="text-2xl mb-4">Your Vibe Animal: {animal.name}</h2>
      <h3 className="text-lg mb-4 text-[#A2A1A1]">{summary}</h3>
      <ul className="list-none p-0 w-full text-left" style={{ marginTop: '16px' }}>
        {Object.entries(scores).filter(([key]) => key !== 'speechiness' && key !== 'liveness').map(([key, value]) => (
          <li key={key} className="mb-2 flex items-center text-base">
            <span
              className="inline-block w-4 h-4 rounded-full"
              style={{ backgroundColor: featureColors[key], marginRight: '12px' }}
            ></span>
            <span className="flex-grow self-end border-dashed border-t border-[#A2A1A1] opacity-50" style={{ height: '100%', marginRight: '12px', marginBottom: '4px', }}></span>
            <div className="flex items-baseline space-x-2">
              <span className="font-sans text-seam-white" style={{ fontWeight: 700 }}>{((value as number) * 100).toFixed(2)}%</span>
              <span className="font-sans text-[#A2A1A1] whitespace-nowrap">{featureDisplayNames[key] || key}</span>
            </div>
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