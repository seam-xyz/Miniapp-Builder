import Block from './Block';
import { BlockModel } from './types';
import './BlockStyles.css';
import { Stack, Box } from '@mui/material';
import SpotifySearchBar from '../../../../src/SpotifySearch/SpotifySearchBar';
import { useState } from 'react';
import SeamSaveButton from '../components/SeamSaveButton';

interface Music {}

const SearchScreen: React.FC<any> = ({ done, model, onFinalize }) => {
  const [song, setSong] = useState<string>(model.data.song || '');

  const extractTrackId = (url: string) => {
    const match = url.match(/(?:track\/)([a-zA-Z0-9]+)/);
    return match ? match[1] : '';
  };

  const handleChooseTrack = (url: string) => {
    const trackId = extractTrackId(url);
    setSong(trackId);
  };

  return (
    <div className="bg-seam-black w-full h-full flex flex-col items-center max-w-[600px] overflow-y-hidden hide-scrollbar">
      <div className="w-full h-full flex flex-col mt-[24px] items-center justify-center overflow-y-hidden hide-scrollbar space-y-3">
        <h3 style={{ color: 'white' }}> Music by Spotify </h3>
        <h3 className="" style={{ color: 'white', marginBottom: '44px', }}>Share the music that you love</h3>
        <SpotifySearchBar
          onChooseTrack={handleChooseTrack}
          selectedTrack={song}
        />
      </div>
      <Box className="bg-seam-black" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)', paddingTop: 'calc(env(safe-area-inset-bottom, 24px) + 24px)' }} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 3, bgcolor: 'background.paper', boxShadow: 3, zIndex: 1301 }}>
        <SeamSaveButton onClick={() => onFinalize(song)} />
      </Box>
    </div>
  );
};

export default class MusicBlock extends Block {
  render() {
    return (
      <div className="w-full h-full">
        {this.model.data.song ? (
          <iframe
            src={`https://open.spotify.com/embed/track/${this.model.data.song}`}
            width="300"
            height="380"
            frameBorder="0"
            allow="encrypted-media"
            className="w-full flex-col"
          ></iframe>
        ) : (
          <h1>No song selected</h1>
        )}
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void): React.ReactNode {
    const onFinalize = (song: string) => {
      this.model.data.song = song; // store selected song in model
      done(this.model); // go to preview step
    };

    return (
      <SearchScreen done={done} model={this.model} onFinalize={onFinalize}/>
    );
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    );
  }
}