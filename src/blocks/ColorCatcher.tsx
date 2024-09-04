import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Circle {
  id: number;
  color: string;
  position: number;
  hasScored: boolean;
}

const colors = ['red', 'blue'];

const ColorGame: React.FC<{ model?: any, done?: any }> = ({ model, done}) => {
  const [bucketsSwapped, setBucketsSwapped] = useState(false);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [newHighScore, setNewHighScore] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [fallingInterval, setFallingInterval] = useState(300);
  const [gameStarted, setGameStarted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableText, setEditableText] = useState('');
  const [selectedText, setSelectedText] = useState<'score' | 'highscore'>('score');

  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space') {
      if (isModalOpen) return;

      if (!gameStarted) {
        handleStartGame();
      } else {
        setBucketsSwapped(prev => !prev);
      }
    }
  }, [gameStarted, isModalOpen]);

  const handleBucketClick = useCallback(() => {
    if (isModalOpen) return;

    if (!gameStarted) {
      handleStartGame();
    } else if (!gameOver) {
      setBucketsSwapped(prev => !prev);
    }
  }, [gameStarted, gameOver, isModalOpen]);

  useEffect(() => {
    if (gameOver || !gameStarted) return;

    const newInterval = 300 - Math.floor(score / 5) * 30;
    setFallingInterval(Math.max(newInterval, 100));
  }, [score, gameOver, gameStarted]);

  useEffect(() => {
    if (gameOver || !gameStarted) return;

    const interval = setInterval(() => {
      const newCircle: Circle = {
        id: Date.now(),
        color: colors[Math.floor(Math.random() * colors.length)],
        position: 0,
        hasScored: false,
      };
      setCircles(prev => [...prev, newCircle]);
    }, fallingInterval);

    return () => clearInterval(interval);
  }, [fallingInterval, gameOver, gameStarted]);

  useEffect(() => {
    if (gameOver || !gameStarted) return;

    const interval = setInterval(() => {
      setCircles(prevCircles =>
        prevCircles.map(circle => ({
          ...circle,
          position: circle.position + 1.3 + Math.min(score / 10, 1.5),
        }))
      );
    }, 10);

    return () => clearInterval(interval);
  }, [gameOver, gameStarted]);

  useEffect(() => {
    if (gameOver || !gameStarted) return;

    const interval = setInterval(() => {
      setCircles(prevCircles => {
        return prevCircles.filter(circle => {
          if (circle.position >= 90 && !circle.hasScored) {
            if (circle.color === (bucketsSwapped ? 'blue' : 'red')) {
              setScore(prev => {
                const newScore = prev + 1;
                if (newScore > highScore) {
                  setHighScore(newScore);
                  setNewHighScore(true);
                }
                return newScore;
              });
              circle.hasScored = true;
            } else {
              setGameOver(true);
            }
          }
          return circle.position < 100;
        });
      });
    }, 16);

    return () => clearInterval(interval);
  }, [bucketsSwapped, gameOver, gameStarted, highScore]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const handleClick = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      handleBucketClick();
    };

    if (!gameOver) {
      document.addEventListener('click', handleClick);
      document.addEventListener('touchend', handleClick);
    }

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchend', handleClick);
    };
  }, [handleBucketClick, gameOver]);

  const handlePlayAgain = () => {
    setGameOver(false);
    setScore(0);
    setCircles([]);
    setFallingInterval(300);
    setNewHighScore(false);
  };

  const handleShareClick = () => {
    setEditableText(``);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const startPost = () => {
    model.data.colorcatcherscheme = Math.floor(Math.random() * 4 + 1).toString();
    model.data.colorcatchertitle = editableText
    if(selectedText === 'score'){
        model.data.colorcatcherscore = score.toString();
    }
    else {
        model.data.colorcatcherscore = highScore.toString();
    }
    
    done(model)
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleModalClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isModalOpen]);

  return (
    <div className="relative w-full h-[85vh] bg-gradient-to-b from-gray-900 to-gray-700 overflow-hidden flex items-center justify-center">
      <div className={`select-none ${isModalOpen ? 'pointer-events-none' : ''}`}>
        {!gameStarted ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
            <h2 className="text-4xl mb-4 font-extrabold">Tap or Press Space to Start</h2>
          </div>
        ) : !gameOver ? (
          <>
            <h2 className="text-white text-3xl absolute top-4 left-4 font-bold shadow-md">Score: {score}</h2>
            <h2 className="text-white text-3xl absolute top-4 right-4 font-bold shadow-md">High Score: {highScore}</h2>

            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {circles.map(circle => (
                <circle
                  key={circle.id}
                  cx="50%"
                  cy={`${circle.position}%`}
                  r="20"
                  fill={circle.color}
                  className="shadow-lg border border-gray-800"
                />
              ))}
            </svg>

            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
              <div
                className={`w-24 h-24 rounded-t-lg ${bucketsSwapped ? 'bg-blue-600' : 'bg-red-600'} shadow-xl border-4 border-gray-900 cursor-pointer`}
              ></div>
            </div>
          </>
        ) : (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
            <p className="text-2xl mb-4">Final Score: {score}</p>
            {newHighScore && <p className="text-xl text-yellow-400 mb-4">New High Score!</p>}
            <div className="flex flex-col items-center space-y-4">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                onClick={handlePlayAgain}
              >
                Play Again
              </button>
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                onClick={handleShareClick}
              >
                Share
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Share Your Score</h2>
            <textarea
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              className="w-full h-32 border border-gray-300 rounded-lg p-2 mb-4"
              placeholder="Add a reaction"
            />
            <div className="flex flex-col space-y-2 mb-4">
 <label>
  <input
    type="radio"
    value="score"
    checked={selectedText === 'score'}
    onChange={() => setSelectedText('score')}
    className="mr-2"
  />
  
 Current Score <span className='text-gray-400'>{score}</span>
 
</label>
{score !== highScore && (
  <label>
    <input
      type="radio"
      value="highscore"
      checked={selectedText === 'highscore'}
      onChange={() => setSelectedText('highscore')}
      className="mr-2"
    />
    High Score <span className='text-gray-400'>{highScore}</span>
  </label>
)}

            </div>
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                onClick={handleModalClose}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
                onClick={startPost}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorGame;
