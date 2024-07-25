import { ComposerComponentProps, FeedComponentProps } from './types';
import './BlockStyles.css';
import { Box } from '@mui/material';
import { useState } from 'react';
import SeamSaveButton from '../components/SeamSaveButton';
import Iframely from './utils/Iframely';
import SpotifySearchBar from './utils/SpotifySearch/SpotifySearchBar';

const SearchScreen: React.FC<any> = ({ done, model, onFinalize }) => {
  const [url, setUrl] = useState<string>(model.data.url || '');
  const extractTrackUrl = (track: any) => {
    return track.external_urls.spotify;
  };

  const handleChooseTrack = (track: any) => {
    const trackUrl = extractTrackUrl(track);
    setUrl(trackUrl);
  };

  return (
    <div className="bg-seam-black w-full h-full flex flex-col items-center max-w-[600px] overflow-y-hidden hide-scrollbar">
      <div className="w-full h-full flex flex-col mt-[24px] items-center justify-center overflow-y-hidden hide-scrollbar space-y-3">
        <h3 style={{ color: 'white' }}> Music by Spotify </h3>
        <h3 className="" style={{ color: 'white', marginBottom: '44px', }}>Share the music that you love</h3>
        <SpotifySearchBar
          onChooseTrack={handleChooseTrack}
          selectedTrack={url}
        />
      </div>
      <Box className="bg-seam-black" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)', paddingTop: 'calc(env(safe-area-inset-bottom, 24px) + 24px)' }} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 3, bgcolor: 'background.paper', boxShadow: 3, zIndex: 1301 }}>
        <SeamSaveButton onClick={() => onFinalize(url)} />
      </Box>
    </div>
  );
};

export const MusicFeedComponent = ({ model }: FeedComponentProps) => {
  if (!model.data.url) {
    return <h1>No song selected</h1>;
  }

  return (
    <div style={{ color: "black", backgroundColor: "white", width: "100%", height: "100%" }}>
      {model.data.title && <h2 style={{ color: "black" }} className="text-start p-2">{model.data.title}</h2>}
      <Iframely
        url={model.data.url}
        style={{
          display: "flex",
          height: `100%`,
          width: `100%`
        }}
      />
    </div>
  );
}

export const MusicComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const onFinalize = (url: string) => {
    model.data.url = url; // store selected URL in model
    done(model); // go to preview step
  };

  return (
    <SearchScreen done={done} model={model} onFinalize={onFinalize} />
  );
}