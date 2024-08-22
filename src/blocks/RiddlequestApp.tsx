import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types';
import { useState, useEffect } from 'react';

export const RiddlequestFeedComponent = ({ model }: FeedComponentProps) => {
  const { riddleQuestion, userAnswer, riddleAnswer, toughness } = model.data;

  // Map toughness score to emoji
  const toughnessEmoji = (score: number): string => {
    if (score >= 80) return '😵‍💫💥🔥💪💯'; // Level 5 (Hardest)
    if (score >= 60) return '🤯🔥💪💪💥'; // Level 4
    if (score >= 40) return '🤔🔥💪💪'; // Level 3
    if (score >= 20) return '🙂🔥💪'; // Level 2
    return '😊🌟'; // Level 1 (Easiest)
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl shadow-lg space-y-6 transform hover:scale-105 transition-transform duration-300">
      <div className="text-center">
        <h1 className="font-extrabold text-4xl text-purple-800 tracking-wider mb-10">Riddle of the Day!</h1>
        <div className="bg-purple-200 p-4 rounded-xl shadow-inner">
          <p className="text-xl font-semibold text-gray-800">QUESTION:</p>
          <p className="text-lg text-gray-700 mt-2">{riddleQuestion}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-green-200 p-4 rounded-xl shadow-inner">
          <p className="text-lg font-semibold text-gray-800">CORRECT ANSWER:</p>
          <p className="text-gray-700 mt-2">{riddleAnswer}</p>
        </div>
        <div className="bg-red-200 p-4 rounded-xl shadow-inner">
          <p className="text-lg font-semibold text-gray-800">YOUR ANSWER:</p>
          <p className="text-gray-700 mt-2">{userAnswer}</p>
        </div>
        <div className="bg-yellow-200 p-4 rounded-xl shadow-inner">
          <p className="text-lg font-semibold text-gray-800">DIFFICULT RATING: {toughness}%</p>
          <p className="text-gray-700 mt-2">{toughnessEmoji(Number(toughness))}</p>
        </div>
      </div>
    </div>
  );
}



export const RiddlequestComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [riddleQuestion, setRiddleQuestion] = useState('');
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [toughness, setToughness] = useState(0); 

  // Call API to get riddle
  const getRiddle = async () => {
    try {
      const response = await fetch("https://riddles-api.vercel.app/random");
      const data = await response.json();
      setRiddleQuestion(data.riddle);
      setRiddleAnswer(data.answer);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRiddle();
  }, []);

  const handleSubmit = () => {
    // compare user answer with riddle answer

    model.data.riddleQuestion = riddleQuestion;
    model.data.riddleAnswer = riddleAnswer;
    model.data.userAnswer = userAnswer;
    model.data.toughness = toughness.toString();

    done(model);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="font-bold text-2xl text-center text-blue-700">Riddle of the Day!!</h1>
      <p className="text-gray-700">{riddleQuestion}</p>

      <input
        type="text"
        placeholder="Input your riddle answer"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mt-4">
        <label htmlFor="toughness" className="block text-gray-700 text-sm mb-1">
          How Tough Is the Riddle? (0-100%):
        </label>
        <input
          type="range"
          id="toughness"
          name="toughness"
          min="0"
          max="100"
          value={toughness}
          onChange={(e) => setToughness(Number(e.target.value))}
          className="w-full appearance-none h-2 bg-gray-200 rounded-lg outline-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #4caf50 ${toughness}%, #e0e0e0 ${toughness}%)`,
          }}
        />
      </div>

      <button 
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition duration-300 ease-in-out"
        onClick={handleSubmit}
      >
        Publish your answer
      </button>
    </div>
  );
};

