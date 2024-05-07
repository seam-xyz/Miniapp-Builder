import React from 'react';
import Block from './Block';
import { BlockModel } from './types';
import BlockFactory from './BlockFactory';
import './BlockStyles.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ImageUploadPreview from './utils/ImageUploadPreview';

export default class ImageBlock extends Block {
  render(): React.ReactNode {
    const urls = this.model.data['urls'] ? JSON.parse(this.model.data['urls']) : [];
  
    if (urls.length === 0) {
      return this.renderErrorState();
    }
  
    return (
      <Swiper spaceBetween={10} slidesPerView={'auto'}>
        {urls.map((url: any, index: any) => (
          <SwiperSlide key={index}>
            <img src={url} style={{ width: "100%", height: "auto" }} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }  

  renderEditModal(done: (data: BlockModel) => void): React.ReactNode {
    const initialUrls = this.model.data['urls'] ? JSON.parse(this.model.data['urls']) : [];

    const handleUpdate = (urls: string[]) => {
      this.model.data['urls'] = JSON.stringify(urls);
      done(this.model);
    };

    return (
      <ImageUploadPreview initialUrls={initialUrls} onUpdate={handleUpdate} />
    );
  }

  renderErrorState() {
    return (
      <img
        src="https://www.shutterstock.com/image-illustration/no-picture-available-placeholder-thumbnail-600nw-2179364083.jpg"
        title="Image"
        style={{ height: '100%', width: '100%' }}
      />
    );
  }
}
