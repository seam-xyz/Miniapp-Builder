import Block from './Block'
import { BlockModel } from './types'
import './BlockStyles.css'
import { useEffect, useRef, Suspense, lazy, useState } from 'react';
import { handleFilePicker } from './utils/handleFilePicker';
import { ThreeDViewer } from './utils/ThreeDViewer';
import { FirebaseStorage } from '@capacitor-firebase/storage';
import { nanoid } from "nanoid";

interface ObjectPickerProps {
  done: (data: BlockModel) => void;
  model: BlockModel;
}

const PickObjectComponent: React.FC<ObjectPickerProps> = ({ done, model }) => {
  const [fileUrl, setFileUrl] = useState(undefined);
  const [fileType, setFileType] = useState(undefined);
  const [blob, setBlob] = useState(undefined);
  const [progressPercent, setProgressPercent] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async () => {
    setUploading(true);

    const name = nanoid();
    const path = `threeD/${name}`;

    await FirebaseStorage.uploadFile({
      path,
      blob: blob,
      uri: fileUrl,
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

        setUploading(false);
      }
    });
  }

  const pickFile = async () => {
    const handleFilesUpload = async (files: any[]) => {
      if (files.length > 0) {
        const file = files[0];
        setFileUrl(file.path);
        setFileType(file.extension);
        setBlob(file.blob);
      }
    };
    handleFilePicker(".stl, .usdz", false, handleFilesUpload);
  };

  return (
    <div className="App">
      <button onClick={pickFile}>Pick 3D File</button>
      {blob && (
        <Suspense fallback={<div>Loading...</div>}>
          <ThreeDViewer blob={blob} fileUrl={fileUrl} fileType={fileType} />
        </Suspense>
      )}
      <button onClick={() => handleFileUpload()}>Upload</button>
    </div>
  );
}

export default class ThreeDBlock extends Block {
  render() {
    return (
      <h1>3D Block!</h1>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <PickObjectComponent done={done} model={this.model} />
    )
  }
}