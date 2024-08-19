//Users can write their thoughts with the stickers or draw their own stickers

import React, { useState } from 'react';
import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types';
import p5 from 'p5';

const stickers = ['😊', '🌟', '🙏', '💖', '🌈', '🍀'];

//Shows either sticker or their drawing depending what they had chosen, along with their text
export const JournalFeedComponent = ({ model }: FeedComponentProps) => {
  const text = model.data.entry;
  const emoji = model.data.sticker;
  const picture = model.data.emojiUrl;

  return (
    <div className='p-8 bg-yellow-100 rounded-lg shadow flex flex-col items-center text-center'>
      <h1 className='text-xl font-bold mb-2'>My Favorite Thing Today</h1>
      {picture ? (
        <img src={picture} alt="Custom Emoji" className="w-32 h-32" />
      ) : (
        <h1 className='text-3xl'>{emoji}</h1>
      )}
      <p className='text-gray-700'>{text}</p>
    </div>
  );
}

export const JournalComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [entry, setEntry] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('');
  const [emojiUrl, setEmojiUrl] = useState('');
  const [showCanvas, setShowCanvas] = useState(false); // State to control canvas visibility

  //Made a drawing canvas with a pen
  const sketch = (p: p5) => {
    p.setup = () => {
      const canvas = p.createCanvas(350, 350);
      canvas.parent('emojiCanvas');
      p.background(199, 232, 255);
    };

    p.draw = () => {
      if (p.mouseIsPressed) {
        p.fill(0);
        p.ellipse(p.mouseX, p.mouseY, 20, 20);
      }
    };
  };

  React.useEffect(() => {
    if (showCanvas) {
      const p5Instance = new p5(sketch);
      return () => {
        p5Instance.remove(); // Clean up p5 instance on unmount
      };
    }
  }, [showCanvas]); // Only run effect when showCanvas changes

  const saveEmoji = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      setEmojiUrl(dataUrl);
      model.data.emojiUrl = dataUrl;
      done(model);
    }
  };

  const handleSubmit = () => {
    if (showCanvas) {
      saveEmoji(); // Capture the emoji before submitting
      model.data.sticker = ''; // Clear the sticker when saving the custom emoji
    } else {
      model.data.sticker = selectedSticker;
    }
    model.data.entry = entry;
    done(model);
  };

//takes user's inputs
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Gratitude Journal</h1>
      <textarea 
        className='w-full p-2 border rounded-lg mb-4'
        rows={4}
        placeholder='What are you grateful for today?'
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />
      {!showCanvas && (
        <div className='mb-4'>
          <p className='mb-2 font-bold'>Choose a sticker:</p>
          <div className='flex space-x-2'>
            {stickers.map((sticker) => (
              <button
                key={sticker}
                className={`text-3xl p-2 rounded ${selectedSticker === sticker ? 'bg-yellow-200' : 'bg-white'}`}
                onClick={() => setSelectedSticker(sticker)}>
                {sticker}
              </button>
            ))}
          </div>
        </div>
      )}

      <button 
        className='bg-gray-100 text-black px-4 py-2 rounded mb-4 hover:bg-gray-200'
        onClick={() => setShowCanvas(!showCanvas)}> {/* Toggle showCanvas */}
        {showCanvas ? 'Go Back to Stickers' : 'Make My Own!'}
      </button>

      {showCanvas && <div id="emojiCanvas" className='mb-4 rounded-lg'></div>}
      
      <button 
        className='bg-blue-500 text-white px-4 py-2 rounded-lg'
        onClick={handleSubmit}
      >Post</button>
    </div>
  );
}