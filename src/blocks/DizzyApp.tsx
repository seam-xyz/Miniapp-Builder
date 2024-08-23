import { useState, useEffect, useRef } from 'react';
import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types';

export const DizzyFeedComponent = ({ model }: FeedComponentProps) => {
  const wordsUserText = model.data.userText.split(" ");
  const colors = [model.data.userFGColor, model.data.userBGColor];
  const [i, setI] = useState(0);
  const userTextSize = parseInt(model.data.userTextSize);
  const userTransTime = parseInt(model.data.userTransTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setI((i === wordsUserText.length - 1) ? 0 : i + 1)
    }, userTransTime);
    return () => clearInterval(interval);
  }, [i, wordsUserText.length, userTransTime]);

  return (
    <div className='p-3 text-center font-bold rounded-lg' style={{ color: colors[i % 2], background: colors[(i + 1) % 2], fontSize: userTextSize }}>
      {wordsUserText[i]}
    </div>
  )
}

export const DizzyComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [userText, setUserText] = useState(model.data?.userText ?? '');
  const [userFGColor, setUserFGColor] = useState(model.data?.userFGColor ?? '#000000');
  const [userBGColor, setUserBGColor] = useState(model.data.userBGColor ?? '#ffffff');
  const [userTextSize, setUserTextSize] = useState(model.data?.userTextSize ?? 20);
  const [userTransTime, setUserTransTime] = useState(model.data?.userTransTime ?? 400);

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
        className='border border-gray-300 p-2 rounded-lg w-full mb-2 box-border'
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
        onChange={(e) => {
          const value = parseInt(e.target.value);
          setUserTextSize(value > 96 ? "96" : e.target.value);
        }}
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
        onChange={(e) => {
          const value = parseInt(e.target.value);
          setUserTransTime(value < 200 ? "200" : e.target.value);
        }}
      />
      <p></p>
      <button className="mt-2 mb-3 bg-blue-500 text-white p-2 rounded-lg" onClick={onUserSubmit}> Preview </button>
    </div>
  );
}