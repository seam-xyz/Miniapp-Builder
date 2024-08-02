import React from 'react';
import TracksList from './TracksList';

const SearchResult = ({ onChooseTrack, tracks, selectedTrack }) => (
  <>
    {tracks && <TracksList onChooseTrack={onChooseTrack} tracks={tracks} selectedTrack={selectedTrack} />}
  </>
);

export default SearchResult;
