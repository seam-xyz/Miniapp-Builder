import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types';
import map from "./assets/GoBig/home.png"
import homebtn from "./assets/GoBig/home-btn.png"
import wheelImage from "./assets/GoBig/wheels.png"
import one from "./assets/GoBig/Cards/card-clubs-1.png"
import two from "./assets/GoBig/Cards/card-hearts-2.png"
import three from "./assets/GoBig/Cards/card-diamonds-3.png"
import four from "./assets/GoBig/Cards/card-spades-4.png"
import five from "./assets/GoBig/Cards/card-clubs-5.png"
import six from "./assets/GoBig/Cards/card-hearts-6.png"
import seven from "./assets/GoBig/Cards/card-diamonds-7.png"
import eight from "./assets/GoBig/Cards/card-spades-8.png"
import nine from "./assets/GoBig/Cards/card-clubs-9.png"
import ten from "./assets/GoBig/Cards/card-hearts-10.png"
import jack from "./assets/GoBig/Cards/card-diamonds-11.png"
import queen from "./assets/GoBig/Cards/card-spades-12.png"
import king from "./assets/GoBig/Cards/card-diamonds-13.png"
import diceone from "./assets/GoBig/dice/1.png"
import dicetwo from "./assets/GoBig/dice/2.png"
import dicethree from "./assets/GoBig/dice/3.png"
import dicefour from "./assets/GoBig/dice/4.png"
import dicefive from "./assets/GoBig/dice/5.png"
import dicesix from "./assets/GoBig/dice/6.png"
import banner from "./assets/GoBig/banner.png"
import back from './assets/GoBig/back.png'
import roulette from './assets/GoBig/roulette.png'
import result from './assets/GoBig/resultbg.png'

import { useState } from 'react';
export const GoFeedComponent = ({ model }: FeedComponentProps) => {
  const score = model.data.token;
  return (
<div style={{height: '600px'}}>
  <img src={result} alt="result-bg" className="w-full" />
  <h1
        style={{ fontSize: '150px' }}
    className="absolute inset-0 flex items-center justify-center text-sky-100 underline"
  >
    {score}
  </h1>
</div>

  );
}


