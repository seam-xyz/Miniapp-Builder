import { Box, Button, CircularProgress } from "@mui/material";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { nanoid } from "nanoid";
import { useState } from "react";

interface FileUploadComponentProps {
  fileTypes: string, // e.g. 'image/*, video/*'
  label: string,
  onUpdate: (url: string) => void
}

export default function FileUploadComponent(
  { fileTypes, label, onUpdate }: FileUploadComponentProps
) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [progresspercent, setProgresspercent] = useState(0);
  let types = fileTypes == "" ? 'image/*' : fileTypes;

  const onFinish = (files: any) => {
    const file = files[0]
    if (!file) return;
    const storage = getStorage();
    const name = nanoid()
    const storageRef = ref(storage, `files/${name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed",
      (snapshot) => {
        const progress =
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL)
          onUpdate(downloadURL);
        });
      }
    );
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
        >
          {progresspercent == 0 ? label : <CircularProgress size={24} />}
          <input
            type='file'
            accept={types}
            onChange={(e) => {
              e.preventDefault();
              onFinish(e.target.files);
            }}
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: '0',
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              border: '0'
            }}
          />
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