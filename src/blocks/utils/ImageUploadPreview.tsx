import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import FileUploadComponent from './FileUploadComponent';
import { Button, IconButton, Box } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ImageEmptyIcon from "../blockIcons/ImageEmptyIcon.png";

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
      {previewUrls.length === 0 ? (
        <div className="my-auto" style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', height: '80%', width: '100%' }}>
          <img src={ImageEmptyIcon} alt="No Images" style={{ width: '150px', height: '150px' }} />
          <h3 className="text-seam-black/20">Choose up to 10 photos.</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', overflowX: 'auto', padding: '10px', gap: '10px', alignItems: 'center', height: 'calc(100vh - 300px)' }}>
          {previewUrls.map((url, index) => (
            <div key={index} style={{ position: 'relative', flex: '0 0 auto' }}>
              <img src={url} style={{ height: "300px", width: 'auto', maxWidth: '300px', objectFit: 'cover' }} />
              <IconButton
                onClick={() => handleRemove(index)}
                style={{ position: 'absolute', right: 0, top: 0, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', margin: 4 }}
              >
                <CloseIcon />
              </IconButton>
            </div>
          ))}
        </div>
      )}
      <Box style={{ paddingBottom: `calc(env(safe-area-inset-bottom, 24px) + 24px)` }} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 3, bgcolor: 'background.paper', boxShadow: 3, zIndex: 1301 }}>
        <FileUploadComponent
          fileTypes="image/*"
          label={previewUrls.length > 0 ? "Upload More Images" : "Upload Images"}
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
            sx={{ p: '10px', textTransform: 'none', mt: '8px', height: '60px', fontFamily: "Public Sans", fontSize: "16px", backgroundColor: "#101010" }}
          >
            Preview
          </Button>
        )}
      </Box>
    </>
  );
};

export default ImageUploadPreview;