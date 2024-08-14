import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_FOOD = { x: 15, y: 15 };

interface SnakeSegment {
  x: number;
  y: number;
}

interface Direction {
  x: number;
  y: number;
}

const Snake: React.FC<{ segments: SnakeSegment[], cellSize: number }> = React.memo(({ segments, cellSize }) => (
  <>
    {segments.map((segment, index) => (
      <div
        key={`${segment.x}-${segment.y}-${index}`}
        className="absolute bg-green-500 rounded-sm snake-segment"
        style={{
          left: `${segment.x * cellSize}px`,
          top: `${segment.y * cellSize}px`,
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          transition: 'all 0.1s linear',
        }}
      />
    ))}
  </>
));

const Food: React.FC<{ position: SnakeSegment, cellSize: number }> = React.memo(({ position, cellSize }) => (
  <div
    className="absolute bg-red-500 rounded-full"
    style={{
      left: `${position.x * cellSize}px`,
      top: `${position.y * cellSize}px`,
      width: `${cellSize}px`,
      height: `${cellSize}px`,
    }}
  />
));

const StatusBar: React.FC<{ score: number, highScore: number }> = ({ score, highScore }) => (
  <div className="flex justify-between items-center mb-4 px-4 py-2 bg-gray-200 rounded-lg w-full">
    <div className="text-lg font-semibold">Score: {score}</div>
    <div className="text-lg font-semibold">High Score: {highScore}</div>
  </div>
);

const GameOverOverlay: React.FC<{ score: number, highScore: number }> = ({ score, highScore }) => (
  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
    <div className="text-white text-4xl font-bold mb-4">Game Over!</div>
    <div className="text-white text-2xl mb-2">Score: {score}</div>
    <div className="text-white text-2xl mb-4">High Score: {highScore}</div>
  </div>
);

const TouchControls: React.FC<{ onDirectionChange: (direction: Direction) => void }> = ({ onDirectionChange }) => (
  <div className="grid grid-cols-3 gap-2 mt-4 w-full max-w-xs">
    <button onClick={() => onDirectionChange({ x: 0, y: -1 })} className="col-start-2 p-2 bg-gray-200 rounded">↑</button>
    <button onClick={() => onDirectionChange({ x: -1, y: 0 })} className="p-2 bg-gray-200 rounded">←</button>
    <button onClick={() => onDirectionChange({ x: 0, y: 1 })} className="p-2 bg-gray-200 rounded">↓</button>
    <button onClick={() => onDirectionChange({ x: 1, y: 0 })} className="p-2 bg-gray-200 rounded">→</button>
  </div>
);

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<SnakeSegment[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<SnakeSegment>(INITIAL_FOOD);
  const [gameOver, setGameOver] = useState(false);
  const [cellSize, setCellSize] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((): SnakeSegment => {
    let newFood : SnakeSegment ;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      // Check collision with walls
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return prevSnake;
      }

      // Check collision with self
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check if snake ate food
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
        setCurrentScore(prevScore => {
          const newScore = prevScore + 1;
          setHighScore(prevHighScore => Math.max(prevHighScore, newScore));
          return newScore;
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          setDirection(prev => prev.y === 1 ? prev : { x: 0, y: -1 });
          break;
        case 'ArrowDown':
          setDirection(prev => prev.y === -1 ? prev : { x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          setDirection(prev => prev.x === 1 ? prev : { x: -1, y: 0 });
          break;
        case 'ArrowRight':
          setDirection(prev => prev.x === -1 ? prev : { x: 1, y: 0 });
          break;
      }
    };

    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        const smallestDimension = Math.min(containerWidth, containerHeight);
        const newCellSize = Math.floor(smallestDimension / GRID_SIZE);
        setCellSize(newCellSize);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('resize', handleResize);
    };
  }, [gameOver]);

  useEffect(() => {
    if (!gameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, 100);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, gameOver]);

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setCurrentScore(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl shadow-md w-full max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Snake Game</h1>
      <StatusBar score={currentScore} highScore={highScore} />
      <div 
        ref={containerRef}
        className="relative bg-gray-100 border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden w-full"
        style={{ aspectRatio: '1 / 1' }}
      >
        {cellSize > 0 && (
          <>
            <Snake segments={snake} cellSize={cellSize} />
            <Food position={food} cellSize={cellSize} />
            {gameOver && (
              <GameOverOverlay 
                score={currentScore} 
                highScore={highScore}
              />
            )}
          </>
        )}
      </div>
      <button 
        onClick={restartGame}
        className="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-200"
      >
        {gameOver ? 'Play Again' : 'Restart Game'}
      </button>
      <TouchControls onDirectionChange={setDirection} />
      <p className="mt-4 text-gray-600">Use arrow keys or touch controls to play!</p>
    </div>
  );
};

export const SnakeFeedComponent: React.FC<{ model: any }> = ({ model }) => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <SnakeGame />
    </div>
  );
};

export const SnakeComposerComponent: React.FC<{ model: any, done: (model: any) => void }> = ({ model, done }) => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <SnakeGame />
      <button 
        onClick={() => { done(model) }}
        className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200"
      >
        Post
      </button>
    </div>
  );
};