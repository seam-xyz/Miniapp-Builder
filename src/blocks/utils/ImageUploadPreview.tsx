import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import FileUploadComponent from './FileUploadComponent';
import { Button, IconButton, Box } from "@mui/material";
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
    onUpdate(updatedUrls); 
  };

  const handleRemove = (index: number) => {
    const updatedUrls = previewUrls.filter((_, idx) => idx !== index);
    setPreviewUrls(updatedUrls);
    onUpdate(updatedUrls);  // Update the state in the ImageBlock component after removal
  };

  return (
    <>
      <div style={{ display: 'flex', overflowX: 'auto', padding: '10px', gap: '10px', alignItems: 'start' }}>
        {previewUrls.map((url, index) => (
          <div key={index} style={{ position: 'relative', flex: '0 0 auto' }}>
            <img src={url} style={{ height: "176px", width: 'auto', objectFit: 'contain' }} />
            <IconButton
              onClick={() => handleRemove(index)}
              style={{ position: 'absolute', right: 0, top: 0, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', margin: 4 }}
            >
              <CloseIcon />
            </IconButton>
          </div>
        ))}
      </div>
      <Box style={{paddingBottom: 'env(safe-area-inset-bottom)'}} sx={{ paddingBottom: '16px', position: 'fixed', bottom: 0, left: 0, right: 0, p: 3, bgcolor: 'background.paper', boxShadow: 3, zIndex: 1301 }}>
        <FileUploadComponent
          fileTypes="image/*"
          label="Upload Images"
          onUpdate={handleUpdate}
          multiple={true}
          maxFiles={10}
        />
        {previewUrls.length > 0 && (
          <Button 
            component="label"
            variant="contained" 
            color="primary"
            fullWidth
            onClick={onFinalize}
            sx={{ p: '10px', textTransform: 'none', mt: '8px', height: '60px', fontFamily: "Public Sans", fontSize: "16px", backgroundColor: "#101010"  }}
          >
            Preview
          </Button>
        )}
      </Box>
    </>
  );
};

export default ImageUploadPreview;