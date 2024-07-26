import { ComposerComponentProps, FeedComponentProps } from './types';
import React, { useState } from 'react';
import { Box, TextField, Typography, Divider, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SeamSaveButton from '../components/SeamSaveButton';

export const WordleFeedComponent = ({ model }: FeedComponentProps) => {
  const { results, wordleDay } = model.data;

  // Convert wordleDay to a number if it exists
  const wordleDayNumber = wordleDay !== undefined ? Number(wordleDay) : undefined;
  const displayWordleDay = wordleDayNumber !== undefined && wordleDayNumber >= 16 ? `#${wordleDayNumber}` : '';

  return (
    <Box className="flex flex-col h-auto justify-between items-center w-full">
      <Box className="mt-1 w-full flex items-center justify-center flex-col">
        <Typography variant="h4" component="h2">
          SEAMDLE {displayWordleDay}
        </Typography>
        <Divider className="w-full mt-1" />
      </Box>
      <Box className="flex flex-1 items-center justify-center w-full">
        <WordleResults results={results} />
      </Box>
    </Box>
  );
}

export const WordleComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const handleSave = (results: any, wordleDay: any) => {
    model.data.results = results;
    model.data.wordleDay = wordleDay;
    done(model);
  };

  // Reset the miniapp state each time renderEditModal is run
  return <WordleEditor initialResults={[]} onSave={handleSave} />;
}

