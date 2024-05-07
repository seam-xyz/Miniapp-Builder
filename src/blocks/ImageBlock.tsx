import React from 'react';
import Block from './Block';
import { BlockModel } from './types';
import BlockFactory from './BlockFactory';
import './BlockStyles.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ImageUploadPreview from './utils/ImageUploadPreview';
import ImageWithModal from './utils/ImageWithModal';

export default class ImageBlock extends Block {
  render(): React.ReactNode {
    let urls = this.model.data['urls'] ? JSON.parse(this.model.data['urls']) : [];
    if (!urls.length && this.model.data['url']) {
      urls = [this.model.data['url']]; // Normalize to array format
    }

    if (urls.length === 0) {
      return this.renderErrorState();
    }

    if (urls.length === 1) { // for only one image have it full block width
      return (
        <div style={{ display: 'block', width: '100%' }}>
          <ImageWithModal urls={urls} />
        </div>
      );
    } else {
      return ( // for multiple images set max height
        <div style={{ display: 'flex', overflowX: 'scroll', gap: '10px', alignItems: 'center', backgroundColor: 'white' }}>
          <ImageWithModal urls={urls} />
        </div>
      );
    }
  }

  renderEditModal(done: (data: BlockModel) => void): React.ReactNode {
    const initialUrls = this.model.data['urls'] ? JSON.parse(this.model.data['urls']) : (this.model.data['url'] ? [this.model.data['url']] : []);

    const handleUpdate = (urls: string[]) => {
      this.model.data['urls'] = JSON.stringify(urls);  // Always save in new array format
    };

    const handleFinalize = () => {
      done(this.model);  // go to preview step
    };

    return (
      <div className="relative w-full h-full">
        <ImageUploadPreview 
          initialUrls={initialUrls} 
          onUpdate={handleUpdate} 
          onFinalize={handleFinalize} 
        />
      </div>
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
