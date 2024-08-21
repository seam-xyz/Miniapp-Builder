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

export const PickrrFeedComponent = ({ model }: FeedComponentProps) => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>(
    model.data['thumbnails'] ? JSON.parse(model.data['thumbnails']) : []
  );
  const [votedThumbnails, setVotedThumbnails] = useState<string[]>([]);

  useEffect(() => {
    const savedVotes = localStorage.getItem(`voted_${model.uuid}`);
    if (savedVotes) {
      setVotedThumbnails(JSON.parse(savedVotes));
    }
  }, [model.uuid]);

  if (thumbnails.length === 0) {
    return renderErrorState();
  }

  const handleVote = (thumbnailId: string) => {
    if (!votedThumbnails.includes(thumbnailId)) {
      const updatedThumbnails = thumbnails.map(thumb => 
        thumb.uuid === thumbnailId ? { ...thumb, votes: thumb.votes + 1 } : thumb
      );
      setThumbnails(updatedThumbnails);
      model.data['thumbnails'] = JSON.stringify(updatedThumbnails);

      const newVotedThumbnails = [...votedThumbnails, thumbnailId];
      setVotedThumbnails(newVotedThumbnails);
      localStorage.setItem(`voted_${model.uuid}`, JSON.stringify(newVotedThumbnails));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <h2>{model.data['videoTitle'] || 'YouTube Thumbnail Voting'}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {thumbnails.map((thumb) => (
          <div key={thumb.uuid} style={{ textAlign: 'center' }}>
            <ImageWithModal urls={[thumb.url]} style={{ width: '200px', height: 'auto' }} />
            <p>Votes: {thumb.votes}</p>
            <button 
              onClick={() => handleVote(thumb.uuid)} 
              disabled={votedThumbnails.includes(thumb.uuid)}
            >
              {votedThumbnails.includes(thumb.uuid) ? 'Voted' : 'Vote'}
            </button>
          </div>
        ))}
      </div>
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