import React, { useState } from 'react';
import { ComposerComponentProps, FeedComponentProps } from './types';
import { Box, TextField, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { motion } from 'framer-motion';

const useStyles = makeStyles({
  field: {
    [`& fieldset`]: {
      borderRadius: 0,
      border: 'none',
    },
    '& .MuiInputBase-input': {
      color: '#333',
    },
    '& .MuiInputBase-input::placeholder': {
      color: '#aaa',
      opacity: 0.5,
    },
  },
});

const haikus = {
  joy: "Joy blossoms like spring\nSunshine dances on the leaves\nHeart's light whispers soft",
  sadness: "Gray clouds veil the sky\nRaindrops trace paths on the glass\nLoneliness speaks low",
  anger: "Storm winds rage and roar\nFury burns in darkened skies\nLightning strikes the earth",
  peace: "Quiet river flows\nStillness wraps around the soul\nCalm breathes in the air",
};

export const HaikuraComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [mood, setMood] = useState<string>('');
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [userHaiku, setUserHaiku] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const classes = useStyles();

  const triggerErrorAnimation = () => {
    setShowError(false);
    setTimeout(() => {
      setShowError(true);
    }, 10);
  };

  const generateHaiku = () => {
    if (!mood) return;
    setLoading(true);
    setError('');

    // Find the haiku based on the mood
    const generatedHaiku = haikus[mood.toLowerCase() as keyof typeof haikus];

    if (generatedHaiku) {
      const lines = generatedHaiku.split('\n');
      setUserHaiku(generatedHaiku);
      setDisplayedLines([]);

      // Display each line with a delay
      lines.forEach((line, index) => {
        setTimeout(() => {
          setDisplayedLines(prevLines => [...prevLines, line]);
        }, index * 1000); // 1-second delay between lines
      });
    } else {
      setError('No Haiku could be generated for this mood.');
      triggerErrorAnimation();
    }

    setLoading(false);
  };

  const handlePost = async () => {
    setLoading(true);
    setError('');

    try {
      model.data['userHaiku'] = userHaiku;
      done(model);
    } catch (err) {
      setError('An error occurred while posting your Haiku.');
      triggerErrorAnimation();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex bg-[#f8f0f2] flex-col items-center overflow-y-hidden">
      <div className="w-full h-full flex flex-col mt-6 items-center justify-center">
        {!loading ? (
          <>
            <h2 className="text-3xl font-serif mb-4 text-[#c0a8a8]">Create Your Haiku</h2>
            <TextField
              type="text"
              placeholder="Enter your mood..."
              fullWidth
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className={`${classes.field} mb-4`}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={generateHaiku}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Haiku'}
            </Button>
            {error && (
              <motion.div
                animate={{ opacity: showError ? [0.2, 1, 0.2, 1] : 1 }}
                transition={{ duration: 0.8, repeat: 0 }}
                className="mt-2 text-red-500"
              >
                {error}
              </motion.div>
            )}
            {displayedLines.length > 0 && (
              <>
                {displayedLines.map((line, index) => (
                  <p key={index} className="text-xl font-serif">{line}</p>
                ))}
                <textarea
                  className="w-full p-4 border rounded-lg mt-4"
                  placeholder="Edit your Haiku here..."
                  value={userHaiku}
                  onChange={(e) => setUserHaiku(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handlePost}
                  disabled={loading}
                  className="mt-4"
                >
                  {loading ? 'Posting...' : 'Post Haiku'}
                </Button>
              </>
            )}
          </>
        ) : (
          <h2 className="text-2xl font-serif">Generating your Haiku...</h2>
        )}
      </div>
    </div>
  );
};

export const HaikuraFeedComponent = ({ model }: FeedComponentProps) => {
  const userHaiku = model.data['userHaiku'] || 'No Haiku available.';
  
  return (
    <div className="w-full h-full flex bg-[#f8f0f2] flex-col items-center overflow-y-hidden">
      <div className="w-full h-full flex flex-col mt-6 items-center justify-center">
        <h2 className="text-3xl font-serif mb-4 text-[#c0a8a8]">Your Generated Haiku</h2>
        <div className="p-4 border rounded-lg bg-white shadow-md">
          <p className="text-xl font-serif">{userHaiku}</p>
        </div>
      </div>
    </div>
  );
};
