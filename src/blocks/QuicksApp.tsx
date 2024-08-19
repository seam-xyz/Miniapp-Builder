import React, { useState, useRef, useEffect } from 'react';
import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types';

interface DoodleModel extends BlockModel {
  prompt: string;
  imageData: string;
  feedback?: string;
}

const CANVAS_SIZE = 400;
const COLORS = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#FFA500', '#800080'];
const TIME_LIMIT = 60;

export const QuicksFeedComponent = ({ model }: FeedComponentProps<DoodleModel>) => {
  // Use the feedback from the model directly
  const [feedback, setFeedback] = useState(model.feedback || '');

  const feedbackOptions = ['Interesting', 'Exciting', 'I loved this challenge!', 'Wonderful', 'Fun', 'Challenging'];

  // Only display the feedback options if no feedback has been selected yet
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '20px', 
      border: '2px solid #3498db', 
      borderRadius: '10px', 
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h3 style={{ color: '#2c3e50' }}>Daily Doodle: {model.prompt}</h3>
      <img src={model.imageData} alt="Doodle" style={{ width: '100%', maxWidth: '400px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {!feedback ? (
          <>
            <p style={{ fontWeight: 'bold', color: '#2c3e50' }}>How was your experience?</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
              {feedbackOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setFeedback(option)}
                  style={{
                    padding: '8px 15px',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: feedback === option ? '#3498db' : '#ecf0f1',
                    color: feedback === option ? 'white' : '#2c3e50',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#3498db' }}>You found it {feedback.toLowerCase()}!</p>
        )}
      </div>
    </div>
  );
};


export const QuicksComposerComponent = ({ model, done }: ComposerComponentProps<DoodleModel>) => {
  const [color, setColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [prompt, setPrompt] = useState('');
  const [isErasing, setIsErasing] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prompts = ['Cosmic Cat', 'Floating Island', 'Robotic Tree', 'Surreal Cityscape', 'Underwater Castle', 'Flying Car', 'Alien Picnic', 'Time-traveling Bird'];
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleDone();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      setUndoStack([...undoStack, canvas.toDataURL()]);
    }
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.strokeStyle = isErasing ? '#FFFFFF' : color;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      setUndoStack([...undoStack, canvas.toDataURL()]);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack.pop();
      setUndoStack([...undoStack]);
      const img = new Image();
      img.src = previousState as string;
      img.onload = () => {
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.drawImage(img, 0, 0);
      };
    }
  };

  const handleDone = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imageData = canvas.toDataURL();
      done({ ...model, prompt, imageData });
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '20px', 
      backgroundColor: '#f0f3f5', 
      borderRadius: '15px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{ color: '#2c3e50' }}>Daily Doodle Challenge</h2>
      <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#3498db' }}>Prompt: {prompt}</p>
      <p style={{ fontSize: '16px', color: timeLeft <= 10 ? '#e74c3c' : '#2c3e50' }}>
        Time left: {timeLeft} seconds
      </p>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseLeave={stopDrawing}
        style={{ border: '2px solid #3498db', borderRadius: '10px', cursor: 'crosshair', backgroundColor: '#FFFFFF' }}
      />
      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {COLORS.map((c) => (
          <button
            key={c}
            style={{
              backgroundColor: c,
              width: '30px',
              height: '30px',
              margin: '0 5px',
              border: color === c ? '2px solid #2c3e50' : 'none',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
            onClick={() => { setColor(c); setIsErasing(false); }}
          />
        ))}
      </div>
      <div style={{ marginTop: '15px', width: '100%', maxWidth: '400px' }}>
        <label htmlFor="brushSize" style={{ marginRight: '10px' }}>Brush Size:</label>
        <input
          type="range"
          id="brushSize"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ marginTop: '15px' }}>
        <button onClick={() => setIsErasing(!isErasing)} style={{ marginRight: '10px', backgroundColor: isErasing ? '#e74c3c' : '#3498db', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>
          {isErasing ? 'Disable Eraser' : 'Enable Eraser'}
        </button>
        <button onClick={clearCanvas} style={{ marginRight: '10px', backgroundColor: '#95a5a6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Clear</button>
        <button onClick={undo} style={{ backgroundColor: '#f39c12', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Undo</button>
      </div>
      <button onClick={handleDone} style={{ marginTop: '20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>Finish Doodle</button>
    </div>
  );
};