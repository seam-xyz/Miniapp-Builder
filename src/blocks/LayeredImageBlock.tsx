import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import { Box, Key } from 'react-feather';
import { Button, Form, Space, Progress} from 'antd';
import { PlusOutlined, MinusCircleOutlined, HolderOutlined } from '@ant-design/icons';
import React, { useState, useEffect, SetStateAction, useRef } from 'react';
import Paragraph from 'antd/es/skeleton/Paragraph';
import FileUploadComponent from './utils/FileUploadComponent';
import { type } from 'os';
import { Mode, Padding, Scale } from '@mui/icons-material';
import { EventType } from '@testing-library/react';
import { first, round } from 'lodash';
import FormItem from 'antd/es/form/FormItem';
import { text } from 'stream/consumers';

// Converts form data object into joined URL string with commas
const convertToImagesString = (images: { image: string }[]) => {
  const imgs = images;
  const encodedUrls = imgs.map((image) => encodeURIComponent(image.image)); // converts urls to include character codes
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

const SliderCounter = (props:{images:{image:string}[], count: number, mode: boolean}) => {
  const [sliderValue, setSliderValue] = useState(0);
  const sliderMax = 1000;
  const maxRatio = 4/5;
  
  const [progress, setProgress] = useState(0);

  const images = props.images;
  const ImgCount = images.length;
  
  console.log("image count", ImgCount);
  const snapStep = sliderMax/ImgCount;
  const currentImage = Math.floor(sliderValue/snapStep);

  const imgRef = useRef<HTMLImageElement>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [firstImgSize,setFirstImgSize] = useState<number[]>([0,0]);
  const [imgContainerSize, setImgContainerSize] = useState<number[]>([0,0]);
  const [imgScaleFactor, setImgScaleFactor] = useState<number>();
  const [maxheight, setMaxHeight] = useState<number>();
  
  const currentSnapPoint = (_index: number, _imgMax: number, _sliderMax: number) => {
    // console.log(_index)
    // console.log(_imgMax)
    switch(_index){

      case 0:
        return 0
      case _imgMax - 1:
        
        return _sliderMax-1;
      default:
        return Math.floor((_index + 1) * (snapStep) - (snapStep/2));
    }
  }
  console.log("current Image", currentImage);
  console.log("current Snap Point", currentSnapPoint(currentImage,ImgCount, sliderMax));

  const sliderChange = (event: any) => {
    setSliderValue(parseInt(event.target.value));
  }

  const snapValue = (event: any) => {
    setSliderValue(currentSnapPoint(currentImage,ImgCount, sliderMax))
    console.log("drag ended");
  }

  const modeOpacity = (_image: any, currentImage: number, totalImg: number) => {
    if(props.mode){
      return _image <= (totalImg - 1) - currentImage ? 1 : 0;
    } else {
      return _image <= currentImage ? 1 : 0;
    }
  }

  const modePosition = (_image: any, totalImg: number) => {
    if(props.mode){
      return _image === (totalImg - 1) ? "relative" : "absolute";
    } else {
      return _image === 0 ? "relative" : "absolute";
    }
  }

  const pickRef = (_image: any, totalImg: number) => {
    if(props.mode){
      return _image === (totalImg - 1) ? imgRef: null
    } else {
      return _image === 0 ? imgRef: null
    }
  }

  const isBiggerThanRatio = (_imgSize: number[], _ratio: number) => {
    if(_imgSize[0] < _imgSize[1]){
      //true if the img ratio is bigger than specified ration
      console.log(`the image ratio is ${_imgSize[0]/(_ratio)} compared with the images width ${_imgSize[1]} ${(_imgSize[0]/(_ratio)) < _imgSize[1]}`)
      return (_imgSize[0]/(_ratio)) < _imgSize[1];
    } else {
      //img is horizontal
      console.log("the image is not verticle")
      return false;
    }
  }
  
  const findMaxheight = (_ratio: number, _containerWidth: number) => {
    return Math.floor(_containerWidth/_ratio) - 100;
  }
  
  const findScaleFactor = (_imgSize: number[], _maxHeight: number) => {
    console.log(_maxHeight);
    return _maxHeight/_imgSize[1]
  }

  const updateImageSize = () => {
    if(imgRef.current){
      setFirstImgSize([imgRef.current.width, imgRef.current.height]);
    }
  }

  const updateContainerSize = () => {
    if(imgContainerRef.current){
      setImgContainerSize([imgContainerRef.current.offsetWidth, imgContainerRef.current.offsetHeight])
    }
  }

  const isVerticleImg = (_imgSize: number[]) => {
    return _imgSize[0] < _imgSize[1];
  }



  const updateImageWidth = () => {
    if(imgRef.current){
      setFirstImgSize([imgRef.current.width, imgRef.current.height]);
    }
  }

  useEffect(() => {
    // const img = new Image();
    // img.src = images[0].image;
    // console.log("image src",img.src);
    // img.onload = () => {
    //   setFirstImgSize([img.width,img.height]);
    // }
    if(imgRef.current){
      imgRef.current.onload = () => {
        updateImageSize();
        
      }
    }

    window.addEventListener("resize", updateImageSize);

    return() => {
      window.removeEventListener('resize', updateImageSize);
    }
  }, [])

  useEffect(() => {
    updateContainerSize();
    
    console.log(`is Verticle ${isVerticleImg(firstImgSize)} ${firstImgSize} ${imgContainerSize}`);
    console.log(`max height ${findScaleFactor(firstImgSize, findMaxheight(maxRatio, imgContainerSize[0]))}`);

    window.addEventListener("resize", updateContainerSize);

    return() => {
      window.removeEventListener('resize', updateContainerSize);
    }

  },[firstImgSize])

  useEffect(() => {

    console.log("container size", imgContainerSize);

  }, [imgContainerRef,imgRef])

  useEffect(() => {
    const sliderProgress = (sliderValue/sliderMax) * 100;
    setProgress(sliderProgress);
  }, [sliderValue])

  useEffect(() => {
    setImgScaleFactor(findScaleFactor(firstImgSize, findMaxheight(maxRatio, imgContainerSize[0])));
    setMaxHeight(findMaxheight(maxRatio, imgContainerSize[0]));
  }, [imgContainerSize])

  return (
    <div style={{width:`100%`}}>

      <style>
      {`
        .LayeredImageBlock-slider {  
          -webkit-appearance: none;  /* Chrome, Safari, and other WebKit-based browsers */
          -moz-appearance: none;     /* Firefox */
          -ms-appearance: none;      /* Internet Explorer and Edge */
          appearance: none;          /* Standard appearance */
          padding: 0px;
          margin: 0px;
          width: 100%;
          height: 10px;
          border-radius: 5px;
          margin-right: 12px;
          flex-grow: inherit;
          Border: 2px solid #2050DF;
        }
 
        .LayeredImageBlock-slider::-webkit-slider-thumb {
          -webkit-appearance: none;  /* Override default CSS styles */
          width: 20px;
          height: 20px;
          border-radius: 10px;
          background: #2050DF;
        }

        .LayeredImageBlock-slider::-moz-range-thumb {
          width: 20px;               
          height: 20px;
          border-radius: 10px;
          background: #2050DF;
          border: none;              
        }

        .LayeredImageBlock-slider::-ms-thumb {
          width: 20px;              
          height: 20px;
          border-radius: 10px;
          background: #2050DF;
          border: none;             
        }

        .LayeredImageBlock-slider::-ms-track {
          width: 100%;
          height: 10px;
          background: transparent;  
          border-color: transparent;
          color: transparent;
        }

        .LayeredImageBlock-slider::-ms-fill-lower {
          background: #2050DF;      
          border-radius: 5px;
        }

        .LayeredImageBlock-slider::-ms-fill-upper {
          background: #2050DF;
          border-radius: 5px;
        }

      `}
      </style>
      <div style={{ width:`100%`, height:`${isBiggerThanRatio(firstImgSize,maxRatio) ? maxheight + "px" : "auto"}`,overflow:"hidden",}}>
      <div ref={imgContainerRef} style={{ width: "100%", height: "auto", position: "relative", overflow:"hidden",transformOrigin: "top center", borderRadius: "10px", scale: `${isBiggerThanRatio(firstImgSize,maxRatio) ? imgScaleFactor : 1}`}}>
        {images.map((image) => (
          <img
          key={images.indexOf(image)}
          ref = {pickRef(images.indexOf(image), ImgCount)}
          src={image.image}
          title="image"
          draggable="false"
          style={{
            width: `100%`,
            position: modePosition(images.indexOf(image), ImgCount),//images.indexOf(image) === 0 ? "relative": "absolute",
            opacity: modeOpacity(images.indexOf(image), currentImage, ImgCount),
            zIndex: 0,
            top: 0,
            // display: images.indexOf(image) > currentImage && images.indexOf(image) !== 0 ? "none" : "block"
          }}  
          />
      ))}
      
      </div>
      </div>
      <div
        className='slider_box'
        style={{
          color: "#b2bdbf",
          padding: "20px 10px 10px 10px", 
        }}
      >

        <div 
        className='slider'
        style={{
          display: "flex",
          alignItems: "center"
        }}
        >
          
          <input
            className={'LayeredImageBlock-slider'}
            style={{background: `linear-gradient(to right, #2050DF ${progress}%, #ccc ${progress}% )`}}
            type='range'
            min={0}
            max={sliderMax - 1}
            value={sliderValue}
            onChange={sliderChange}
            onMouseUp={snapValue}
            
          />
          <p style={{whiteSpace: 'nowrap', width: "7%", textAlign: "end"}}>{currentImage + 1} / {ImgCount}</p>
        </div>

        {/* <p>Slide for more {">>>"}</p> */}
      </div>
          
    </div>
  )

}

export default class ImageBlock extends Block {
  render() {
    
    let tempStr = "https%3A%2F%2Fjakeaicher.com%2Fwp-content%2Fuploads%2F2024%2F05%2FSeam_1.png,https%3A%2F%2Fjakeaicher.com%2Fwp-content%2Fuploads%2F2024%2F05%2FSeam_2.png,https%3A%2F%2Fjakeaicher.com%2Fwp-content%2Fuploads%2F2024%2F05%2FSeam_3.png,https%3A%2F%2Fjakeaicher.com%2Fwp-content%2Fuploads%2F2024%2F05%2FSeam_4-1.png,https%3A%2F%2Fjakeaicher.com%2Fwp-content%2Fuploads%2F2024%2F05%2FSeam_5.png,https%3A%2F%2Fjakeaicher.com%2Fwp-content%2Fuploads%2F2024%2F05%2FSeam_6.png,https%3A%2F%2Fjakeaicher.com%2Fwp-content%2Fuploads%2F2024%2F05%2F401_Viewport.png,https%3A%2F%2Fjakeaicher.com%2Fwp-content%2Fuploads%2F2024%2F05%2F0401.png,https%3A%2F%2Fjakeaicher.com%2Fwp-content%2Fuploads%2F2024%2F05%2F401_full.png"
    let tempLastThree = "https%3A%2F%2Fjakeaicher.com%2Fwp-content%2Fuploads%2F2024%2F05%2F401_Viewport.png,https%3A%2F%2Fjakeaicher.com%2Fwp-content%2Fuploads%2F2024%2F05%2F0401.png,https%3A%2F%2Fjakeaicher.com%2Fwp-content%2Fuploads%2F2024%2F05%2F401_full.png"
    
    let images = convertToObjects(this.model.data['images']) // should be this.model.data['images']. changed for test purposes
    //console.log("What", images);
    let isSubtract = (this.model.data["mode"] === "true");
    let count = images.length;

    return (
      <div
      style={{width: "100%"}}
      >
      <SliderCounter 
      images={images} 
      count={count} 
      mode={isSubtract}
      />
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    
    const onFinish = (values: { images: { image: string; }[]; isSubtract: boolean}) => {
      
      values.images = values.isSubtract === true ? values.images.reverse() :  values.images;
      this.model.data["images"] = convertToImagesString(values.images) //should be values
      console.log(this.model.data["images"]);
      console.log(values.isSubtract);
      this.model.data["mode"] = (values.isSubtract).toString();
      console.log(this.model.data["mode"]);
      
      done(this.model);

    }

      const Menu = () => {

        const [form] = Form.useForm();
        
        const [isImagesUploaded, setIsImagesUploaded] = useState(false);

        //for drag and drop
        const [dragItemIndex, setDragItemIndex] = useState<number | undefined>(undefined);
        const [dragOverItemIndex, setDragOverItemIndex] = useState<number | undefined>(undefined);
        const [isSubtract, setIsSubtract] = useState(form.getFieldValue('isSubtract'));

        const [imgs,setImgs] = useState(convertToObjects("https://jakeaicher.com/wp-content/uploads/2023/07/Research-Stats.png,https://jakeaicher.com/wp-content/uploads/2023/07/InsightCard.png,https://jakeaicher.com/wp-content/uploads/2023/07/Paper-Prototypes-Image.png, https://jakeaicher.com/wp-content/uploads/2024/07/Seam_Test_image.png"));
        const [firstImgSize, setFirstImgSize] = useState<number[]>();


        const CompareRatio = (_sizeOne: number[], _sizeTwo: number[]) => {
          const ratioOne = _sizeOne[0]/_sizeOne[1];
          const ratioTwo = _sizeTwo[0]/_sizeTwo[1];

          return {
            isGreater: ratioOne > ratioTwo,
            isLess: ratioOne < ratioTwo,
            isEqual: ratioOne === ratioTwo
          }

        }

        const setWarningText = (_sizeOne: number[], _sizeTwo: number[]) => {
          const compareResult = CompareRatio(_sizeOne, _sizeTwo);

          if(compareResult.isEqual){
            return ""
          } else if (compareResult.isGreater) {
            return "Image will be cropped. Does not match first images aspect ratio"
          } else if (compareResult.isLess) {
            return "Image will not fill frame. Does not match first images aspect ratio"
          }

        } 

        const handleDragStart = (index: number) => {
          setDragItemIndex(index);
          
        };

        const handleDragOver = (event: React.DragEvent) => {
          event.preventDefault();
          event.dataTransfer.effectAllowed="move";
          console.log(`item ${dragItemIndex} to position ${dragOverItemIndex}`);
        }

        const handleDrop = () => {
          if(dragItemIndex !== dragOverItemIndex && dragItemIndex !== undefined && dragOverItemIndex !== undefined){
          const tempArray = [...imgs];
          const [dragitem] = tempArray.splice(dragItemIndex, 1);
          tempArray.splice(dragOverItemIndex, 0, dragitem);
          setImgs(tempArray);
          
          }
          setDragItemIndex(undefined);
          setDragOverItemIndex(undefined);
          console.log(dragItemIndex + " " + dragOverItemIndex);
        }

        const handleDragEnd = () => {
          setDragItemIndex(undefined);
          setDragOverItemIndex(undefined);
        }

        const handleDragEnter = (index: number) => {
          setDragOverItemIndex(index);
        }

        const handleValueChange = (changedValues: any) => {
          if('isSubtract' in changedValues){
            setIsSubtract(changedValues.isSubtract)
          }

        }

        useEffect(() => {
          form.setFieldsValue({images: imgs});
        }, [form, imgs]);

        
        
        const extractFilename = (url: string) => {
          return url.split('/').pop();
        };

        const uploaderComponent = <FileUploadComponent
          fileTypes='image/*'
          label="Upload Images"
          onUpdate={(urls)=>{
          
            this.model.data['images'] = urls.join(",");
            setIsImagesUploaded(true);

          }}
          multiple={true}
          maxFiles={10}
          />;
        
        const uploadMenu = (
          <div>

            <h1>Layered Image</h1>

            <p style={{margin: "5px 5px 20px 5px"}}>
            Gallery of images that are revealed sequentially where transparent images can modify the images below.
            </p>
            <h3 style={{fontSize: "1rem", color:"#cfcfcf"}}>Step 1</h3>
            <h2 style={{margin: "0px 0px 16px 0px"}}>Add Images</h2>
            <p style={{fontSize: "0.8rem", margin: "16px 0px 16px 0px", padding: "0px 16px"}}>
            <span style={{fontWeight: "bold"}}>Tip:</span> Use images that are the same size or aspect ratio for best results.
        </p>
            {uploaderComponent}

            <button style={{width:"100%", height: "20px", backgroundColor: "black"}} type='button' onClick={() => setIsImagesUploaded(true)}></button>
            
          </div>
        )

        const layerOrderingMenu = 
        
       <>  
        
        <h3 style={{fontSize: "1rem", color:"#cfcfcf"}}>Step 2</h3>
        <h2 style={{margin: "0px 0px 16px 0px"}}>Order Images</h2>

        <Form form={form} initialValues={{images: imgs, isSubtract: false}}
        style={{width: "100%", display:"block"}}
        onValuesChange={handleValueChange}
        onFinish={onFinish}
        autoComplete="off"

        >
        {/* <div style={{display: "flex", margin: "32px 32px 32px 0px", flexDirection: "row", gap: "4%", boxSizing: "border-box"}}>
        
        <Form.Item
        //name="isSubtract"
        valuePropName='checked'
        >
        <Switch/> 
        </Form.Item>
        
        <div style={{display: "flex", flexDirection: "column", }}>
          
          <div style={{display:"flex", flexDirection: "row", alignItems: "baseline", gap: "2%"}}>
            <h3 style={{fontSize: "1rem"}}>{isSubtract ? "Subtract" : "Add"}</h3>
            <span style={{color:"#cfcfcf", fontSize: "1rem"}}>{isSubtract ? "" : "Default"}</span>
          </div>
        
          <p style={{height: "3rem", fontSize: "0.75rem",boxSizing: "border-box"}}>{isSubtract ? "Images are subtracted revealing the next image underneath (e.g. the 1st image will be removed to reveal 2nd image)" : "Images are added on top of previous images (e.g. the 1st image will be covered by the 2nd image)"} </p>
        </div>

        </div> */}

        <p style={{fontSize: "1rem", margin: "8px 0px 16px 0px"}}>
            Choose Layering Mode:
        </p>
        <FormItem
        name="isSubtract"
        >

        <div style={{display:"flex", flexDirection:"column", gap:" 4px"}}>
          <Button type={!isSubtract ? "primary" : "default"} onClick={() => {setIsSubtract(false); form.setFieldValue("isSubtract", false);}}
          style={{flex:1, height:"auto", padding:"12px 16px 12px 16px", textAlign:"left", overflowWrap:"break-word", whiteSpace:"normal", borderRadius:"8px"}}
          block>
            <div style={{display: "flex", flexDirection: "column",}}>
            
            <div style={{display:"flex", flexDirection: "row", alignItems: "baseline"}}>
              <h3 style={{fontSize: "1rem", marginTop:"-4px"}}>Add</h3>
            </div>
          
            <p style={{height: "auto", fontSize: "0.75rem",boxSizing: "border-box", flexWrap:"wrap"}}>
              Images are added on top of previous images. <br/> (e.g. the 1st image will be covered by the 2nd image) 
            </p>
          </div>
          </Button>
          
          <Button type={isSubtract ? "primary" : "default"} onClick={() => {setIsSubtract(true); form.setFieldValue("isSubtract", true);}} 
          style={{flex:1, height:"auto", padding:"12px 16px 12px 16px", textAlign:"left", overflowWrap:"break-word", whiteSpace:"normal", borderRadius:"8px"}}
          block>
          <div style={{display: "flex", flexDirection: "column", gap: "5%"}}>
            
            <div style={{display:"flex", flexDirection: "row", alignItems: "baseline"}}>
              <h3 style={{fontSize: "1rem", marginTop:"-4px"}}>Subtract</h3>
              
            </div>
          
            <p style={{height: "auto", fontSize: "0.75rem",boxSizing: "border-box", flexWrap:"wrap"}}>
              Images are subtracted revealing the next image underneath. <br/>(e.g. the 1st image will be removed to reveal 2nd image) 
            </p>

          </div>
          </Button>
        </div>
        
        
        </FormItem>
        
        
        <p style={{fontSize: "1rem", margin: "16px 0px 8px 0px"}}>
            Drag and drop to reorder
        </p>

        <p style={{fontSize: "0.8rem", margin: "16px 0px 16px 0px", padding: "0px 16px"}}>
            <span style={{fontWeight: "bold"}}>Tip:</span> First image determines post dimensions. If an image does not have the same aspect ratio, it will be cropped.
        </p>

        <div 
        className='form-list' 
        style={{
          padding:"16px 8px", 
          margin:"8px 0px 16px 0px", 
          // height: "300px", 
          // maxHeight:"500px",  
          // overflowY: "scroll",
        }}
        >
          
        <Form.List 
        name="images"
        rules={[
          {
            validator: async (_, images) => {
              if (images.length > 10) {
                return Promise.reject(new Error("Exceeded Maximum image amount. (max is ?)"));
              }
            },   
          },
          {
            validator: async (_, images) => {
              if (images.length < 2) {
                return Promise.reject(new Error("Minimum image amount not met. (min is 2)"));
              }
            },
          },
        ]}
        
      >
  
        {(fields, {remove}, { errors }) => {
          return (
            <>
              {fields.map(({ key, name, ...restField }) => {
              
              const imageUrl = form.getFieldValue(['images', name, 'image']);
              console.log(`Image URL for field ${name}:`, imageUrl);
              
              return (
              <div
              key={key} 
              style={dragOverItemIndex === key ? { width:"100%", outline:"2px solid #2050DF", backgroundColor:"#e4e6eb", padding:"8px 16px", borderRadius:"8px", margin:"7px 0px 16px 0px", opacity:"0.999"} : {width:"100%", backgroundColor:"#e4e6eb", padding:"8px 16px", borderRadius:"8px", margin:"7px 0px 16px 0px", opacity:"0.999"}} 
              draggable="true" 
              onDragStart={() => handleDragStart(key)}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnter={() => handleDragEnter(key)}
              onDragEnd={handleDragEnd}
              >
                
                  <div 
                  style={{display:"flex", justifyContent:"space-between", margin: "0px"}}
                  >
                  
                  <Form.Item
                    style={{display:"none", justifyContent:"center", margin: "0px"}}
                    {...restField}
                    name={[name, 'image']}
                    rules={[{ required: true, message: 'Missing image url' }]}
                  >

                  </Form.Item>

                  <HolderOutlined/>
                  
                  <div 
                  style={{
                    width: "350px", 
                    display:"flex", 
                    alignItems:"center",
                    justifyContent:"space-between"
                  }}
                  >
                    <span
                    style={{padding:"0px 16px"}}
                    >
                    {key + 1}
                    </span>
                    <div
                    style={{
                      border:"1px solid #c7c7c7", 
                      display:"inline-block", 
                      width: "100px", 
                      height: "56px",
                      overflow: "hidden",
                      borderRadius:"5px", 
                      userSelect:"none",
                      flexShrink:"0"
                      
                    }}
                    >
                    <img
                      src={form.getFieldValue(['images', name, 'image'])}
                     
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        userSelect:"none",
                        flexShrink:"0"
                      }}
                      draggable="false" 
                    />
                    </div>
                    
                    <div style={{width: "100%", height: "100%",padding:"0px 16px", display:'flex', flexDirection:"column", textAlign: 'left', }}>
                      <p style={{userSelect:"none", wordBreak:"break-word", whiteSpace:"normal", overflowWrap:"break-word"}}>{extractFilename(form.getFieldValue(['images', name, 'image']))}</p>
                      <p style={{
                        display: `${CompareRatio([1920,1080],[1910,1080]).isEqual ? "none" : "block"}`,
                        padding: "4px 8px",
                        fontSize: "0.65rem",
                        backgroundColor: 'black',
                        color:"white",
                        borderRadius:"4px",
                      }}
                      >
                        {setWarningText([1920,1080],[1910,1080])}
                      </p>
                    </div>
                  </div> 
                  <MinusCircleOutlined onClick={()=> remove(name)} />
                  </div>
                </div>
              );
        })}
              
    
              <Form.ErrorList errors={errors}/>
            </>
  
          )
        }}
        </Form.List>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="save-modal-button">preview</Button>
        </Form.Item>
        
        </Form>
      </> 
        return(
          <>
            <style>
              {`
                .hideScroll::-webkit-scrollbar {
                  display: none;
                }

                .hideScroll {
                  -ms-overflow-style: none;  /* IE and Edge */
                  scrollbar-width: none;  /* Firefox */
                }

              `}
            </style>

            <div className='hideScroll' style={{padding:"3px 12px", maxHeight: "90vh",overflow: "hidden", overflowY:"scroll",}}>
              {isImagesUploaded ? layerOrderingMenu : uploadMenu}
            </div>
          </>
          
        )
      }

    return (
      <>
        <Menu/>
      </>
    )
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}