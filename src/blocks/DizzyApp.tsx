import { useState, useEffect, useRef } from 'react';
import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types';
// import { setUser } from '@sentry/react';
// import { setUser } from '@sentry/react';

// interface DizzyTextProps {
//   content: string;
//   contentColor: string;
//   backgroundColor: string;
// }

// function DizzyText({ content, contentColor, backgroundColor } : DizzyTextProps) {
//   const [colors, setColors] = useState({textColor: contentColor, bgColor: backgroundColor});
//   const { textColor, bgColor }  = colors;
// }

export const DizzyFeedComponent = ({ model }: FeedComponentProps) => {
  const userText = model.data.userText; 
  const colors = [model.data.userFGColor, model.data.userBGColor];
  const [i, setI] = useState(0);
  const userTextSize = parseInt(model.data.userTextSize);
  const userTransTime = parseInt(model.data.userTransTime);
  const wordsUserText = userText.split(" ")

  useEffect(() => {
    const interval = setInterval(() => {
      setI((i=== wordsUserText.length-1) ? 0 : i+1)
    }, userTransTime);
    return () => clearInterval(interval);
  }, [i, wordsUserText.length, userTransTime]);

  return (
    <div className='p-3 text-center font-bold rounded-lg' style={{color: colors[i%2], background: colors[(i+1)%2], fontSize: userTextSize}}>
        {wordsUserText[i]}
    </div>
  )
}

export const DizzyComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [userText, setUserText] = useState('');
  const [userFGColor, setUserFGColor] = useState('#000000');
  const [userBGColor, setUserBGColor] = useState('#ffffff');
  const [userTextSize, setUserTextSize] = useState(20);
  const [userTransTime, setUserTransTime] = useState(400);
  
  const onUserSubmit = () => {
    model.data.userText = userText.toUpperCase();
    model.data.userFGColor = userFGColor;
    model.data.userBGColor = userBGColor;
    model.data.userTextSize = userTextSize.toString();
    model.data.userTransTime = userTransTime.toString();
    done(model);
  }
  return (
    <div>
      <h1 className='text-2xl font-bold mt-1 mb-4'>Anything to capture eyes?</h1>
      <input
        className='border border-gray-300 p-2 rounded-lg w-full mb-2'
        type="text"
        placeholder="Something catchy here!"
        value={userText}
        onChange={(e) => setUserText(e.target.value)}
      />
      <p>Textsize</p>
      <input 
      type='number'
      placeholder='20'
      value={userTextSize}
      onChange={(e) => setUserTextSize(parseInt(e.target.value))}
      />
      <p>Foreground color</p>
      <input
        type="color"
        value={userFGColor}
        onChange={(e) => setUserFGColor(e.target.value)}
      />
      <p>Background color</p>
      <input
        type="color"
        value={userBGColor}
        onChange={(e) => setUserBGColor(e.target.value)}
      />
      <p>Transition time in (milliseconds)</p>
      <input 
      type='number'
      placeholder='400'
      value={userTransTime}
      onChange={(e) => setUserTransTime(parseInt(e.target.value))}
      />
      <p></p>
      <button className="mt-2 mb-3 bg-blue-500 text-white p-2 rounded-lg" onClick={onUserSubmit}> Preview </button>
    </div>
  );
}