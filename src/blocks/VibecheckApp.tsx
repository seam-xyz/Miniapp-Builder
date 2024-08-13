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

type VibeMap = {
  [K in keyof AudioFeatures]: Record<VibeLevel, VibeDescription>;
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
    valence: {
      veryLow: { messages: ["feeling blue and introspective", "in a melancholic mood", "exploring the depths of your emotions"] },
      low: { messages: ["a bit wistful", "contemplating life's mysteries", "in touch with your deeper feelings"] },
      medium: { messages: ["emotionally balanced", "in a steady state of mind", "neither too high nor too low"] },
      high: { messages: ["pretty upbeat", "seeing the bright side of things", "radiating positive energy"] },
      veryHigh: { messages: ["on cloud nine", "bubbling with joy", "spreading happiness wherever you go"] },
    },
    danceability: {
      veryLow: { messages: ["not in the mood to move", "preferring stillness", "finding peace in tranquility"] },
      low: { messages: ["swaying gently", "moving at your own pace", "enjoying subtle rhythms"] },
      medium: { messages: ["ready for a casual groove", "finding your rhythm", "in sync with the beat"] },
      high: { messages: ["feeling the urge to dance", "ready to hit the dance floor", "moving with the music"] },
      veryHigh: { messages: ["can't stop won't stop dancing", "fully in the groove", "letting the rhythm take control"] },
    },
    energy: {
      veryLow: { messages: ["totally zen", "in a state of calm", "conserving your energy"] },
      low: { messages: ["taking it easy", "enjoying a relaxed vibe", "going with the flow"] },
      medium: { messages: ["feeling unsure about the future", "solid chill music", "finding your balance"] },
      high: { messages: ["feeling invigorated", "feeling charged up and ready to go", "radiating enthusiasm"] },
      veryHigh: { messages: ["absolutely electrified", "bursting with energy", "on a non-stop power trip"] },
    },
    acousticness: {
      veryHigh: { messages: ["embracing raw, unplugged sounds", "appreciating the beauty of acoustic instruments", "enjoying a stripped-down musical experience"] },
      high: { messages: ["feeling that down to earth vibe", "finding comfort in acoustic vibes", "connecting with organic sounds"] },
      medium: { messages: ["balancing acoustic and electronic elements", "enjoying a mix of natural and produced sounds", "appreciating diverse musical textures"] },
      low: { messages: ["gravitating towards polished production", "enjoying a more processed sound", "vibing with modern musical techniques"] },
      veryLow: { messages: ["all about those electronic beats", "immersed in synthetic sounds", "enjoying cutting-edge production"] },
    },
    instrumentalness: {
      veryHigh: { messages: ["lost in instrumental landscapes", "appreciating music without words", "letting the instruments do the talking"] },
      high: { messages: ["mostly vibing to instrumentals", "focusing on musical composition", "enjoying the interplay of instruments"] },
      medium: { messages: ["balancing vocals and instrumentals", "appreciating both lyrics and composition", "enjoying a diverse musical palette"] },
      low: { messages: ["connecting with lyrical content", "focusing on the message in the music", "appreciating the power of words in songs"] },
      veryLow: { messages: ["all about that vocal performance", "hanging on every word", "connecting deeply with lyrics"] },
    },
    liveness: {
      veryHigh: { messages: ["feeling like you're at a live concert", "feeding off the energy of a crowd", "experiencing the thrill of live performance"] },
      high: { messages: ["enjoying that live performance energy", "feeling connected to the artists", "appreciating the rawness of live music"] },
      medium: { messages: ["balancing studio polish with live energy", "enjoying a mix of live and produced tracks", "appreciating different recording styles"] },
      low: { messages: ["leaning towards polished productions", "enjoying the precision of studio recordings", "appreciating carefully crafted tracks"] },
      veryLow: { messages: ["all about that crisp studio sound", "enjoying meticulously produced music", "appreciating audio perfection"] },
    },
    speechiness: {
      veryHigh: { messages: ["focusing on spoken word and rap", "connecting with lyrical flow", "appreciating the power of the spoken word"] },
      high: { messages: ["enjoying lyric-heavy tracks", "paying attention to the message", "connecting with wordsmiths"] },
      medium: { messages: ["balancing lyrics and instrumentals", "enjoying a mix of words and music", "appreciating both verbal and musical expression"] },
      low: { messages: ["leaning towards less wordy tracks", "letting the music speak for itself", "enjoying subtle lyrical touches"] },
      veryLow: { messages: ["mostly vibing to instrumentals", "letting the music tell the story", "connecting with wordless melodies"] },
    },
  };

  const getRandomMessage = (messages: string[]) => {
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const valenceLevel = getLevel(scores.valence);
  const danceLevel = getLevel(scores.danceability);
  const energyLevel = getLevel(scores.energy);

  let summary = `You're ${getRandomMessage(vibeMap.valence[valenceLevel].messages)}. `;
  summary += `This playlists energy is ${getRandomMessage(vibeMap.danceability[danceLevel].messages)}. `;
  summary += `and ${getRandomMessage(vibeMap.energy[energyLevel].messages)}. `;

  // Add messages for other features if they're particularly high or low
  if (scores.acousticness > thresholds.medium) {
    const acousticLevel = getLevel(scores.acousticness);
    summary += `You're ${getRandomMessage(vibeMap.acousticness[acousticLevel].messages)}. `;
  }

  if (scores.instrumentalness > thresholds.medium) {
    const instrumentalLevel = getLevel(scores.instrumentalness);
    summary += `You're ${getRandomMessage(vibeMap.instrumentalness[instrumentalLevel].messages)}. `;
  }

  if (scores.liveness > thresholds.medium) {
    const liveLevel = getLevel(scores.liveness);
    summary += `You're ${getRandomMessage(vibeMap.liveness[liveLevel].messages)}. `;
  }

  if (scores.speechiness > thresholds.medium) {
    const speechLevel = getLevel(scores.speechiness);
    summary += `You're ${getRandomMessage(vibeMap.speechiness[speechLevel].messages)}. `;
  }

  const determineAnimal = (scores: AudioFeatures) => {
    const animals = [
      { emoji: "🐌", name: "Snail" },
      { emoji: "🐢", name: "Turtle" },
      { emoji: "🦥", name: "Sloth" },
      { emoji: "🐨", name: "Koala" },
      { emoji: "🐈", name: "Cat" },
      { emoji: "🦊", name: "Fox" },
      { emoji: "🐒", name: "Monkey" },
      { emoji: "🐆", name: "Cheetah" },
      { emoji: "🦄", name: "Unicorn" },
    ];

    // Calculate individual feature scores
    const energyScore = scores.energy * 2;  // 0-2
    const danceScore = scores.danceability * 2;  // 0-2
    const valenceScore = scores.valence * 2;  // 0-2
    const acousticScore = (1 - scores.acousticness) * 1;  // 0-1 (inverted)
    const livenessScore = scores.liveness * 1;  // 0-1
    
    // Combine scores
    const totalScore = energyScore + danceScore + valenceScore + acousticScore + livenessScore;
    // Max possible score is 8 (2 + 2 + 2 + 1 + 1)
    
    // Map total score to animal index
    const animalIndex = Math.floor((totalScore / 8) * animals.length);
    
    // Ensure index is within bounds
    return animals[Math.min(animalIndex, animals.length - 1)];
  };

  const animal = determineAnimal(scores);

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
    // speechiness: "Vocals",
    acousticness: "Acoustic",
    instrumentalness: "Instrumental",
    // liveness: "Live Concert",
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