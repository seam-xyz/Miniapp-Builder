import React, { useState } from 'react';
import { Dialog, IconButton, DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ImageWithModalProps {
  src: string; // Image source URL
}

const ImageWithModal: React.FC<ImageWithModalProps> = ({ src }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <img src={src} style={{ width: "100%", height: "auto", cursor: 'pointer' }} onClick={handleOpen} alt="Zoomable" />
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen // This prop makes the dialog full-screen
        PaperProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)', // Dark background for better focus on the image
            boxShadow: 'none'
          }
        }}
      >
        <IconButton
          onClick={handleClose}
          style={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            color: 'white',
            zIndex: 1302 // Ensure the button is above the dialog content
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <img src={src} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Full screen" />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageWithModal;