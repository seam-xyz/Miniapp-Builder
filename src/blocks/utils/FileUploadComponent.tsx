// FileUploadComponent.tsx
import React, { useState } from 'react';
import { Box, Button, CircularProgress } from "@mui/material";
import { FirebaseStorage } from '@capacitor-firebase/storage';
import { nanoid } from "nanoid";
import { FilePicker } from '@capawesome/capacitor-file-picker';

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
      
          const urls: string[] = [];
          setUploading(true);
      
          for (const file of files.slice(0, maxFiles)) {
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
                  urls.push(downloadUrl);
                  if (urls.length === files.length || urls.length === maxFiles) {
                    onUpdate(urls);
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
                  padding: '10px',
                  textTransform: 'none',
                  fontFamily: "Public Sans",
                  fontSize: "16px",
                  background: uploading ? `linear-gradient(to right, #2196F3 ${progressPercent}%, #E0E0E0 ${progressPercent}%)` : undefined
                }}
                disabled={uploading}
                onClick={async (e) => {
                  e.preventDefault();
                  const result = await FilePicker.pickFiles({
                    types: fileTypes.split(',').map(type => type.trim()), // Split and trim to ensure proper format
                    multiple: multiple,
                    readData: true
                  });
      
                  if (result) {
                    handleFilesUpload(result.files);
                  }
                }}
              >
                {uploading ? <CircularProgress size={24} /> : label}
              </Button>
            </Box>
          </div>
        );
      };
      
      export default FileUploadComponent;
      
