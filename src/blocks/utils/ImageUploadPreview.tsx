import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import FileUploadComponent from './FileUploadComponent';
import { Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

interface ImageUploadPreviewProps {
  initialUrls: string[];
  onUpdate: (urls: string[]) => void;
  onFinalize: () => void;
}

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({ initialUrls, onUpdate, onFinalize }) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialUrls);

  const handleUpdate = (newUrls: string[]) => {
    // Merge new URLs with existing preview URLs
    const updatedUrls = [...previewUrls, ...newUrls];
    setPreviewUrls(updatedUrls);
    onUpdate(updatedUrls);  // Update the state in the ImageBlock component
  };

  const handleRemove = (index: number) => {
    const updatedUrls = previewUrls.filter((_, idx) => idx !== index);
    setPreviewUrls(updatedUrls);
    onUpdate(updatedUrls);  // Update the state in the ImageBlock component after removal
  };

  return (
    <>
      <FileUploadComponent
        fileTypes="image/*"
        label="Upload Images"
        onUpdate={handleUpdate}
        multiple={true}
        maxFiles={10}
      />
      <Swiper spaceBetween={10} slidesPerView={'auto'}>
        {previewUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div style={{ position: 'relative' }}>
              <img src={url} style={{ width: "100%", height: "auto" }} />
              <IconButton
                onClick={() => handleRemove(index)}
                style={{ position: 'absolute', right: 0, top: 0, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', margin: 4 }}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={onFinalize}
        style={{ marginTop: '20px' }}
      >
        Next
      </Button>
    </>
  );
};

export default ImageUploadPreview;