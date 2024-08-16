import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types';
import React, { useState, useEffect } from 'react';

import brokenFCIcon from "./blockIcons/BrokenFCIcon.png";
import FCIcon from "./blockIcons/FCIcon.png";

export const QuoterFeedComponent = ({ model }: FeedComponentProps) => {
  const quote = model.data.quote;

  return (
    <div>
      <p style={{
        fontSize: '20px',
        fontStyle: 'italic',
        fontWeight: '500',
        color: '#444',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        border: '1px solid #ddd',
        padding: '15px',
        marginTop: '20px',
        maxWidth: '600px',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}>{quote}</p>
    </div>
  );
}

const quotes: { [key: string]: string[] } = {
  "anger": [
    "In the heat of the storm, find the calm within.",
    "From the forge of frustration, the strength of character is born.",
    "Amidst the tempest, the lighthouse of your heart shines brightest.",
    "When the flames rage, the ember of wisdom glows within.",
    "The roaring thunder reveals the path through the storm.",
    "From the conflict, clarity and courage emerge.",
    "In the clash of forces, the strength of the spirit is revealed.",
    "The fiery furnace tempers the steel of your resolve.",
    "Through the raging waves, the lighthouse guides your way.",
    "In the blaze of passion, find the calm of understanding."
  ],
  "disgust": [
    "The shadow of distaste reveals the light of truth.",
    "From the discomfort, clarity and insight blossom.",
    "In the murky waters, the pearl of understanding is found.",
    "The thorny path often leads to the sweetest bloom.",
    "Through the veil of repulsion, the seeds of wisdom are sown.",
    "The taste of the bitter reveals the essence of change.",
    "In the storm of aversion, the rainbow of insight appears.",
    "The cracked surface uncovers the gem of realization.",
    "The bitter herb unveils the secret of the garden.",
    "From the clouded skies, the sun of revelation shines through."
  ],
  "fear": [
    "In the darkened forest, the lantern of courage lights the way.",
    "The chill of fear uncovers the warmth of bravery within.",
    "Through the shadows, the dawn of strength begins to break.",
    "The trembling leaf finds its strength against the wind.",
    "From the depths of apprehension, the path to courage emerges.",
    "The silent night holds the promise of a brighter dawn.",
    "The shadows of fear unveil the light of your inner resolve.",
    "In the storm of uncertainty, the calm of wisdom appears.",
    "The echo of fear whispers of hidden strength and growth.",
    "The shadow’s edge reveals the dawn of transformation."
  ],
  "joy": [
    "In the dance of the sun, the heart finds its song.",
    "The golden rays of happiness illuminate your path.",
    "The sweet bloom of joy opens the garden of the soul.",
    "In the symphony of delight, every note is a treasure.",
    "The sparkle of joy reveals the essence of your spirit.",
    "From the light of laughter, the beauty of life shines forth.",
    "The rainbow of happiness colors your world with grace.",
    "In the embrace of joy, the soul finds its true rhythm.",
    "The brilliance of joy reflects the beauty of your journey.",
    "In the garden of light, every petal tells a story of wonder."
  ],
  "neutral": [
    "In the stillness, the balance of your heart is revealed.",
    "The calm waters reflect the serenity of your soul.",
    "In the quiet of balance, the seeds of future growth are planted.",
    "The gentle breeze of neutrality guides you to new horizons.",
    "The peaceful dawn promises the clarity of new beginnings.",
    "In the calm of the moment, the path to insight unfolds.",
    "The serene landscape mirrors the stability of your spirit.",
    "From the tranquil garden, new possibilities are born.",
    "The quiet harmony unveils the foundation for future dreams.",
    "In the stillness, the path to your heart's desires becomes clear."
  ],
  "sadness": [
    "From the rain of sorrow, the seeds of renewal are sown.",
    "The shadowed clouds conceal the promise of a brighter sky.",
    "In the quiet of sadness, the echoes of healing are heard.",
    "The falling leaves of autumn prepare the ground for new life.",
    "From the tears of the soul, the flowers of growth emerge.",
    "The twilight of sadness ushers in the dawn of understanding.",
    "In the gentle rain, the roots of wisdom find nourishment.",
    "The cold wind of sorrow clears the path to a new beginning.",
    "Through the veil of melancholy, the light of renewal shines.",
    "In the embrace of sadness, the strength to start anew is found."
  ],
  "surprise": [
    "In the unexpected twist, the path of discovery is revealed.",
    "The sudden burst of change unveils the treasure of opportunity.",
    "From the surprise, the doors to new adventures swing wide.",
    "The uncharted moment holds the map to hidden treasures.",
    "In the flash of the unforeseen, the light of new paths shines.",
    "The unexpected turn of fate guides you to unexplored realms.",
    "In the surprise of the moment, the seeds of change are planted.",
    "The sudden revelation opens the gateway to your next journey.",
    "In the surprise lies the promise of new beginnings.",
    "The unanticipated event leads to the discovery of hidden potential."
  ]
};

export const QuoterComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [text, setText] = useState<string>('');
  const [result, setResult] = useState<any>([]);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<string | null>(null);

  const [showQuote, setShowQuote] = useState<boolean>(false);

  const apiToken = process.env.REACT_APP_API_KEY;
  const apiUrl = "https://api-inference.huggingface.co/models/michellejieli/emotion_text_classifier";

  // API 호출 함수
  const query = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "inputs": text }), // API 요청 본문
      });

      const data = await response.json();
      setResult(data);
      setError(null); // 오류가 없으면 오류 상태를 초기화합니다

      // 결과로부터 감정을 추출합니다
      if (Array.isArray(data) && data.length > 0) {
        const firstResult = data[0];
        if (Array.isArray(firstResult) && firstResult.length > 0) {
          const extractedEmotion = firstResult[0]['label'];
          setEmotion(extractedEmotion); // 감정을 상태에 설정
        }
      } else {
        setTimeout(() => {
          query();
        }, 5000);
      }

    } catch (error: any) {
      setError(error.message);
    }
  };

  // 감정 상태에 따라 인용구를 업데이트하는 함수
  const updateQuote = (emotion: string | null) => {
    if (emotion && quotes[emotion]) {
      // 명언 배열에서 랜덤으로 선택
      const randomQuote = quotes[emotion][Math.floor(Math.random() * quotes[emotion].length)];
      setQuote(randomQuote);
    } else {
      setQuote(null); // 감정이 정의되지 않은 경우 인용구 초기화
    }
  };

  // 감정 상태가 변경될 때마다 updateQuote 호출
  useEffect(() => {
    if (emotion !== null) {
      updateQuote(emotion);
    }
  }, [emotion]);

  const analyzeText = () => {
    if (text !== '') {
      query();
      setShowQuote(true);
    }
  }

  const handleSubmit = () => {
    model.data.quote = quote || "";
    done(model);
  }

  return (
    <div>
      {!showQuote ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f4f4f9',
          margin: 0
        }}>
          <img src={FCIcon} alt='Fortune Cookie Icon' style={{
            width: '80px',
            height: '80px',
            marginBottom: '20px'
          }} />
          <h1 style={{
            fontSize: '24px',
            marginBottom: '20px',
            color: '#333',
            fontWeight: 'bold'
          }}>How was your day?</h1>

          <textarea
            style={{
              width: '80%',
              maxWidth: '600px',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '16px',
              resize: 'vertical',
              boxSizing: 'border-box',
              marginBottom: '10px',
              borderColor: '#343a40'
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your story here"
          />
          <button
            style={{
              backgroundColor: '#343a40',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onClick={analyzeText}>
            Open the fortune cookie
          </button>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
          alignItems: 'center',
          flexDirection: 'column'

        }}>
          {error && <p>Error: {error}</p>}
          <img src={brokenFCIcon} alt='Fortune Cookie Icon' style={{
            width: '100px',
            height: '100px',
            marginBottom: '20px'
          }} />
          {quote && <p style={{
            fontSize: '20px',
            fontStyle: 'italic',
            fontWeight: '500',
            color: '#444',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            border: '1px solid #ddd',
            padding: '15px',
            marginTop: '20px',
            maxWidth: '600px',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}>{quote}</p>}

          <button style={{
            backgroundColor: '#343a40',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '10px',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }} onClick={handleSubmit}> Post </button>

        </div>
      )}
    </div>
  );
}
