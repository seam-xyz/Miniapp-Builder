import axios from 'axios';
import { useState } from 'react';
import { ComposerComponentProps, FeedComponentProps } from './types';

type SunSign =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

const sunSignIcons: Record<SunSign, string> = {
  Aries: '🐏',
  Taurus: '🐂',
  Gemini: '👯',
  Cancer: '🦀',
  Leo: '🦁',
  Virgo: '👧',
  Libra: '⚖️',
  Scorpio: '🦂',
  Sagittarius: '🏹',
  Capricorn: '🐐',
  Aquarius: '🏺',
  Pisces: '🐟',
};

const getTodaysHoroscope = async (sunsign: SunSign): Promise<string | undefined> => {
  const url = `https://ganesh-horoscope.vercel.app/today/${sunsign}`;

  try {
    let response = await axios.get(url);

    const horoscopeText = response?.data?.horoscope;

    return horoscopeText;
  } catch (error) {
    console.error("Error fetching the horoscope:", error);
    return undefined;
  }
};


export const HoroscopeFeedComponent = ({ model }: FeedComponentProps) => {
  const horoscope = model.data["horoscope"];
  const selectedSunSign = model.data["sunSign"] as SunSign;

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-lg">
      <div className="flex items-center justify-center mb-4">
        <h2 className="text-2xl font-bold">
          Today's {selectedSunSign} <span className="text-3xl mx-2">{sunSignIcons[selectedSunSign as SunSign]}</span>Horoscope
        </h2>
      </div>
      <p className="text-lg leading-relaxed">{horoscope}</p>
    </div>

  )
}

export const HoroscopeComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const sunSigns: SunSign[] = [
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius',
    'Capricorn',
    'Aquarius',
    'Pisces',
  ];

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSunSignClick = async (sunSign: SunSign) => {
    // Store the selected sun sign in the model
    try {
      setLoading(true);
      setError(null);

      const horoscopeText = await getTodaysHoroscope(sunSign);

      if (!horoscopeText) {
        throw new Error('Failed to fetch horoscope. Please try again later.');
      }

      model.data["sunSign"] = sunSign;
      model.data["horoscope"] = horoscopeText;
      done(model);
    } catch (err) {
      setError('Failed to fetch horoscope. Please try again later.');
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-lg"><h2 className="text-xl font-bold text-center mb-6">Select Your Sun Sign</h2><div className="max-h-48 overflow-y-scroll border border-gray-300 rounded-lg p-4 mb-6"><ul className="space-y-2">
      {sunSigns.map((sunSign) => (
        <li key={sunSign} className="cursor-pointer text-white-600 hover:text-blue-800" onClick={() => handleSunSignClick(sunSign)}
        >
          <span className="mr-2 text-2xl">{sunSignIcons[sunSign]}</span><span>{sunSign}</span>
        </li>
      ))}
    </ul></div>

      {loading && <div className="flex justify-center items-center"><div className="w-8 h-8 border-4 border-white-500 border-t-transparent border-solid rounded-full animate-spin"></div></div>}
      {error && <p className="text-center text-red-600">{error}</p>}

    </div>
  );
}
