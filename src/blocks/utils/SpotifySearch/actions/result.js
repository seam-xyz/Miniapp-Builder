import { get } from '../utils/api';
import * as Sentry from "@sentry/react";

export const initiateGetResult = (searchTerm) => {
  return async (tracks) => {
    try {
      const API_URL = `https://api.spotify.com/v1/search?query=${encodeURIComponent(
        searchTerm
      )}&type=track`;
      const result = await get(API_URL);
      return result['tracks'];
    } catch (error) {
      Sentry.captureException(error);
      console.log('error', error);
    }
  };
};

export const getPlaylistTracks = async (playlistId) => {
  try {
    const API_URL = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const result = await get(API_URL);
    return result.items.map((item) => item.track);
  } catch (error) {
    Sentry.captureException(error);
    console.log('Error fetching playlist tracks:', error);
  }
};

export const getAudioFeatures = async (trackIds) => {
  try {
    const API_URL = `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`;
    const result = await get(API_URL);
    return result.audio_features;
  } catch (error) {
    Sentry.captureException(error);
    console.log('Error fetching audio features:', error);
  }
};

export const calculateWeightedScores = (audioFeatures) => {
  const relevantFeatures = {
    danceability: 1,
    energy: 1,
    speechiness: 1,
    acousticness: 1,
    instrumentalness: 1,
    liveness: 1,
    valence: 1,
  };

  // Calculate averages
  const averages = {};
  Object.keys(relevantFeatures).forEach((key) => {
    const sum = audioFeatures.reduce((acc, feature) => acc + feature[key], 0);
    averages[key] = sum / audioFeatures.length;
  });

  // Normalize scores
  const normalizedScores = {};
  Object.keys(relevantFeatures).forEach((key) => {
    const max = Math.max(...audioFeatures.map(feature => feature[key]));
    const min = Math.min(...audioFeatures.map(feature => feature[key]));
    normalizedScores[key] = (averages[key] - min) / (max - min);
  });

  // Apply weights (optional, set to 1 by default)
  const weightedScores = {};
  Object.keys(relevantFeatures).forEach((key) => {
    weightedScores[key] = normalizedScores[key] * relevantFeatures[key];
  });

  return weightedScores;
};