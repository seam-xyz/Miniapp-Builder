import { Box, Button, CircularProgress } from "@mui/material";
import { FirebaseStorage } from '@capacitor-firebase/storage';
import { nanoid } from "nanoid";
import { useState } from "react";
import { FilePicker } from '@capawesome/capacitor-file-picker';

interface FileUploadComponentProps {
  fileTypes: string, // e.g. 'image/*, video/*'
  label: string,
  onUpdate: (url: string) => void
}

export default function VideoUploadComponent(
  { fileTypes, label, onUpdate }: FileUploadComponentProps
) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [progresspercent, setProgresspercent] = useState(0);
  let types = fileTypes == "" ? 'image/*' : fileTypes;

  const onFinish = async (files: any) => {
    const file = files[0]
    if (!file) {
      console.log("no file selected")
      return;
    }
    const name = nanoid()
    const path = `files/${name}`;
    setProgresspercent(1)
    await FirebaseStorage.uploadFile(
      {
        path: path,
        blob: file.blob,
        uri: file.path,
      },
      async (event, error) => {
        if (error) {
          return;
        }
        if (event) {
          setProgresspercent(event.progress * 100);
        }

        if (event && event.completed) {
          const { downloadUrl } = await FirebaseStorage.getDownloadUrl({
            path: path,
          });
          onUpdate(downloadUrl);
        }
      });
  }

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
            background: progresspercent != 0 ? `linear-gradient(to right, #2196F3 ${progresspercent}%, #E0E0E0 ${progresspercent}%)` : undefined
          }}
          disabled={progresspercent != 0}
          onClick={async (e) => {
            e.preventDefault();
            try {
              const result = await FilePicker.pickVideos({
                multiple: false,
                readData: true
              })
              if (result) {
                onFinish(result.files);
              }
            } catch (error) { }
          }}
        >
          {progresspercent == 0 ? label : <CircularProgress size={24} />}
        </Button>
      </Box>
      {
        imgUrl &&
        <div className='outerbar'>
          <div className='innerbar' style={{ width: `${progresspercent}%` }}>{progresspercent}%</div>
        </div>
      }
    </div>
  );
}