export const GoComposerComponent = ({ model, done }: ComposerComponentProps) => {
  // Mini game handler/starter
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const handleGameClick = (game: string) => {
    setActiveGame(game);
  };
  const closeGame = () => {
    setActiveGame(null);
  };

  // Bet handling
  type BetType = 'odd' | 'even' | 'double' | 'x2' | 'x4' | 'x8' | 'color' | 'mx2' | "mx4";
  interface Bet {
    type: BetType;
    value: number | string;
    amount: number; // bet amount
  }
  const [token, setToken] = useState<number>(7);
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [bet, setBet] = useState<Bet>({
    type: 'odd',
    value: '',
    amount: 0,
  });

  const handleAmountChange = (amount: number) => {
    if (amount <= token && amount >= 1) {
      const difference = amount - bet.amount;
      setToken(token - difference);
      setBet({
        ...bet,
        amount: amount,
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent any key input other than the arrow keys
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
      event.preventDefault();
    }
  };

  const handleArrowKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(event.target.value, 10);
    handleAmountChange(amount);
  };

  const handleBetTypeChange = (newType: BetType) => {
    setBet((prevBet) => ({
      ...prevBet,
      type: newType,
    }));
    setSelectedBet(newType);
  };

  // Card images
  const cardImages: { [key: string]: string } = {
    '2': two,
    '3': three,
    '4': four,
    '5': five,
    '6': six,
    '7': seven,
    '8': eight,
    '9': nine,
    '10': ten,
    'J': jack,
    'Q': queen,
    'K': king,
    'A': one,
  };

  // Card ranks
  const cardRanks: { [key: string]: number } = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 1
  };

  // Initializing the deck
  const initializeDeck = () => {
    const values = Object.keys(cardRanks);
    const deck: string[] = [];

    for (const value of values) {
      for (let i = 0; i < 4; i++) { // Four suits, but suits are not used in matching
        deck.push(value);
      }
    }

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
  };




  // Matching card game
  const [deck, setDeck] = useState<string[]>(initializeDeck());
  const [playerCardHistory, setPlayerCardHistory] = useState<string[]>([]);
  const [dealerCardHistory, setDealerCardHistory] = useState<string[]>([]);
  const [playerDraws, setPlayerDraws] = useState<number>(0);
  const [dealerDraws, setDealerDraws] = useState<number>(0);
  const [winner, setWinner] = useState<string>('');
  const [matchGameOver, setMatchGameOver] = useState<boolean>(false);

  const checkForMatch = (hand: string[]) => {
    const ranks = new Set(hand.map(card => card));
    return ranks.size < hand.length;
  };

  const playTurn = (isPlayerTurn: boolean) => {
    let winAmount = 0;
    if (deck.length === 0) {
      setWinner('No more cards in the deck!');
      return;
    }
    const newCard = deck.shift()!;
    if (isPlayerTurn) {
      setPlayerCardHistory(prev => [...prev, newCard]);
      setPlayerDraws(prev => prev + 1);
      if (checkForMatch([...playerCardHistory, newCard])) {
        const multiplier = prizeMultipliers[bet.type] || 1;
        winAmount = bet.amount * multiplier;
        setWinner(`Player Wins! You won ${winAmount}`);
        setToken(prevToken => prevToken + winAmount);
        setMatchGameOver(true);
      }
    } else {
      setDealerCardHistory(prev => [...prev, newCard]);
      setDealerDraws(prev => prev + 1);
      if (checkForMatch([...dealerCardHistory, newCard])) {
        setWinner(`Dealer Wins! You lost ${bet.amount}`);
        setMatchGameOver(true);
      }
    }
    if (deck.length === 0 && !winner) {
      setWinner('No more cards in the deck!');
      setMatchGameOver(true);
    }
  };

  const handlePlayMatch = () => {
    if (!winner) {
      if (playerDraws === dealerDraws || dealerDraws > playerDraws) {
        playTurn(true);
      } else {
        playTurn(false);
      }
    }
  };



  // Higher card game
  const [playerCard, setPlayerCard] = useState<string | null>(null);
  const [dealerCard, setDealerCard] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [turn, setTurn] = useState<'dealer' | 'player'>('dealer'); // Track whose turn it is
  const [gameOver, setGameOver] = useState<boolean>(false);

  const drawCards = () => {
    if (gameOver) return;
    if (deck.length < 2) {
      setResult('Not enough cards in the deck!');
      return;
    }
    if (turn === 'dealer') {
      const dealerDrawnCard = deck.shift()!;
      setDealerCard(dealerDrawnCard);
      setTurn('player');
    } else {
      const playerDrawnCard = deck.shift()!;
      setPlayerCard(playerDrawnCard);
      setTurn('dealer');

      if (dealerCard) {
        const playerValue = cardRanks[playerDrawnCard];
        const dealerValue = cardRanks[dealerCard];
        let winAmount = 0;
        if (playerValue > dealerValue) {
          const multiplier = prizeMultipliers[bet.type] || 1;
          winAmount = bet.amount * multiplier;
          setResult(`Player Wins! You won ${winAmount}`);
          setToken(prevToken => prevToken + winAmount);
        } else if (dealerValue > playerValue) {
          setResult(`Dealer Wins! You lost ${bet.amount}`);
        } else {
          setResult('It\'s a Tie!');
        }
        setGameOver(true);
      }
    }
  };


  const restartGame = () => {
    initializeDeck();
    setDealerCard(null);
    setPlayerCard(null);
    setTurn('dealer');
    setResult('');
    setGameOver(false);
    setMatchGameOver(false);
    setPlayerCardHistory([]);
    setDealerCardHistory([]);
    setPlayerDraws(0);
    setDealerDraws(0);
    setWinner('');
  }

  //Spinning wheel
  const prizes = ['x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0',
    'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0',
    'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0', 'x0',
    'x2', 'x2', 'x2', 'x2', 'x2', 'x2', 'x2', 'x2', 'x2', 'x2', 'x2', 'x2',
    'x3', 'x4', 'x5', 'x6', 'x7', 'x8'];
  const prizeMultipliers: Record<string, number> = {
    x2: 2,
    x3: 3,
    x4: 4,
    x5: 5,
    x6: 6,
    x7: 7,
    x8: 8,
    mx2: 2,
    mx4: 4,
  };
  const [rotation, setRotation] = useState<number>(0);
  const [prize, setPrize] = useState<string>('');
  const [hasSpun, setHasSpun] = useState(false); 
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const getRandomResult = () => {
    const randomIndex = Math.floor(Math.random() * prizes.length);
    return prizes[randomIndex];
  };

  const spinWheel = () => {
    setIsSpinning(true);
    setHasSpun(true); 
    // Generate a random rotation degree between 0 and 360 degrees
    const newRotation = Math.floor(Math.random() * 360);
    setRotation(prevRotation => prevRotation + newRotation + 360 * 10); 
  };
  
  const stopWheel = () => {
    if (!hasSpun) return; 
    setIsSpinning(false);
    setHasSpun(false); 
  
    setRotation(prevRotation => {
      const extraRotation = prevRotation % 360; // Keep the last degree rotation
      return prevRotation + extraRotation; // Ensure it doesn't roll back
    });
  
    const selectedPrize = getRandomResult();
    if (selectedPrize !== 'x0') {
      const multiplier = prizeMultipliers[selectedPrize];
      if (multiplier) {
        setToken(prevToken => prevToken * multiplier);
      }
    }
    setPrize(`You got ${selectedPrize}!`);
  };


  //Dice game
  const diceImages: { [key: number]: string } = {
    1: diceone,
    2: dicetwo,
    3: dicethree,
    4: dicefour,
    5: dicefive,
    6: dicesix,
  };

  const [diceRolls, setDiceRolls] = useState<number[]>([1, 1]);
  const [diceResult, setDiceResult] = useState<string>('');
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [rollTimeout, setRollTimeout] = useState<NodeJS.Timeout | null>(null);

  const rollDice = () => {
    if (isRolling) return; // Prevent rolling if already rolling

    setIsRolling(true);

    // Apply shaking animation
    const shakeDuration = 1000; // Duration of shaking in milliseconds
    const shakeInterval = 100; // Interval for changing dice position
    const startTime = Date.now();

    const intervalId = setInterval(() => {
      if (Date.now() - startTime > shakeDuration) {
        clearInterval(intervalId);
        const newDiceRolls = [getRandomNumber(), getRandomNumber()];
        setDiceRolls(newDiceRolls);
        evaluateBet(newDiceRolls);
        setIsRolling(false);
      } else {
        setDiceRolls(prevRolls => [getRandomNumber(), getRandomNumber()]);
      }
    }, shakeInterval);
    setRollTimeout(intervalId);
  };

  const getRandomNumber = (): number => {
    return Math.floor(Math.random() * 6) + 1; // Generates a number between 1 and 6
  };

  const evaluateBet = (rolls: number[]) => {
    const sum = rolls[0] + rolls[1];
    const isSumOdd = sum % 2 !== 0;
    const isDouble = rolls[0] === rolls[1];

    if (bet.type === 'odd' && isSumOdd) {
      setDiceResult(`You win! Amount won: ${bet.amount * 2}`);
      setToken(prevToken => prevToken + bet.amount * 2);
    } else if (bet.type === 'even' && !isSumOdd) {
      setDiceResult(`You win! Amount won: ${bet.amount * 2}`);
      setToken(prevToken => prevToken + bet.amount * 2);
    } else if (bet.type === 'double' && isDouble) {
      setDiceResult(`You win! Amount won: ${bet.amount * 4}`);
      setToken(prevToken => prevToken + bet.amount * 2);
    } else {
      setDiceResult(`You lose! Amount lost: ${bet.amount}`);
    }
  };




  //Roulette game
  const rouletteWheel = [
    { number: 0, color: 'pink' },
    { number: 1, color: 'green' },
    { number: 2, color: 'pink' },
    { number: 3, color: 'green' },
    { number: 4, color: 'pink' },
    { number: 5, color: 'green' },
    { number: 6, color: 'pink' },
    { number: 7, color: 'green' },
    { number: 8, color: 'pink' },
    { number: 9, color: 'green' },
    { number: 10, color: 'pink' },
  ];


  const [bets, setBets] = useState<Bet[]>([]);
  const [resultRoulette, setResultRoulette] = useState<string>('');
  const [winningPocket, setWinningPocket] = useState<{ number: number, color: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const placeBet = (type: BetType, value: number | string, amount: number) => {
    if (amount > token) {
      setErrorMessage('Not enough tokens to place the bet.');
      return;
    }
    setErrorMessage('');
    setToken(prevToken => prevToken - amount); 
    setBets(prevBets => [...prevBets, { type, value, amount }]); 
  };
  
  
  const spinRoulette = () => {
    const randomIndex = Math.floor(Math.random() * rouletteWheel.length);
    const winningPocket = rouletteWheel[randomIndex];
    setWinningPocket(winningPocket);
    evaluateBets(winningPocket);
  };
  
  const evaluateBets = (winningPocket: { number: number, color: string }) => {
    let totalWinnings = 0;
  
    bets.forEach(bet => {
      switch (bet.type) {
        case 'color':
          if (bet.value === winningPocket.color) {
            totalWinnings += bet.amount * 2;
          }
          break;
        case 'odd':
          if (winningPocket.number % 2 !== 0 && winningPocket.number !== 0) {
            totalWinnings += bet.amount * 2;
          }
          break;
        case 'even':
          if (winningPocket.number % 2 === 0 && winningPocket.number !== 0) {
            totalWinnings += bet.amount * 2;
          }
          break;
        default:
          break;
      }
    });
  
    setResultRoulette(`You won ${totalWinnings}`);
    setToken(prevToken => prevToken + totalWinnings);
    setBets([]);

  };
  

  const handleSubmit = () => {
    model.data.token = (token - 7).toString();
    done(model);
  }

  return (
    <div className='m-0'>
      <div className='relative'>
        <img src={map} alt="Background" className='w-full h-auto' />
        <div className='bg-blue-500  text-bold text-lg h-12 w-12 absolute top-6 left-6 text-white flex items-center text-center justify-center rounded-full'>{token}</div>

        <button
          className='bg-transparent h-24 w-24 absolute bottom-1/2 left-20 translate-y-8'
          onClick={() => handleGameClick('Roulette')}>
        </button>
        <button
          className='bg-transparent h-36 w-36 absolute bottom-1/2 translate-y-8 right-1/3'
          onClick={() => handleGameClick('Wheels')}></button>
        <button
          className='bg-transparent h-24 w-24 absolute bottom-36 mt-6 left-16'
          onClick={() => handleGameClick('HigherGame')}></button>
        <button
          className='bg-transparent h-24 w-24 absolute bottom-24 left-1/3'
          onClick={() => handleGameClick('MatchMe')}>
        </button>
        <button
          className='bg-transparent h-24 w-32 absolute right-16 bottom-24 -translate-y-24'
          onClick={() => handleGameClick('Dice')}>
        </button>

        <img src={homebtn} onClick={handleSubmit} className='w-16 h-16 absolute bottom-6 right-6 cursor-pointer' alt='home-btn' />
      </div>

      {activeGame === 'MatchMe' && (
        <div className='absolute top-24 text-center mx-16 z-10 bg-amber-50 rounded-lg'>
          <img src={banner} alt='banner img' className='w-full h-auto mx-auto flex justify-center' />
          <div className="text-center p-4">
            <div className="mt-5">
              <button
                onClick={() => handleBetTypeChange('mx2')}
                className={`bg-rose-500 text-white py-2 px-5 m-1 rounded-md text-sm ${selectedBet === 'mx2' ? 'bg-yellow-500' : ''}`}
              >
                Bet on x2
              </button>
              <button
                onClick={() => handleBetTypeChange('mx4')}
                className={`bg-pink-500 text-white py-2 px-5 m-1 rounded-md text-sm ${selectedBet === 'mx4' ? 'bg-yellow-500' : ''}`}
              >
                Bet on x4
              </button>
            </div>
            <input
              type="number"
              value={bet.amount}
              onChange={handleArrowKeyChange}
              onKeyDown={handleKeyDown}
              min="1"
              max={token}
              step="1"
            />
            {!matchGameOver ? (
              <button onClick={handlePlayMatch} className="bg-sky-500 mx-2 text-white p-2 rounded-md" >Draw Cards</button>
            ) : (
              <button onClick={restartGame} className="bg-sky-500 mx-2 text-white p-2 rounded-md" >Restart Game</button>
            )}
            <div className="mt-4">
              <div className="mb-2">
                <p className="text-sm">P<i><b>l</b></i>ayer<i>'</i>s Card ᯓ★</p>
                <div className="flex justify-center space-x-2">
                  {playerCardHistory.map((card, index) => (
                    <img key={index} src={cardImages[card]} alt={`Player's card ${card}`} className="w-16" />
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <p className="text-sm">D<i><b>e</b></i>aler<i>'</i>s Card ᯓ★</p>
                <div className="flex justify-center space-x-2">
                  {dealerCardHistory.map((card, index) => (
                    <img key={index} src={cardImages[card]} alt={`Dealer's card ${card}`} className="w-16" />
                  ))}
                </div>
              </div>
              <div className="mt-4 text-sm">
                <p className='underline'>{winner}</p>
                <p>Player Draws: {playerDraws}</p>
                <p>Dealer Draws: {dealerDraws}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center">
            <img src={back} alt='back btn' className='w-14 h-14 cursor-pointer' onClick={closeGame} />
          </div>
        </div>
      )}

      {activeGame === 'HigherGame' && (
        <div className='absolute top-24 text-center mx-16 z-10 bg-amber-50 rounded-lg'>
          <img src={banner} alt='banner img' className='w-full h-auto mx-auto flex justify-center' />
          <div className="text-center p-4">
            <div className="mt-5">
              <button
                onClick={() => handleBetTypeChange('x2')}
                className={`bg-rose-500 text-white py-2 px-5 m-1 rounded-md text-sm ${selectedBet === 'x2' ? 'bg-yellow-500' : ''}`}
              >
                Bet on x2
              </button>
              <button
                onClick={() => handleBetTypeChange('x4')}
                className={`bg-pink-500 text-white py-2 px-5 m-1 rounded-md text-sm ${selectedBet === 'x4' ? 'bg-yellow-500' : ''}`}
              >
                Bet on x4
              </button>
              <button
                onClick={() => handleBetTypeChange('x8')}
                className={`bg-emerald-500 text-white py-2 px-5 m-1 rounded-md text-sm ${selectedBet === 'x8' ? 'bg-yellow-500' : ''}`}
              >
                Bet on x8
              </button>
            </div>
            <input
              type="number"
              value={bet.amount}
              onChange={handleArrowKeyChange}
              onKeyDown={handleKeyDown}
              min="1"
              max={token}
              step="1"
            />
            {!gameOver ? (
              <button onClick={drawCards} className="bg-sky-500 mx-2 text-white p-2 rounded-md" >Draw Cards</button>
            ) : (
              <button onClick={restartGame} className="bg-sky-500 mx-2 text-white p-2 rounded-md" >Restart Game</button>
            )}
            <div className="mt-4">
              <div className="mb-2">
                <p className="text-sm">D<i><b>e</b></i>aler<i>'</i>s Card ᯓ★</p>
                {dealerCard && <img src={cardImages[dealerCard]} alt={`Dealer's card ${dealerCard}`} className="w-16 mx-auto" />}
              </div>
              <div className="mb-2">
                <p className="text-sm">P<i><b>l</b></i>ayer<i>'</i>s Card ᯓ★</p>
                {playerCard && <img src={cardImages[playerCard]} alt={`Player's card ${playerCard}`} className="w-16 mx-auto" />}
              </div>
              <div className="mt-4 text-sm">
                <p className='text-sm'>{result}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center">
            <img src={back} alt='back btn' className='w-14 h-14 cursor-pointer' onClick={closeGame} />
          </div>
        </div>
      )}

      {activeGame === 'Wheels' && (
        <div className='absolute top-24 text-center mx-16 z-10 bg-amber-50 rounded-lg'>
          <img src={banner} alt='banner img' className='w-full h-auto mx-auto flex justify-center' />
          <div className="text-center p-4">
            <p className='underline'>click on <b>stop</b> to reveal the prize</p>
            <div className="mt-2 text-m">
              <h2 className='bg-emerald-white rounded-md text-sm'>{!isSpinning && prize}</h2>
            </div>
            <div
              className="relative mx-auto"
              style={{
                width: '300px',
                height: '300px',
                overflow: 'hidden',
              }}
            >
              <img
                src={wheelImage}
                alt="Spinning Wheel"
                className="transition-transform duration-5000 my-4"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 2s ease-out',
                }}
              />
            </div>
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button className='text-center bg-emerald-300 rounded-md px-4 py-2'
                onClick={spinWheel}>Spin</button>
              <button className='text-center bg-emerald-300 rounded-md px-4 py-2'
                onClick={stopWheel} disabled={!hasSpun}>Stop</button>
            </div>
          </div>
          <div className="flex justify-end items-center">
              <img src={back} alt='back btn' className='w-14 h-14 cursor-pointer' onClick={closeGame} />
            </div>
        </div>
      )}

      {activeGame === 'Dice' && (
        <div className='absolute top-24 text-center mx-16 z-10 bg-amber-50 rounded-lg h-'>
          <img src={banner} alt='banner-img' className='w-full h-auto mx-auto flex justify-center' />
          <div className="relative">
            <div className="text-center p-5">
              <div className="flex justify-center gap-2.5">
                <img
                  src={diceImages[diceRolls[0]]}
                  alt={`Dice ${diceRolls[0]}`}
                  className={`w-24 h-24 ${isRolling ? 'rotate-360' : 'rotate-0'} transition-transform duration-100`}
                />
                <img
                  src={diceImages[diceRolls[1]]}
                  alt={`Dice ${diceRolls[1]}`}
                  className={`w-24 h-24 ${isRolling ? 'rotate-360' : 'rotate-0'} transition-transform duration-100`}
                />
              </div>
              <div className="mt-5">
                <button
                  onClick={() => handleBetTypeChange('odd')}
                  className={`bg-rose-500 text-white py-2 px-5 m-1 rounded-md text-sm ${selectedBet === 'odd' ? 'bg-yellow-500' : ''}`}
                >
                  Odd
                </button>
                <button
                  onClick={() => handleBetTypeChange('even')}
                  className={`bg-sky-500 text-white py-2 px-5 m-1 rounded-md text-sm ${selectedBet === 'even' ? 'bg-yellow-500' : ''}`}
                >
                  Even
                </button>
                <button
                  onClick={() => handleBetTypeChange('double')}
                  className={`bg-emerald-500 text-white py-2 px-5 m-1 rounded-md text-sm ${selectedBet === 'double' ? 'bg-yellow-500' : ''}`}
                >
                  Doubles
                </button>
              </div>
              <input
                type="number"
                value={bet.amount}
                onChange={handleArrowKeyChange}
                onKeyDown={handleKeyDown}
                min="1"
                max={token}
                step="1"
              />
              <button
                onClick={rollDice}
                className="bg-yellow-400 text-black py-2 px-5 mt-5 rounded"
                disabled={isRolling}
              >
                Roll Dice
              </button>
              <div className="mt-5 text-lg">
                <p className='underline'>{diceResult}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center">
            <img src={back} alt='back btn' className='w-14 h-14 cursor-pointer' onClick={closeGame} />
          </div>
        </div>
      )}

      {activeGame === 'Roulette' && (
        <div className='absolute top-24 text-center mx-16 z-10 bg-amber-50 rounded-lg'>
          <img src={banner} alt='banner img' className='w-full h-auto mx-auto flex justify-center' />
          <div>
            <img src={roulette} alt='roulette' className='mx-auto flex justify-center'/>
            <div className="grid grid-cols-2 gap-2 mx-4 mt-4">
              <button onClick={() => placeBet('color', 'pink', 5)}
                className='bg-pink-500 text-white py-2 px-5 m-1 rounded-md text-sm'
              >
                Bet 5 on Pink
              </button>
              <button onClick={() => placeBet('color', 'green', 5)}
                className='bg-green-500 text-white py-2 px-5 m-1 rounded-md text-sm'
              >
                Bet 5 on Green
              </button>
              <button onClick={() => placeBet('odd', 'odd', 10)}
                className='bg-rose-400 text-white py-2 px-5 m-1 rounded-md text-sm'
              >
                Bet 10 on Odd
              </button>
              <button onClick={() => placeBet('even', 'even', 10)}
                className='bg-rose-400 text-white py-2 px-5 m-1 rounded-md text-sm'
              >
                Bet 10 on Even
              </button>
            </div>

            <button onClick={spinRoulette}
              className="bg-emerald-500 text-black py-2 px-5 mt-5 rounded">Spin the Wheel</button>
            {winningPocket && (
              <div className='mt-4'>
                <p className='text-center'>Winning Number: <u>{winningPocket.number}</u></p>
                <p className='text-center'>Winning Color: <u>{winningPocket.color}</u></p>
                <h2>{resultRoulette}</h2>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              </div>
            )}
          </div>
          <div className="flex justify-end items-center">
            <img src={back} alt='back btn' className='w-14 h-14 cursor-pointer' onClick={closeGame} />
          </div>
        </div>
      )}
    </div>
  );
}