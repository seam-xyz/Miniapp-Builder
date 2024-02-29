import { Box, Button } from "@mui/material";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { nanoid } from "nanoid";
import { useState } from "react";

interface FileUploadComponentProps {
  fileTypes: string, // e.g. 'image/*, video/*'
  onUpdate: (url: string) => void
}

export default function FileUploadComponent(
  { fileTypes, onUpdate }: FileUploadComponentProps
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
        <input
          type='file'
          accept={types}
          onChange={(e) => {
            e.preventDefault();
            console.log("file chosen")
            onFinish(e.target.files);
          }} />
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