import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import FileUploadComponent from './FileUploadComponent';

interface ImageUploadPreviewProps {
  initialUrls: string[];
  onUpdate: (urls: string[]) => void;
}

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({ initialUrls, onUpdate }) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialUrls);

  const handleUpdate = (urls: string[]) => {
    setPreviewUrls(urls);
    onUpdate(urls); // This updates the state in the ImageBlock component
  };

  return (
    <>
      <FileUploadComponent
        fileTypes="image/*"
        label="Upload Images"
        onUpdate={handleUpdate}
        multiple={true}
        maxFiles={10}
      />
      <Swiper spaceBetween={10} slidesPerView={'auto'}>
        {previewUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <img src={url} style={{ width: "100%", height: "auto" }} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default ImageUploadPreview;
