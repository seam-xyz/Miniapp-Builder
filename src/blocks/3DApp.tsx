import Block from './Block'
import { BlockModel } from './types'
import './BlockStyles.css'
import { useEffect, useRef, Suspense, lazy, useState } from 'react';
import { handleFilePicker } from './utils/handleFilePicker';
import { ThreeDViewer } from './utils/ThreeDViewer';

function PickObjectComponent() {
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [blob, setBlob] = useState(null);

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

  console.log("blob selected: ", blob)

  return (
    <div className="App">
      <button onClick={pickFile}>Pick 3D File</button>
      {blob && (
        <Suspense fallback={<div>Loading...</div>}>
          <ThreeDViewer blob={blob} fileUrl={fileUrl} fileType={fileType} />
        </Suspense>
      )}
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
      <PickObjectComponent />
    )
  }
}