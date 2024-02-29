import { Box, Button } from "@mui/material";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { nanoid } from "nanoid";
import { useState } from "react";

interface FileUploadComponentProps {
  onUpdate: (url: string) => void
}

export default function FileUploadComponent(
  { onUpdate }: FileUploadComponentProps
) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [progresspercent, setProgresspercent] = useState(0);

  const onFinish = (event: any) => {
    event.preventDefault();
    const file = event.target[0]?.files[0]
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
      <Box
        component="form"
        onSubmit={onFinish}
        style={{}}
      >
        <input type='file' />
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Upload
        </Button>
      </Box>
      {
        !imgUrl &&
        <div className='outerbar'>
          <div className='innerbar' style={{ width: `${progresspercent}%` }}>{progresspercent}%</div>
        </div>
      }
      {
        imgUrl &&
        <img src={imgUrl} alt='uploaded file' height={200} />
      }
    </div>
  );
}