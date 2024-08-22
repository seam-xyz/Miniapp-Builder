import { useState, useEffect, useMemo } from 'react';
import ColorGame from './ColorCatcher';
import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types';

export const ColorFeedComponent = ({ model }: FeedComponentProps) => {
  const [bucketColor, setBucketColor] = useState<string>('');
  const [ballColor, setBallColor] = useState<string>('');

  // Initialize colors only once
  useEffect(() => {
    const num = parseInt(model.data.colorcatcherscheme,10)
    if( num === 0){
      setBucketColor('red');
      setBallColor('blue');
    }
    else if(num === 1){
      setBucketColor('blue');
      setBallColor('red');
    }
    else if(num === 2){
      setBucketColor('blue');
      setBallColor('blue');
    }
    else{
      setBucketColor('red');
      setBallColor('red');
    }
  }, [model.data.colorcatcherscheme]);

  return (
    <div className="flex flex-col items-center bg-gray-100 p-8 rounded-lg shadow-lg">
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">
        {model.data.colorcatchertitle} 
      </h2>

      <div className="relative w-[40vh] h-[15vh] bg-gradient-to-b from-gray-900 to-gray-700 flex items-center justify-center">
        <div
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-12 ${bucketColor === 'red' ? 'bg-red-600' : 'bg-blue-600'} rounded-t-lg border-4 border-gray-900 flex items-center justify-center`}
        >
          <span className="text-white text-1xl text-xs font-bold">
            Score: {model.data.colorcatcherscore}
          </span>
        </div>

        <div
  className={`absolute bottom-16 left-1/2 transform -translate-x-1/2 w-6 h-6 ${ballColor === 'red' ? 'bg-red-600' : 'bg-blue-600'} rounded-full`}
></div>
      </div>
    </div>
  );
}

export const ColorComposerComponent = ({ model, done }: ComposerComponentProps) => {
  return (
<div>
  <ColorGame model={model} done={done}></ColorGame>
</div>

  );
}