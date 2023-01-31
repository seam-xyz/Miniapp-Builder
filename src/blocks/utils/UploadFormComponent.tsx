import { Uploader, UploaderResult } from "uploader";
import { UploadDropzone } from "react-uploader";

interface UploaderProps {
  onUpdate: (files: UploaderResult[]) => void
}

export default function UploadFormComponent(
  { onUpdate }: UploaderProps
) {
  const uploader = Uploader({
    apiKey: process.env.REACT_APP_UPLOAD_KEY || "free"
  });
  
  const options = { 
    multi: false,
    style: {
      fontSize: 16
    },
    editor: {
      images: {
        crop: false // turn off crop because it's too easy to forget to hit done
      }
    },
  }

  return (
    <UploadDropzone uploader={uploader}
      options={options}        
      onUpdate={onUpdate}
      height="200px"/>
  )
}