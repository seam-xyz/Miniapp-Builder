import './BlockStyles.css';
import 'swiper/css';
import ImageUploadPreview from './utils/ImageUploadPreview';
import ImageWithModal from './utils/ImageWithModal';
import { ComposerComponentProps, FeedComponentProps } from './types';

export const ImageFeedComponent = ({ model }: FeedComponentProps) => {
  let urls = model.data['urls'] ? JSON.parse(model.data['urls']) : [];
  if (!urls.length && model.data['url']) {
    urls = [model.data['url']]; // Normalize to array format
  }

  if (urls.length === 0) {
    return renderErrorState();
  }

  if (urls.length === 1) {
    // For only one image, set it to 100% width with max height of 300px
    return (
      <div style={{ display: 'block', width: '100%' }}>
        <ImageWithModal urls={urls} style={{ width: '100%', height: 'auto' }} />
      </div>
    );
  } else {
    // For multiple images, apply a horizontal scroll with image styling similar to ImageUploadPreview
    return (
      <div style={{ display: 'flex', overflowX: 'scroll', gap: '10px', alignItems: 'center', backgroundColor: 'white' }}>
        <ImageWithModal urls={urls} style={{ height: "300px", width: 'auto', maxWidth: '300px' }} />  
      </div>
    );
  }
}

export const ImageComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const initialUrls = model.data['urls'] ? JSON.parse(model.data['urls']) : (model.data['url'] ? [model.data['url']] : []);

  const handleUpdate = (urls: string[]) => {
    model.data['urls'] = JSON.stringify(urls);  // Always save in new array format
  };

  const handleFinalize = () => {
    done(model);  // go to preview step
  };

  return (
    <div className="w-full h-full">
      <ImageUploadPreview 
        initialUrls={initialUrls} 
        onUpdate={handleUpdate} 
        onFinalize={handleFinalize} 
      />
    </div>
  );
}

const renderErrorState = () => {
  return (
    <img
      src="https://www.shutterstock.com/image-illustration/no-picture-available-placeholder-thumbnail-600nw-2179364083.jpg"
      title="Image"
      style={{ height: '100%', width: '100%' }}
    />
  );
}