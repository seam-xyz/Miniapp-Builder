import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import { Button, Form, Input, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

// Handles fading images
const ImageFader = (props: { images: { image: string }[], duration: number }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 
  const images = props.images;
  const duration = props.duration;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevState => (prevState+1) % images.length); // increment prevstate, remainder of array length to loop over array index
    }, duration)

    return () => {
      clearInterval(interval)
    }
  }, [images.length, duration]);

  return (
    <div
      style={{ // have image take up entire block
        height: `100%`,
        width: `100%`
      }}
    >
      {images.map((image) => (
        <img
          key={image.image}
          src={image.image}
          title="image"
          style={{
            height: `100%`,
            width: `100%`,
            position: "absolute", // stack images
            opacity: images.indexOf(image) == currentImageIndex ? 1 : 0, // current image has 1 opacity, rest have 0 
            zIndex: 0, // under edit button
            transitionDelay: duration + "ms",
            transition: `opacity ${duration/5}ms ease-in-out` // change 5 to adjust transition speed
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

export default class PhotoAlbumBlock extends Block {
  render() {
    // renders tap to customize message by default
    if (Object.keys(this.model.data).length === 0 || this.model.data['images'].length === 0) { // default empty block if image array is empty
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }
    let images = convertToObjects(this.model.data['images']) // stores form data object in "images"
    let duration = parseFloat(this.model.data['duration'] ?? "5000") * 1000; // turns duration string from form into float, 5000ms by default, converts to seconds

    return <ImageFader images={images} duration={duration}></ImageFader>
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = (values: { images: { image: string }[], duration: string }) => {
      this.model.data['images'] = convertToImagesString(values)
      this.model.data['duration'] = values['duration'];
      done(this.model)
    };
    // form code mostly taken from profile and image block
    return (
      <Form
        name="basic"
        initialValues={{
          remember: true,
          images: convertToObjects(this.model.data['images']), // form data objects needed for inital values
          duration: this.model.data['duration']
        }}
        labelCol={{
          span: 8,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.List
          name="images"
          rules={[
            {
              validator: async (_, images) => {
                if (images.length > 10) { // set max amt of images allowed in block
                  return Promise.reject(new Error("Exceeded maximum image amount. (Max is 10)"));
                }
              },
            },
          ]}>
          {(fields, { add, remove }, { errors }) => {
            return (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'image']}
                      rules={[{ required: true, message: 'Missing image url' }]}
                    >
                      <Input placeholder="Image URL" style={{ width: "350px" }} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                {errors.length == 0 && ( // if under max album size include add image button
                  <Form.Item> 
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}> 
                      Add Image
                    </Button>
                  </Form.Item>
                )}
                <Form.ErrorList errors={errors} />
              </>
            )
          }}
        </Form.List>
        <Form.Item name="duration">
          <Input placeholder="Transition Speed (Seconds)" width="100%" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="save-modal-button">
            Save
          </Button>
        </Form.Item>
      </Form>
    )
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}