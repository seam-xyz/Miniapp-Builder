import './BlockStyles.css';
import 'swiper/css';
import React, { useState, useEffect, useRef } from 'react';
import { ComposerComponentProps, FeedComponentProps } from './types';
import ImageUploadPreview from './utils/ImageUploadPreview';
import ImageWithModal from './utils/ImageWithModal';
import { Button, TextField, Typography } from '@mui/material';

interface Thumbnail {
  uuid: string;
  url: string;
  votes: number;
}

export const PickrrFeedComponent: React.FC<FeedComponentProps> = ({ model, update }) => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [votedThumbnails, setVotedThumbnails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the thumbnails and votedThumbnails from model data
    const parsedThumbnails = model.data['thumbnails'] 
      ? JSON.parse(model.data['thumbnails']) 
      : [];
    setThumbnails(parsedThumbnails);

    const savedVotes = model.data['votedThumbnails'] 
      ? JSON.parse(model.data['votedThumbnails']) 
      : [];
    setVotedThumbnails(savedVotes);
  }, [model.data]);

  const handleVote = async (thumbnailId: string) => {
    if (votedThumbnails.includes(thumbnailId) || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    // Optimistically update the local state
    const updatedThumbnails = thumbnails.map(thumb => 
      thumb.uuid === thumbnailId ? { ...thumb, votes: thumb.votes + 1 } : thumb
    );
    const newVotedThumbnails = [...votedThumbnails, thumbnailId];

    setThumbnails(updatedThumbnails);
    setVotedThumbnails(newVotedThumbnails);

    // Prepare the updated data to be sent to the backend
    const updatedData = {
      ...model.data,
      thumbnails: JSON.stringify(updatedThumbnails),
      votedThumbnails: JSON.stringify(newVotedThumbnails),
    };

    try {
      // Check if update is a function before calling it
      if (typeof update === 'function') {
        await update(updatedData);
      } else {
        throw new Error('Update function is not defined');
      }
    } catch (error: any) {
      console.error('Failed to update votes:', error);
      // Revert the optimistic update
      setThumbnails(thumbnails);
      setVotedThumbnails(votedThumbnails);
      setError(`Failed to update vote: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (thumbnails.length === 0) {
    return <div>No thumbnails available.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <h2>{model.data['videoTitle'] || 'YouTube Thumbnail Voting'}</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {thumbnails.map((thumb) => (
          <div key={thumb.uuid} style={{ textAlign: 'center' }}>
            <ImageWithModal urls={[thumb.url]} style={{ width: '200px', height: 'auto' }} />
            <p>Votes: {thumb.votes}</p>
            <button 
              onClick={() => handleVote(thumb.uuid)} 
              disabled={votedThumbnails.includes(thumb.uuid) || isLoading}
            >
              {votedThumbnails.includes(thumb.uuid) ? 'Voted' : 'Vote'}
            </button>
          </div>
        ))}
      </div>
      {isLoading && <div>Updating vote...</div>}
    </div>
  );
};

export const PickrrComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [videoTitle, setVideoTitle] = useState(model.data['videoTitle'] || '');
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>(
    model.data['thumbnails'] ? JSON.parse(model.data['thumbnails']) : []
  );
  const [previewMode, setPreviewMode] = useState(false);

  const handleUpdate = (urls: string[]) => {
    const newThumbnails = urls.map(url => ({
      uuid: `thumb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url,
      votes: 0
    }));
    setThumbnails(newThumbnails);
    model.data['thumbnails'] = JSON.stringify(newThumbnails);
  };

  const handlePreview = () => {
    setPreviewMode(true);
  };

  const handleFinalize = () => {
    model.data['videoTitle'] = videoTitle;
    model.data['thumbnails'] = JSON.stringify(thumbnails);
    done(model);
  };

  if (previewMode) {
    return (
      <div className="w-full h-full">
        <h2>{videoTitle || 'YouTube Thumbnail Voting'}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {thumbnails.map((thumb) => (
            <div key={thumb.uuid} style={{ textAlign: 'center' }}>
              <ImageWithModal urls={[thumb.url]} style={{ width: '200px', height: 'auto' }} />
              <p>Votes: {thumb.votes}</p>
            </div>
          ))}
        </div>
        <Button onClick={() => setPreviewMode(false)} color = "secondary">Edit</Button>
        <Button onClick={handleFinalize} variant="contained" color="success">
            Post
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div className="absolute" style={{ textAlign: 'center', paddingTop: '20px', position: 'absolute',
                      top: '0',
                      left: '50%',
                      transform: 'translateX(-50%)',}}>
        <TextField
            style={{ textAlign: 'center' }}
            id="filled-textarea"
            label="Describe Your video here!"
            placeholder="Video Title"
            multiline
            variant="filled"
            
            onChange={(e) => setVideoTitle(e.target.value)}
          />
        <h2 style={{ textAlign: 'center' }}>Create a Youtube Thumbnail Poll!</h2>
      </div>
       <ImageUploadPreview
        initialUrls={thumbnails.map(thumb => thumb.url)}
        onUpdate={handleUpdate}
        onFinalize={handlePreview}
        
      />
    </div>
  );
};

const renderErrorState = () => {
  return (
    <img
      src="https://www.shutterstock.com/image-illustration/no-picture-available-placeholder-thumbnail-600nw-2179364083.jpg"
      alt="No thumbnails available"
      style={{ height: '100%', width: '100%' }}
    />
  );
};