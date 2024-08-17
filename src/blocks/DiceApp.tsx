import { ComposerComponentProps, FeedComponentProps } from './types';

import { useState } from 'react';


const getDiceFace = (value: number) => {
  const dots = [];
  for (let i = 0; i < value; i++) {
    dots.push(
      <div key={i} className="w-4 h-4 bg-black rounded-full"></div>
    );
  }
  return dots;
};

const getDiceLayout = (value: number) => {
  switch (value) {
    case 1:
      return 'grid-cols-1';
    case 2:
    case 3:
      return 'grid-cols-2';
    case 4:
    case 5:
    case 6:
      return 'grid-cols-3';
    default:
      return 'grid-cols-1';
  }
};

type DiceComponentProps = {
  message: string;
  rolling: boolean;
  onClick: () => void;
  diceValue: number;
};

const DiceComponent = ({ message, rolling, onClick, diceValue }: DiceComponentProps) => {
  return (
    <div className="flex flex-col items-center justify-center m-6 p-6 bg-gray-100 flex-grow">
      <p className="text-2xl mb-4">{message}</p>
      <div
        className={`w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center cursor-pointer transition-transform duration-1000 ${
          rolling ? 'animate-spin' : ''
        }`}
        onClick={onClick}
      >
        <div className={`grid gap-2 ${getDiceLayout(diceValue)}`}>
          {getDiceFace(diceValue)}
        </div>
      </div>
    </div>
  )
};

export const DiceFeedComponent = ({ model }: FeedComponentProps) => {
  return (
    <div className='w-full h-full'>
    <DiceComponent
    message={model.data['diceMessage']}
    rolling={false}
    onClick={() => {}}
    diceValue={parseInt(model.data['diceValue'])}
  />
  </div>
  )
}

export const DiceComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [rolling, setRolling] = useState(false);
  const [diceValue, setDiceValue] = useState(1);
  const [message, setMessage] = useState('Click to roll');

  const rollDice = () => {
    if (!rolling) {
      setRolling(true);
      setMessage('Rolling...');
      setTimeout(() => {
        const newValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(newValue);
        setRolling(false);
        setMessage(`You rolled a ${newValue}`);
        model.data['diceValue'] = newValue.toString();
        model.data['diceMessage'] = `You rolled a ${newValue}`;
        done(model);
      }, 1000);
    }
  };

  return (
    <DiceComponent
      message={message}
      rolling={rolling}
      onClick={rollDice}
      diceValue={diceValue}
    />
  )
}