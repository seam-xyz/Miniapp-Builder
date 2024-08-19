import React, { useState } from 'react';
import { ComposerComponentProps, FeedComponentProps } from './types';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { motion } from 'framer-motion';
import backgroundGif from '../blocks/assets/Haikura/sakura.gif';

const useStyles = makeStyles({
  field: {
    '& fieldset': {
      borderRadius: '12px',
      border: 'none',
    },
    '& .MuiInputBase-input': {
      color: '#444',
      padding: '8px',
      fontSize: '1rem',
    },
    '& .MuiInputBase-input::placeholder': {
      color: '#888',
      opacity: 0.8,
    },
  },
  button: {
    backgroundColor: '#ff4081',
    color: '#fff',
    fontSize: '1.2rem',
    padding: '10px 20px',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: '#ff6699',
    },
  },
  dropdown: {
    width: '100%',
    marginBottom: '16px',
    backgroundColor: '#fff0f6',
    borderRadius: '8px',
    fontSize: '1.2rem',
    padding: '8px',
  },
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'hidden',
    backgroundImage: `url(${backgroundGif})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    paddingTop: '2rem',
  },
  title: {
    fontSize: '3rem',
    fontFamily: 'serif',
    marginBottom: '1rem',
    color: '#D86771',
    textAlign: 'center',
    width: '70%',
    paddingTop: '2rem',
    fontStyle: 'italic',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)', // Optional: Add text shadow for better readability
  },
  haikuContainer: {
    padding: '1rem',
    border: '2px solid #F2C2C2',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '80%',
    margin: '1rem',
  },
  haikuText: {
    fontSize: '1.5rem',
    color: '#fff',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    textAlign: 'center',
    maxWidth: '80%',
    margin: '1rem',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)', 
  },
});

const haikus = {
  joy: [
    "Joy blossoms like spring 🌸\nSunshine dances on the leaves ☀️\nHeart's light whispers soft 💖",
    "Laughter fills the air 🎉\nButterflies in summer breeze 🦋\nColors bright and warm 🌈",
    "Morning dew so fresh ☀️\nFlowers bloom with gentle grace 🌸\nSunrise paints the sky 🌅",
    "Gleaming moonlit night 🌕\nStars whisper ancient secrets ⭐\nPeace in every heart 🕊️"
  ],
  sadness: [
    "Gray clouds veil the sky ☁️\nRaindrops trace paths on glass 💧\nLoneliness speaks low 🥀",
    "Echoes in the dark 🕯️\nSilent tears fall one by one 💧\nHeart feels the cold chill ❄️",
    "Winter's icy breath 🌨️\nSnow blankets the world in white ❄️\nSolitude remains 🌨️",
    "Faded autumn leaves 🍂\nWhispers of a fleeting past 🍂\nMelancholy song 🎵"
  ],
  anger: [
    "Storm winds rage and roar 🌪️\nFury burns in darkened skies ⚡\nLightning strikes the earth 🔥",
    "Crimson skies aflame 🔥\nThunder echoes through the void 🌩️\nWrath consumes the night 🌑",
    "Raging sea and storm 🌊\nWaves crash in chaotic dance 🌪️\nAnger’s wild embrace 🌫️",
    "Flames of fury rise 🔥\nTornadoes spin in fierce rage 🌪️\nChaos reigns supreme 🔥"
  ],
  peace: [
    "Quiet river flows 🌊\nStillness wraps around the soul 🌿\nCalm breathes in the air 🕊️",
    "Gentle breeze through pines 🍃\nWhispers of the ancient trees 🌲\nSerenity reigns 🌈",
    "Moonlight bathes the earth 🌕\nSoft lullabies of night’s calm 🌌\nTranquility’s embrace 🌙",
    "Meadow's gentle touch 🌾\nButterflies dance in the sun 🌞\nPeaceful heart at rest 🌼"
  ],
};

const asciiArt = {
  joy: `😊😊😊\n😊😊😊\n 😊😊\n  😊`,
  sadness: `😢😢😢\n 😢😢\n 😢`,
  anger: `😠😠😠😠\n😠😠😠\n 😠😠\n  😠`,
  peace: `😌😌😌\n 😌😌\n  😌`,
};

const spiritAnimals = [
  { month: '1', emoji: '🦁', name: 'Shishi' }, 
  { month: '2', emoji: '🐉', name: 'Ryū' }, 
  { month: '3', emoji: '🦊', name: 'Koi' }, 
  { month: '4', emoji: '🐦', name: 'Tori' },
  { month: '5', emoji: '🐢', name: 'Kame' }, 
  { month: '6', emoji: '🐬', name: 'Iruka' }, 
  { month: '7', emoji: '🐯', name: 'Tora' }, 
  { month: '8', emoji: '🦅', name: 'Washi' }, 
  { month: '9', emoji: '🐍', name: 'Hebi' }, 
  { month: '10', emoji: '🐺', name: 'Okami' }, 
  { month: '11', emoji: '🦅', name: 'Washi' }, 
  { month: '12', emoji: '🐼', name: 'Panda' }, 
];

export const HaikuraComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [birthMonth, setBirthMonth] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const [spiritAnimal, setSpiritAnimal] = useState<string>('');
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [userHaiku, setUserHaiku] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const [haikuGenerated, setHaikuGenerated] = useState<boolean>(false); 
  const classes = useStyles();

  const triggerErrorAnimation = () => {
    setShowError(false);
    setTimeout(() => {
      setShowError(true);
    }, 10);
  };

  const generateSpiritAnimal = (birthMonth: string) => {
    const animal = spiritAnimals.find((item) => item.month === birthMonth);
    return animal ? animal.emoji : '🐾';
  };

  const getRandomHaiku = (mood: string) => {
    const haikuList = haikus[mood.toLowerCase() as keyof typeof haikus];
    return haikuList[Math.floor(Math.random() * haikuList.length)];
  };

  const generateHaiku = () => {
    if (!mood || !birthMonth) {
      setError('Please enter your birth month and mood.');
      triggerErrorAnimation();
      return;
    }
    setLoading(true);
    setError('');
    setHaikuGenerated(true); // Set haikuGenerated to true immediately after clicking

    const generatedHaiku = getRandomHaiku(mood);
    const generatedArt = asciiArt[mood.toLowerCase() as keyof typeof asciiArt];   
    const spirit = generateSpiritAnimal(birthMonth);

    setSpiritAnimal(spirit);

    if (generatedHaiku) {
      const lines = generatedHaiku.split('\n');
      setUserHaiku(generatedHaiku);
      setDisplayedLines([`${spirit} Your Spirit Animal: ${spirit} (${spiritAnimals.find(item => item.month === birthMonth)?.name})\n`, generatedArt]);

      lines.forEach((line, index) => {
        setTimeout(() => {
          setDisplayedLines((prevLines) => [...prevLines, line]);
        }, index * 1000);
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
      model.data['spiritAnimal'] = spiritAnimal;
      model.data['spiritAnimalName'] = spiritAnimals.find(item => item.month === birthMonth)?.name || 'Unknown';
      model.data['asciiArt'] = asciiArt[mood.toLowerCase() as keyof typeof asciiArt];
      done(model);
    } catch (err) {
      setError('An error occurred while posting your Haiku.');
      triggerErrorAnimation();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center overflow-y-hidden"
      style={{
        backgroundImage: `url(${backgroundGif})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
    <div className="w-full h-full flex flex-col items-center justify-center" style={{ paddingTop: '2rem' }}>
    <h1
  className="mb-4"
  style={{width: '70%',textAlign: 'center',fontStyle: 'normtal',fontFamily: "'Sawarabi Mincho', serif",color: '#F0E4D7',textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',fontSize: '3rem',}}
>Haikura - Create your Haiku and share!
</h1>
        {!loading ? (
          <>
            <TextField
              type="text"
              placeholder="Birth Month (1-12)"
              fullWidth
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
              className={`${classes.field} mb-4`}
              style={{ backgroundColor: '#fff0f6', borderRadius: '12px', fontSize: '1.2rem', width: '80%' }}
            />
            <FormControl fullWidth className="mb-4" style={{ width: '80%' }}>
              <InputLabel id="mood-select-label" className={classes.dropdown}>How are you feeling today?</InputLabel>
              <Select
                labelId="mood-select-label"
                value={mood}
                onChange={(e) => setMood(e.target.value as string)}
                className={classes.dropdown}
              >
                <MenuItem value="joy">Happy</MenuItem>
                <MenuItem value="sadness">Sad</MenuItem>
                <MenuItem value="anger">Angry</MenuItem>
                <MenuItem value="peace">Peaceful</MenuItem>
              </Select>
            </FormControl>
            {!haikuGenerated && (
              <Button
                variant="contained"
                onClick={generateHaiku}
                disabled={loading}
                className={`${classes.button} mt-4`}
              >
                {loading ? 'Generating...' : '🌸 Generate Haiku'}
              </Button>
            )}
            {error && (
              <motion.div
                animate={{ opacity: showError ? [0.2, 1, 0.2, 1] : 1 }}
                transition={{ duration: 0.8, repeat: 0 }}
                className="mt-2 text-red-500"
                style={{ fontSize: '1.2rem' }}
              >
                {error}
              </motion.div>
            )}
            {displayedLines.length > 0 && (
              <>
                {displayedLines.map((line, index) => (
                  <motion.p
                    key={index}
                    className="text-3xl font-mono whitespace-pre text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    {line}
                  </motion.p>
                ))}
                <Button
                  variant="contained"
                  onClick={handlePost}
                  disabled={loading}
                  className={`${classes.button} mt-4`}
                >
                  {loading ? 'Posting...' : '📤 Post Haiku'}
                </Button>
              </>
            )}
          </>
        ) : (
          <h2 className="text-3xl font-serif">Generating your Haiku... 🌱</h2>
        )}
      </div>
    </div>
  );
};

export const HaikuraFeedComponent = ({ model }: FeedComponentProps) => {
  const classes = useStyles();
  const userHaiku = model.data['userHaiku'] || '';
  const spiritAnimal = model.data['spiritAnimal'] || '🐾';
  const spiritAnimalName = model.data['spiritAnimalName'] || 'Unknown';
  const asciiArt = model.data['asciiArt'] || '';

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Here's your Haiku! 🌟</h1>
      <p className={classes.haikuText}>
        {`${spiritAnimal} Your Spirit Animal: ${spiritAnimal} (${spiritAnimalName})\n`}
        {asciiArt.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        {userHaiku}
      </p>
    </div>
  );
};