const WORDS = [
  'WHICH', 'THERE', 'THEIR', 'ABOUT', 'WOULD', 'THESE', 'OTHER', 'WORDS', 'COULD', 'WRITE', 'FIRST', 'WATER', 'AFTER', 'WHERE', 'RIGHT', 'THINK', 'THREE', 'YEARS', 'PLACE', 'SOUND', 'GREAT', 'AGAIN', 'STILL', 'EVERY', 'SMALL', 'FOUND', 'THOSE', 'NEVER', 'UNDER',
  'MIGHT', 'WHILE', 'HOUSE', 'WORLD', 'BELOW', 'ASKED', 'GOING', 'LARGE', 'UNTIL', 'ALONG', 'SHALL', 'BEING', 'OFTEN', 'EARTH', 'BEGAN', 'SINCE', 'STUDY', 'NIGHT', 'LIGHT', 'ABOVE', 'PAPER', 'PARTS', 'YOUNG', 'STORY', 'POINT', 'TIMES', 'HEARD', 'WHOLE', 'WHITE', 'GIVEN',
  'MEANS', 'MUSIC', 'MILES', 'THING', 'TODAY', 'LATER', 'USING', 'MONEY', 'LINES', 'ORDER', 'GROUP', 'AMONG', 'LEARN', 'KNOWN', 'SPACE', 'TABLE', 'EARLY', 'TREES', 'SHORT', 'HANDS', 'STATE', 'BLACK', 'SHOWN', 'STOOD', 'FRONT', 'VOICE', 'KINDS', 'MAKES', 'COMES', 'CLOSE',
  'POWER', 'LIVED', 'VOWEL', 'TAKEN', 'BUILT', 'HEART', 'READY', 'QUITE', 'CLASS', 'BRING', 'ROUND', 'HORSE', 'SHOWS', 'PIECE', 'GREEN', 'STAND', 'BIRDS', 'START', 'RIVER', 'TRIED', 'LEAST', 'FIELD', 'WHOSE', 'GIRLS', 'LEAVE', 'ADDED', 'COLOR', 'THIRD', 'HOURS', 'MOVED',
  'PLANT', 'DOING', 'NAMES', 'FORMS', 'HEAVY', 'IDEAS', 'CRIED', 'CHECK', 'FLOOR', 'BEGIN', 'WOMAN', 'ALONE', 'PLANE', 'SPELL', 'WATCH', 'CARRY', 'WROTE', 'CLEAR', 'NAMED', 'BOOKS', 'CHILD', 'GLASS', 'HUMAN', 'TAKES', 'PARTY', 'BUILD', 'SEEMS', 'BLOOD', 'SIDES', 'SEVEN',
  'MOUTH', 'SOLVE', 'NORTH', 'VALUE', 'DEATH', 'MAYBE', 'HAPPY', 'TELLS', 'GIVES', 'LOOKS', 'SHAPE', 'LIVES', 'STEPS', 'AREAS', 'SENSE', 'SPEAK', 'FORCE', 'OCEAN', 'SPEED', 'WOMEN', 'METAL', 'SOUTH', 'GRASS', 'SCALE', 'CELLS', 'LOWER', 'SLEEP', 'WRONG', 'PAGES', 'SHIPS',
  'NEEDS', 'ROCKS', 'EIGHT', 'MAJOR', 'LEVEL', 'TOTAL', 'AHEAD', 'REACH', 'STARS', 'STORE', 'SIGHT', 'TERMS', 'CATCH', 'WORKS', 'BOARD', 'COVER', 'SONGS', 'EQUAL', 'STONE', 'WAVES', 'GUESS', 'DANCE', 'SPOKE', 'BREAK', 'CAUSE', 'RADIO', 'WEEKS', 'LANDS', 'BASIC', 'LIKED',
  'TRADE', 'FRESH', 'FINAL', 'FIGHT', 'MEANT', 'DRIVE', 'SPENT', 'LOCAL', 'WAXES', 'KNOWS', 'TRAIN', 'BREAD', 'HOMES', 'TEETH', 'COAST', 'THICK', 'BROWN', 'CLEAN', 'QUIET', 'SUGAR', 'FACTS', 'STEEL', 'FORTH', 'RULES', 'NOTES', 'UNITS', 'PEACE', 'MONTH', 'VERBS', 'SEEDS',
  'HELPS', 'SHARP', 'VISIT', 'WOODS', 'CHIEF', 'WALLS', 'CROSS', 'WINGS', 'GROWN', 'CASES', 'FOODS', 'CROPS', 'FRUIT', 'STICK', 'WANTS', 'STAGE', 'SHEEP', 'NOUNS', 'PLAIN', 'DRINK', 'BONES', 'APART', 'TURNS', 'MOVES', 'TOUCH', 'ANGLE', 'BASED', 'RANGE', 'MARKS', 'TIRED',
  'OLDER', 'FARMS', 'SPEND', 'SHOES', 'GOODS', 'CHAIR', 'TWICE', 'CENTS', 'EMPTY', 'ALIKE', 'STYLE', 'BROKE', 'PAIRS', 'COUNT', 'ENJOY', 'SCORE', 'SHORE', 'ROOTS', 'PAINT', 'HEADS', 'SHOOK', 'SERVE', 'ANGRY', 'CROWD', 'WHEEL', 'QUICK', 'DRESS', 'SHARE', 'ALIVE', 'NOISE',
  'SOLID', 'CLOTH', 'SIGNS', 'HILLS', 'TYPES', 'DRAWN', 'WORTH', 'TRUCK', 'PIANO', 'UPPER', 'LOVED', 'USUAL', 'FACES', 'DROVE', 'CABIN', 'BOATS', 'TOWNS', 'PROUD', 'COURT', 'MODEL', 'PRIME', 'FIFTY', 'PLANS', 'YARDS', 'PROVE', 'TOOLS', 'PRICE', 'SHEET', 'SMELL', 'BOXES',
  'RAISE', 'MATCH', 'TRUTH', 'ROADS', 'THREW', 'ENEMY', 'LUNCH', 'CHART', 'SCENE', 'GRAPH', 'DOUBT', 'GUIDE', 'WINDS', 'BLOCK', 'GRAIN', 'SMOKE', 'MIXED', 'GAMES', 'WAGON', 'SWEET', 'TOPIC', 'EXTRA', 'PLATE', 'TITLE', 'KNIFE', 'FENCE', 'FALLS', 'CLOUD', 'WHEAT', 'PLAYS',
  'ENTER', 'BROAD', 'STEAM', 'ATOMS', 'PRESS'
];

