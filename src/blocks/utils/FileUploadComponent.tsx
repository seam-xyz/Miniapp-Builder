import React, { useState } from 'react';
import { Box, Button, CircularProgress } from "@mui/material";
import { FirebaseStorage } from '@capacitor-firebase/storage';
import { nanoid } from "nanoid";
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { handleFilePicker } from './handleFilePicker';

interface FileUploadComponentProps {
  fileTypes: string; // e.g. 'image/*, video/*'
  label: string;
  onUpdate: (urls: string[]) => void;
  multiple: boolean;
  maxFiles: number;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ fileTypes, label, onUpdate, multiple, maxFiles }) => {
  const [progressPercent, setProgressPercent] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFilesUpload = async (files: any[]) => {
    if (files.length === 0) {
      console.log("No file selected");
      return;
    }

    setUploading(true);

    let urls: (string | undefined)[] = new Array(files.length).fill(undefined);

    for (let i = 0; i < files.slice(0, maxFiles).length; i++) {
      const file = files[i];
      const name = nanoid();
      const path = `files/${name}`;

      await FirebaseStorage.uploadFile({
        path,
        blob: file.blob,
        uri: file.path,
      }, async (event, error) => {
        if (error) {
          console.error("Upload failed:", error);
          return;
        }
        if (event) {
          setProgressPercent(event.progress * 100);
        }

        if (event && event.completed) {
          const { downloadUrl } = await FirebaseStorage.getDownloadUrl({ path });
          urls[i] = downloadUrl;
          if (!urls.includes(undefined)) {
            onUpdate(urls as string[]);
            setUploading(false);
          }
        }
      });
    }
  };

  return (
    <div>
      <Box component="form">
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          style={{
            width: '100%',
            height: '60px',
            padding: '10px',
            textTransform: 'none',
            fontFamily: "Public Sans",
            fontSize: "16px",
            background: uploading ? `linear-gradient(to right, #2196F3 ${progressPercent}%, #E0E0E0 ${progressPercent}%)` : undefined,
            backgroundColor: '#0051E8'
          }}
          disabled={uploading}
          onClick={(e) => {
            e.preventDefault();
            handleFilePicker(fileTypes, multiple, handleFilesUpload);
          }}
        >
          {uploading ? <CircularProgress size={24} /> : label}
        </Button>
      </Box>
    </div>
  );
};

export default FileUploadComponent;
