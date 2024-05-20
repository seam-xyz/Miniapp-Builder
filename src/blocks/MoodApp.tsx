import React, { useState, useRef, useEffect } from 'react';
import Block from './Block';
import { BlockModel } from './types';
import './BlockStyles.css';
import './utils/Dial.css';
import { Button } from '@mui/material';

const emojis = [
  { mood: 'Feeling Happy', emoji: '😄', color: '#FFD700' },
  { mood: 'Feeling Satisfied', emoji: '😌', color: '#ADD8E6' },
  { mood: 'Feeling Content', emoji: '🙂', color: '#90EE90' },
  { mood: 'Feeling Amused', emoji: '🤣', color: '#FFB6C1' },
  { mood: 'Feeling Playful', emoji: '😜', color: '#FF69B4' },
  { mood: 'Feeling Silly', emoji: '🤪', color: '#FFA07A' },
  { mood: 'Feeling Excited', emoji: '🤩', color: '#FF4500' },
  { mood: 'Feeling Spicy', emoji: '🥵', color: '#FF6347' },
  { mood: 'Feeling Curious', emoji: '🤔', color: '#FFDAB9' },
  { mood: 'Feeling Unsure', emoji: '😟', color: '#D3D3D3' },
  { mood: 'Feeling Meh', emoji: '😕', color: '#B0C4DE' },
  { mood: 'Feeling Annoyed', emoji: '🙄', color: '#A9A9A9' },
  { mood: 'Feeling Frustrated', emoji: '😤', color: '#B22222' },
  { mood: 'Feeling Furious', emoji: '🤬', color: '#8B0000' },
  { mood: 'Feeling Sad', emoji: '😢', color: '#4682B4' },
  { mood: 'Feeling Tearful', emoji: '😭', color: '#5F9EA0' },
  { mood: 'Feeling Down', emoji: '😔', color: '#2F4F4F' },
  { mood: 'Feeling Cool', emoji: '😎', color: '#0000CD' },
  { mood: 'Feeling Surprised', emoji: '😲', color: '#DAA520' },
];

export default class MoodBlock extends Block {
  render() {
    return (
      <MoodDisplay mood={this.model.data.mood} emoji={this.model.data.emoji} />
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return <MoodVisualizer model={this.model} done={done} />;
  }

  renderErrorState() {
    return <h1>Error!</h1>;
  }
}

interface MoodVisualizerProps {
  model: BlockModel;
  done: (data: BlockModel) => void;
}

const MoodVisualizer: React.FC<MoodVisualizerProps> = ({ model, done }) => {
  const [index, setIndex] = useState<number>(0);

  const handleSave = () => {
    done({
      ...model,
      data: {
        ...model.data,
        mood: emojis[index].mood,
        emoji: emojis[index].emoji,
        color: emojis[index].color,
      },
    });
  };

  const handleDialChange = (newIndex: number) => {
    setIndex((newIndex + emojis.length) % emojis.length); // Ensure the index wraps around correctly
  };

  const currentColor = emojis[index].color;

  return (
    <div
      className="w-full h-full overflow-hidden flex flex-col items-center justify-between"
      style={{
        background: `linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, ${currentColor}40 100%)`, // 40 is 25% opacity
      }}
    >
      <div className="mt-4 flex items-center justify-center flex-col">
        <h1 className="text-seam-black font-thin leading-[48px] text-center">How do you feel right now?</h1>
        <div className={`text-[24px] text-[${currentColor}] mb-6 mt-10`}>{emojis[index].mood}</div>
      </div>
      <Dial index={index} onDialChange={handleDialChange} color={currentColor} />
      <Button
        onClick={handleSave}
        fullWidth
        variant="contained"
        color="primary"
        className="m-4 h-[60px] justify-center items-center flex rounded-[8px] bg-seam-blue"
      >
        <h3 className="text-seam-white">PREVIEW</h3>
      </Button>
    </div>
  );
};

interface DialProps {
  index: number;
  onDialChange: (newIndex: number) => void;
  color: string;
}

const Dial: React.FC<DialProps> = ({ index, onDialChange, color }) => {
  const dialRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState<number>(0);
  const snapPoints = emojis.length; 
  const snapAngle = 360 / snapPoints;

  const handleMove = (clientX: number, clientY: number) => {
    if (dialRef.current) {
      const rect = dialRef.current.getBoundingClientRect();
      const x = clientX - rect.left - rect.width / 2;
      const y = clientY - rect.top - rect.height / 2;
      let newAngle = Math.atan2(y, x) * (180 / Math.PI) + 90;
      if (newAngle < 0) newAngle += 360;

      const nearestSnapPoint = Math.round(newAngle / snapAngle) * snapAngle;
      setAngle(nearestSnapPoint);

      const newIndex = Math.round((nearestSnapPoint % 360) / snapAngle);
      onDialChange(newIndex);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
  };

  const handleEnd = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleEnd);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleEnd);
  };

  useEffect(() => {
    return () => {
      handleEnd();
    };
  }, []);

  return (
    <div
      ref={dialRef}
      className="dial relative w-64 h-64 rounded-full flex items-center justify-center"
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      <div className="absolute w-full h-full flex items-center justify-center">
        {Array.from({ length: snapPoints }).map((_, idx) => (
          <div
            key={idx}
            className="snap-point absolute w-2 h-2 bg-gray-400 rounded-full"
            style={{ transform: `rotate(${idx * snapAngle}deg) translate(120px)` }}
          />
        ))}
      </div>
      <div
        className="dial-button"
        style={{ transform: `rotate(${angle}deg) translate(120px)` }}
      />
      <div
        className="text-6xl absolute flex items-center justify-center p-16 rounded-full"
        style={{ backgroundColor: color }}
      >
        {emojis[index].emoji}
      </div>
    </div>
  );
};

interface MoodDisplayProps {
  mood: string;
  emoji: string;
}

const MoodDisplay: React.FC<MoodDisplayProps> = ({ mood, emoji }) => {
  const moodObj = emojis.find(e => e.mood === mood) || { color: '#FFFFFF' };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-4"
      style={{
        background: `linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, ${moodObj.color}40 100%)`, // 40 is 25% opacity
      }}
    >
      <div className={`text-[24px] text-[${moodObj.color}] mb-6`}>{mood}</div>
      <div
        className="text-6xl flex items-center justify-center p-16 rounded-full"
        style={{ backgroundColor: moodObj.color }}
      >
        {emoji}
      </div>
    </div>
  );
};