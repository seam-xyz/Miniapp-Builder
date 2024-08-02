import React from 'react';
import { Button } from '@mui/material';

interface SeamSaveButtonProps {
  onClick: any;
  title?: string
}

const SeamSaveButton: React.FC<SeamSaveButtonProps> = ({ onClick, title }) => {
  title = title || "Preview";
  return (
    <div className="flex justify-between items-center w-full h-[60px]">
      <Button
        variant="contained"
        fullWidth
        onClick={onClick}
        className="save-modal-button"
      >
        {title}
      </Button>
    </div>
  );
};

export default SeamSaveButton;
