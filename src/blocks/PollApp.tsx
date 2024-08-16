import React, { useState, useEffect } from 'react';
import { FeedComponentProps, ComposerComponentProps } from './types';

export const PollFeedComponent = ({ model, update }: FeedComponentProps) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [votes, setVotes] = useState<{ [key: string]: number }>({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    // Initialize the votes state from model data
    const initialVotes: { [key: string]: number } = {};
    let total = 0;
    Object.entries(model.data).forEach(([key, value]) => {
      if (key.endsWith('Votes')) {
        const voteCount = Number(value);
        initialVotes[key.replace('Votes', '')] = voteCount;
        total += voteCount;
      }
    });
    setVotes(initialVotes);
    setTotalVotes(total);
  }, [model.data]);

  const handleVote = async (optionKey: string) => {
    if (hasVoted) return; // Prevent multiple votes

    const updatedVotes = { ...votes, [optionKey]: votes[optionKey] + 1 };
    setVotes(updatedVotes); // Optimistic update
    setTotalVotes(totalVotes + 1);
    setSelectedOption(optionKey);
    setHasVoted(true);

    try {
      // Update the model data with new vote counts
      const updatedData = { ...model.data };
      updatedData[`${optionKey}Votes`] = updatedVotes[optionKey].toString(); // Convert number to string

      // Update the backend with the new vote counts
      if (update) {
        await update(updatedData);
      }
    } catch (error) {
      console.error('Failed to update votes:', error);
    }
  };

  const getPercentage = (optionKey: string) => {
    return totalVotes > 0 ? ((votes[optionKey] / totalVotes) * 100).toFixed(1) : '0';
  };

  return (
    <div className="pb-4 bg-seam-white w-full space-y-4 h-full">
      <h2 className="text-xl font-bold mb-4">{model.data.question}</h2>
      <div>
        {Object.entries(model.data)
          .filter(([key]) => key.startsWith('option') && !key.endsWith('Votes'))
          .map(([key, value]) => {
            const percentage = getPercentage(key);
            const isSelected = selectedOption === key;

            return (
              <div key={key} className="relative mb-2">
                <div
                  className="absolute top-0 left-0 w-full h-full rounded bg-gray-200"
                  style={{
                    width: hasVoted ? `${percentage}%` : '100%',
                    backgroundColor: isSelected && hasVoted ? '#27a4f2' : '#F2F2F2',
                    zIndex: ''
                  }}
                />
                <button
                  className={`relative flex flex-row text-center py-2 items-center justify-between block w-full text-left rounded bg-transparent text-gray-800 ${isSelected && 'font-bold'}`}
                  onClick={() => handleVote(key)}
                  disabled={hasVoted}
                >
                  <div className={`ml-2 text-seam-black`}>{value}</div>
                  <div>
                    {hasVoted && (
                      <span className={`mr-2 ${isSelected && 'font-bold'}`}>
                        {percentage}%
                      </span>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
      </div>
      {hasVoted && (
        <div className="mt-2 text-gray-500">
          {totalVotes} votes
        </div>
      )}
    </div>
  );
};

export const PollComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');

  const addOption = () => {
    if (options.length >= 10) {
      setError('You can only have a maximum of 10 options.');
      return;
    }
    setOptions([...options, '']);
  };

  const updateOption = (index: number, value: string) => {
    if (value.length > 80) {
      setError('Each option must be 80 characters or less.');
      return;
    }
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      setError('You must have at least 2 options.');
      return;
    }
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (question.length < 1) {
      setError('You must ask a question.');
      return;
    }
    if (options.length < 2) {
      setError('You must have at least 2 options.');
      return;
    }
    if (options.some(option => option.trim() === '')) {
      setError('All options must be filled out.');
      return;
    }

    setError('');

    model.data.question = question;
    options.forEach((option, index) => {
      model.data[`option${index + 1}`] = option;
      model.data[`option${index + 1}Votes`] = "0"; // Initialize vote count for each option
    });
    done(model);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-seam-white">
      <input
        type="text"
        className="w-full p-2 mb-4 border rounded"
        placeholder="Enter your question"
        value={question}
        maxLength={80}
        onChange={(e) => setQuestion(e.target.value)}
      />
      {options.map((option, index) => (
        <div key={index} className="flex w-full items-center mb-2">
          <button
            className="text-red-500 mr-2"
            onClick={() => removeOption(index)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="black"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder={`Option ${index + 1}`}
            value={option}
            maxLength={50}
            onChange={(e) => updateOption(index, e.target.value)}
          />
        </div>
      ))}
      {options.length < 10 && 
        <button
          className={`w-full p-4 mt-4 bg-gray-200 rounded'}`}
          onClick={addOption}
          disabled={options.length >= 10}
        >
          <h3>Add Option</h3>
        </button>
      }
      <button
        className="w-full mt-4 p-4 bg-blue-500 text-white rounded"
        onClick={handleSubmit}
      >
        <h3>Create Poll</h3>
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};