const getDayOfYear = (date: Date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

const getWordleDay = () => {
  const startDate = new Date(2024, 4, 15); // May 15th, 2024
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getTodaysWord = () => {
  const dayOfYear = getDayOfYear(new Date());
  return WORDS[dayOfYear % WORDS.length];
};

const WordleResults = ({ results }: { results: any }) => {
  return (
    <div className="flex flex-col items-center w-full mt-2">
      {results.map((row: string, index: number) => (
        <div key={index} className="flex">
          {row.split('').map((char: string, idx: number) => (
            <div
              key={idx}
              className="w-10 h-10 m-1"
              style={{
                backgroundColor: char === 'G' ? '#6aaa64' : char === 'Y' ? '#c9b458' : '#787c7e',
              }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

const LetterBlock = ({ char, bgColor }: { char: string; bgColor: string }) => (
  <div
    className="w-10 h-10 m-1 flex justify-center items-center text-white text-xl font-bold"
    style={{ backgroundColor: bgColor }}
  >
    {char}
  </div>
);

const WordleEditor = ({
  initialResults,
  onSave
}: {
  initialResults: any;
  onSave: (results: any, wordleDay: any) => void;
}) => {
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [results, setResults] = useState<any>(initialResults);
  const [error, setError] = useState<string>('');

  const targetWord = getTodaysWord();
  const wordleDay = getWordleDay();

  const handleGuessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newGuess = event.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    setCurrentGuess(newGuess);
  };

  const handleGuessSubmit = () => {
    setError('');

    if (currentGuess.length !== targetWord.length) {
      setError(`Guess must be ${targetWord.length} letters long`);
      return;
    }

    if (results.length >= 6) {
      setError(`You have run out of guesses. The word for today was: ${targetWord}`);
      return;
    }

    const targetWordArr = targetWord.split('');
    const currentGuessArr = currentGuess.split('');
    const letterCount: { [key: string]: number } = {};

    targetWordArr.forEach((char) => {
      letterCount[char] = (letterCount[char] || 0) + 1;
    });

    const resultRow = currentGuessArr.map((char, index) => {
      if (char === targetWordArr[index]) {
        letterCount[char]--;
        return { char, bgColor: '#6aaa64' }; // green
      }
      return { char, bgColor: '#787c7e' }; // grey (default)
    });

    resultRow.forEach((item, index) => {
      if (item.bgColor === '#787c7e' && letterCount[item.char] > 0 && targetWordArr.includes(item.char)) {
        letterCount[item.char]--;
        resultRow[index] = { char: item.char, bgColor: '#c9b458' }; // yellow
      }
    });

    setResults([...results, resultRow]);
    setCurrentGuess('');

    if (currentGuess === targetWord) {
      setError('Congratulations! You guessed the word.');
    } else if (results.length + 1 >= 6) {
      setError(`You have run out of guesses. The word for today was: ${targetWord}`);
    }
  };

  const handleCopyResults = () => {
    const resultText = `Seamdle Day ${wordleDay} Attempt ${results.length}/6\n` + results
      .map((row: any[]) =>
        row
          .map((item: any) => {
            if (item.bgColor === '#6aaa64') return '🟩';
            if (item.bgColor === '#c9b458') return '🟨';
            return '⬛';
          })
          .join('')
      )
      .join('\n');
    
    navigator.clipboard.writeText(resultText).then(() => {
      alert('Results copied to clipboard!');
    });
    
    handleSave();
  };

  const handleSave = () => {
    onSave(
      results.map((row: any[]) =>
        row
          .map((item: any) => {
            if (item.bgColor === '#6aaa64') return 'G';
            if (item.bgColor === '#c9b458') return 'Y';
            return 'B';
          })
          .join('')
      ),
      wordleDay
    );
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleGuessSubmit();
    }
  };

  const isGameOver = results.length >= 6 || results.some((row: any[]) => row.every((item: any) => item.bgColor === '#6aaa64'));

  return (
    <Box component="form" className="flex flex-col h-full justify-between items-center w-full">
      <Box className="mt-2 w-full flex items-center justify-center flex-col">
        <Typography variant="h4" component="h2" className="mb-2">
          SEAMDLE #{wordleDay}
        </Typography>
        <Divider className="w-full mb-2" />
      </Box>
      <Box className="flex flex-1 items-center justify-center flex-col w-full">
        {results.map((row: any, index: any) => (
          <div key={index} className="flex">
            {row.map((item: any, idx: any) => (
              <LetterBlock key={idx} char={item.char} bgColor={item.bgColor} />
            ))}
          </div>
        ))}
      </Box>
      <Box className="mb-2 w-full flex flex-col items-center">
        <Typography color="error" className="mt-2">{error}</Typography>
        {!isGameOver && (
          <Box className="flex items-center w-full">
            <TextField
              value={currentGuess}
              onChange={handleGuessChange}
              onKeyPress={handleKeyPress}
              variant="outlined"
              margin="normal"
              placeholder="Enter your guess"
              fullWidth
            />
            <IconButton onClick={handleGuessSubmit}>
              <SendIcon />
            </IconButton>
          </Box>
        )}
        {isGameOver && (
          <SeamSaveButton onClick={handleCopyResults} />
        )}
      </Box>
    </Box>
  );
};