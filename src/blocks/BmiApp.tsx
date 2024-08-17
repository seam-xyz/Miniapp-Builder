import { ComposerComponentProps, FeedComponentProps } from './types';

import { useState } from 'react';


const BMIGauge = ({ bmi }: { bmi: number }) => {
  // Ensure BMI is between 10 and 40
  const safeBMI = Math.min(40, Math.max(10, bmi));

  // Calculate rotation angle (0 to 180 degrees)
  const rotation = ((safeBMI - 10) / 30) * 180 - 90;

  // Determine color and category based on BMI
  const getColorAndCategory = (bmi: number) => {
    if (bmi < 18.5) return { color: 'blue-500', category: 'Underweight' };
    if (bmi < 25) return { color: 'green-500', category: 'Normal' };
    if (bmi < 30) return { color: 'yellow-500', category: 'Overweight' };
    return { color: 'red-500', category: 'Obese' };
  };

  const { color, category } = getColorAndCategory(safeBMI);

  return (
    <div className="flex flex-col items-center flex-grow">
      <h1 className="text-2xl font-bold mb-4">Body Mass Index (BMI)</h1><br/>

      {/* Gauge */}
      <div className="w-64 h-40 relative">
        {/* Gauge background */}
        <div className="absolute w-full h-full bg-gray-200 rounded-t-full overflow-hidden">
          {/* Color segments */}
          <div className="absolute w-full h-full">
            <div className="absolute w-full h-full bg-blue-500"></div>
            <div
              className="absolute w-full h-full bg-green-500"
              style={{ transform: 'rotate(28deg)', transformOrigin: 'bottom center' }}
            ></div>
            <div
              className="absolute w-full h-full bg-yellow-500"
              style={{ transform: 'rotate(90deg)', transformOrigin: 'bottom center' }}
            ></div>
            <div
              className="absolute w-full h-full bg-red-500"
              style={{ transform: 'rotate(135deg)', transformOrigin: 'bottom center' }}
            ></div>
          </div>

          {/* Gauge mask */}
          <div className="absolute bg-white w-[90%] h-[90%] rounded-t-full bottom-0 left-1/2 transform -translate-x-1/2"></div>
        </div>

        {/* Needle */}
        <div
          className="absolute w-0.5 h-[95%] bg-gray-800 bottom-0 left-1/2 origin-bottom"
          style={{
            transform: `translateX(-50%) rotate(${rotation}deg)`,
            transition: 'transform 0.5s ease-out'
          }}
        ></div>

        {/* BMI markings */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-600">
          <span>10</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>40</span>
        </div>

        {/* BMI value display */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <span className={`text-2xl font-bold text-${color}`}>
            {bmi.toFixed(1)}
          </span>
        </div>
      </div>

      {/* BMI category label */}
      <div className={`mt-2 text-sm font-semibold text-${color}`}>{category}</div>
    </div>
  );
};


export const BmiFeedComponent = ({ model }: FeedComponentProps) => {
  return BMIGauge({ bmi: parseFloat(model.data['bmi']) });
}

export const BmiComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = Number(height) / 100;
      const bmiValue = (Number(weight) / (heightInMeters * heightInMeters)).toFixed(1);

      model.data['bmi'] = parseFloat(bmiValue).toString();
      done(model);

    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">BMI Calculator</h1>
        <div className="mb-4">
          <label className="block mb-2">Height (cm):</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Weight (kg):</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={calculateBMI}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          Calculate BMI
        </button>
      </div>
    </div>
  );
}