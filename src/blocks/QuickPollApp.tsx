import { useState, ChangeEvent } from 'react';
import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types';


interface Question {
  question: string;
  options: string[];
  type: string;
}
export const QuickPollFeedComponent = ({ model }: FeedComponentProps) => {
  const questions: Question[] = JSON.parse(model.data['questions']);
  const initialVotes = questions.map((question) => question.options.map(() => 0));
  const [votes, setVotes] = useState(initialVotes);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (optionIndex: number) => {
    if (!hasVoted) {
      const newVotes = [...votes];
      newVotes[currentQuestionIndex][optionIndex]++;
      setVotes(newVotes);
      model.data['votes'] = JSON.stringify(newVotes);
      setHasVoted(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setHasVoted(false); // Reset voting state for the new question
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setHasVoted(false); // Reset voting state for the previous question
    }
  };

  const totalVotes = votes[currentQuestionIndex].reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-r from-gray-800 to-black text-white w-full mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-2">{questions[currentQuestionIndex].question}</h2>
      </div>
      {questions[currentQuestionIndex].type === 'multiple-choice' ? (
        questions[currentQuestionIndex].options.map((option, optionIndex) => {
          const votePercentage = totalVotes > 0 ? (votes[currentQuestionIndex][optionIndex] / totalVotes) * 100 : 0;
          return (
            <div key={optionIndex} className="mb-4 relative">
              <button
                onClick={() => handleVote(optionIndex)}
                className="w-full p-2 text-left rounded-lg text-white relative overflow-hidden"
                style={{
                  backgroundColor: hasVoted ? '#4A5568' : '#2D3748', // Darken the color if already voted
                  cursor: hasVoted ? 'not-allowed' : 'pointer',
                }}
                disabled={hasVoted}
              >
                <span
                  className="absolute top-0 left-0 h-full bg-blue-500 rounded-lg"
                  style={{ width: `${votePercentage}%`, zIndex: -1 }}
                ></span>
                {option}
                <span className="ml-2 float-right text-sm">{votes[currentQuestionIndex][optionIndex]} votes</span>
              </button>
            </div>
          );
        })
      ) : (
        <select
          onChange={(e) => handleVote(parseInt(e.target.value))}
          className="w-full p-2 mb-2 bg-gray-600 rounded-lg text-white border border-gray-500"
          disabled={hasVoted}
        >
          {questions[currentQuestionIndex].options.map((option, optionIndex) => (
            <option key={optionIndex} value={optionIndex}>
              {option}
            </option>
          ))}
        </select>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`p-2 bg-blue-600 rounded-lg hover:bg-blue-500 ${
            currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Previous
        </button>
        <button
          onClick={nextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          className={`p-2 bg-blue-600 rounded-lg hover:bg-blue-500 ${
            currentQuestionIndex === questions.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};


export const QuickPollComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [questions, setQuestions] = useState<Question[]>([{ question: '', options: ['', ''], type: 'multiple-choice' }]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleQuestionChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const newQuestions = [...questions];
    newQuestions[index].question = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, e: ChangeEvent<HTMLInputElement>) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuestions(newQuestions);
  };

  const handleTypeChange = (index: number, e: ChangeEvent<HTMLSelectElement>) => {
    const newQuestions = [...questions];
    newQuestions[index].type = e.target.value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', ''], type: 'multiple-choice' }]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    model.data['questions'] = JSON.stringify(questions);
    done(model);
  };

  const navigateQuestion = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create a Quick Poll</h1>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => addQuestion()}
          className="text-xl p-2 bg-green-500 text-white rounded-full"
        >
          ➕
        </button>
        <button
          onClick={handleSubmit}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Post
        </button>
      </div>
      <div className="border p-4 bg-gray-100 rounded-lg">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter your question"
            value={questions[currentQuestionIndex].question}
            onChange={(e) => handleQuestionChange(currentQuestionIndex, e)}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <select
            value={questions[currentQuestionIndex].type}
            onChange={(e) => handleTypeChange(currentQuestionIndex, e)}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="dropdown">Dropdown</option>
          </select>
          {questions[currentQuestionIndex].options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center mb-2">
              <input
                type="text"
                placeholder={`Option ${optionIndex + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(currentQuestionIndex, optionIndex, e)}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {optionIndex === questions[currentQuestionIndex].options.length - 1 && (
                <button
                  onClick={() => addOption(currentQuestionIndex)}
                  className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  ➕
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => navigateQuestion('prev')}
            className={`p-2 bg-gray-500 text-white rounded ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button
            onClick={() => navigateQuestion('next')}
            className={`p-2 bg-gray-500 text-white rounded ${currentQuestionIndex === questions.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
