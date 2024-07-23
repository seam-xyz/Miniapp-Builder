import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Button, TextField, IconButton, Box } from "@mui/material";
import { PlusCircle, MinusCircle } from "react-feather";
import Block from './Block';
import { BlockModel } from './types';
import BlockFactory from './BlockFactory';
import './BlockStyles.css';

// Handles fading images
const ImageFader = (props: { images: { image: string }[], duration: number }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 
  const images = props.images;
  const duration = props.duration;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevState => (prevState + 1) % images.length); // increment prevstate, remainder of array length to loop over array index
    }, duration);

    return () => {
      clearInterval(interval);
    };
  }, [images.length, duration]);

  return (
    <div
      style={{ // have image take up entire block
        height: `100%`,
        width: `100%`
      }}
    >
      {images.map((image, index) => (
        <img
          key={image.image}
          src={image.image}
          title="image"
          style={{
            height: `100%`,
            width: `100%`,
            position: "absolute", // stack images
            opacity: index === currentImageIndex ? 1 : 0, // current image has 1 opacity, rest have 0 
            zIndex: 0, // under edit button
            transitionDelay: duration + "ms",
            transition: `opacity ${duration / 5}ms ease-in-out` // change 5 to adjust transition speed
          }}
        />
      ))}
    </div>
  )
}

// Converts form data object into joined URL string with commas
const convertToImagesString = (values: { images: { image: string }[] }) => {
  const images = values["images"];
  const encodedUrls = images.map((image) => encodeURIComponent(image.image)); // converts urls to include character codes
  const imageString = encodedUrls.join(",");
  return imageString;
}

// takes joined URL string with commas and converts it into form data object
const convertToObjects = (imageURLString: string | undefined) => {
  if (imageURLString === undefined) return []
  const imageURLS = imageURLString.split(",")
  return imageURLS.map(url => {
    return { image: decodeURIComponent(url) }
  })
}

interface EditModalProps {
  model: BlockModel;
  done: (data: BlockModel) => void;
}

const PhotoAlbumEditModal: React.FC<EditModalProps> = ({ model, done }) => {
  const [fields, setFields] = useState<{ image: string }[]>(convertToObjects(model.data['images']));
  const [duration, setDuration] = useState(model.data['duration'] ?? "5");
  const [errors, setErrors] = useState<string[]>([]);

  const handleAddField = () => {
    if (fields.length < 10) {
      setFields([...fields, { image: "" }]);
      setErrors([]);
    } else {
      setErrors(["Exceeded maximum image amount. (Max is 10)"]);
    }
  };

  const handleRemoveField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const handleFieldChange = (index: number, value: string) => {
    const newFields = [...fields];
    newFields[index].image = value;
    setFields(newFields);
  };

  const handleDurationChange = (value: string) => {
    setDuration(value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = { images: fields, duration };
    model.data['images'] = convertToImagesString(values);
    model.data['duration'] = duration;
    done(model);
  };

  return (
    <Box component="form" className="flex flex-col" onSubmit={handleSubmit}>
      {fields.map((field, index) => (
        <Box key={index} className="flex items-center mb-4">
          <TextField
            value={field.image}
            onChange={(e) => handleFieldChange(index, e.target.value)}
            placeholder="Image URL"
            style={{ width: "350px" }}
            required
          />
          <IconButton onClick={() => handleRemoveField(index)}>
            <MinusCircle />
          </IconButton>
        </Box>
      ))}
      {fields.length < 10 && (
        <Button variant="outlined" onClick={handleAddField} startIcon={<PlusCircle />}>
          Add Image
        </Button>
      )}
      {errors.length > 0 && <Box className="text-red-500">{errors[0]}</Box>}
      <TextField
        value={duration}
        onChange={(e) => handleDurationChange(e.target.value)}
        placeholder="Transition Speed (Seconds)"
        style={{ width: "100%", marginTop: "16px" }}
        required
      />
      <Button type="submit" variant="contained" color="primary" className="save-modal-button" style={{ marginTop: "16px" }}>
        Save
      </Button>
    </Box>
  )
};

export default class PhotoAlbumBlock extends Block {
  render() {
    // renders tap to customize message by default
    if (Object.keys(this.model.data).length === 0 || this.model.data['images'].length === 0) { // default empty block if image array is empty
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }
    let images = convertToObjects(this.model.data['images']) // stores form data object in "images"
    let duration = parseFloat(this.model.data['duration'] ?? "5") * 1000; // turns duration string from form into float, 5000ms by default, converts to seconds

    return <ImageFader images={images} duration={duration}></ImageFader>
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <PhotoAlbumEditModal model={this.model} done={done} />
    );
  }
}