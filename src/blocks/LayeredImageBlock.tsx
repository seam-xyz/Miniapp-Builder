
import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css';
import './assets/LayeredImageBlock/LayeredImageStyles.css';
import { Box, Key } from 'react-feather';
import React, { useState, useEffect, SetStateAction, useRef } from 'react';
import FileUploadComponent from './utils/FileUploadComponent';
import SeamSaveButton from '../components/SeamSaveButton';

import GrabbableDots from './assets/LayeredImageBlock/GrabbableDots.svg'

import { type } from 'os';
import { Mode, Padding, Scale } from '@mui/icons-material';
import { EventType } from '@testing-library/react';
import { first, round } from 'lodash';
import { text } from 'stream/consumers';
import { id } from 'date-fns/locale';


const convertToImagesString = (images: { src: string }[]) => {
  const imgs = images;
  const encodedUrls = imgs.map((image) => encodeURIComponent(image.src));
  const imageString = encodedUrls.join(",");
  return imageString;
}

const convertToObjects = (imageURLString: string | undefined) => {
  if (imageURLString === undefined) return []
  const imageURLS = imageURLString.split(",")
  return imageURLS.map((url,index) => {
    return {src: decodeURIComponent(url), id: index}
  })
}

const ErrorState = (props:{imgCount: number}) => {
  let canContinue = false;
  let errorMessage = '';

  if(props.imgCount < 2){
    canContinue= false;
    errorMessage = "Must have more than two images. Return to step one to add more images."
  } else if(props.imgCount > 10){
    canContinue= false;
    errorMessage = "Max images is 10. Remove images to continue."
  } else {
    canContinue= true;
    errorMessage = "";
  }

  return (
    <>
    <div
    style={{
      display: canContinue ? "none" : "inline-block",
      color: "red",

    }}
    >
      <span style={{fontWeight: "bold"}}>Error: </span>{errorMessage}
    </div>
    </>

  )
}

const SliderCounter = (props:{images:{src:string}[], count: number, mode: boolean}) => {
  const [sliderValue, setSliderValue] = useState(0);
  const sliderMax = 1000;
  const maxRatio = 4/5;
  
  const [progress, setProgress] = useState(0);

  const images = props.images;
  const ImgCount = images.length;
  
  const snapStep = sliderMax/ImgCount;
  const currentImage = Math.floor(sliderValue/snapStep);

  const imgRef = useRef<HTMLImageElement>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [firstImgSize,setFirstImgSize] = useState<number[]>([0,0]);
  const [imgContainerSize, setImgContainerSize] = useState<number[]>([0,0]);
  const [imgScaleFactor, setImgScaleFactor] = useState<number>();
  const [maxheight, setMaxHeight] = useState<number>();
  
  const currentSnapPoint = (_index: number, _imgMax: number, _sliderMax: number) => {
    switch(_index){
      case 0:
        return 0
      case _imgMax - 1:
        return _sliderMax-1;
      default:
        return Math.floor((_index + 1) * (snapStep) - (snapStep/2));
    }
  }

  const sliderChange = (event: any) => {
    setSliderValue(parseInt(event.target.value));
  }

  const snapValue = (event: any) => {
    setSliderValue(currentSnapPoint(currentImage,ImgCount, sliderMax))
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
      return (_imgSize[0]/(_ratio)) < _imgSize[1];
    } else {
      return false;
    }
  }
  
  const findMaxheight = (_ratio: number, _containerWidth: number) => {
    return Math.floor(_containerWidth/_ratio) - 100;
  }
  
  const findScaleFactor = (_imgSize: number[], _maxHeight: number) => {
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
    
    window.addEventListener("resize", updateContainerSize);

    return() => {
      window.removeEventListener('resize', updateContainerSize);
    }

  },[firstImgSize])

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

      <div style={{ width:`100%`, height:`${isBiggerThanRatio(firstImgSize,maxRatio) ? maxheight + "px" : "auto"}`,overflow:"hidden",}}>
      <div ref={imgContainerRef} style={{ width: "100%", height: "auto", position: "relative", overflow:"hidden",transformOrigin: "top center", borderRadius: "10px", scale: `${isBiggerThanRatio(firstImgSize,maxRatio) ? imgScaleFactor : 1}`}}>
        {images.map((image) => (
          <img
          key={images.indexOf(image)}
          ref = {pickRef(images.indexOf(image), ImgCount)}
          src={image.src}
          title="image"
          draggable="false"
          style={{
            width: `100%`,
            position: modePosition(images.indexOf(image), ImgCount),//images.indexOf(image) === 0 ? "relative": "absolute",
            opacity: modeOpacity(images.indexOf(image), currentImage, ImgCount),
            zIndex: 0,
            top: 0,
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

      </div>
          
    </div>
  )

}


  export const LayeredImageFeedComponent = ({model}:FeedComponentProps) => {
    let images = convertToObjects(model.data['images'])
    let isSubtract = (model.data["mode"] === "true");
    let count = images.length;

    return (
      <div style={{width: "100%"}}>
        <SliderCounter 
        images={images} 
        count={count} 
        mode={isSubtract}
        />
      </div>
    )
  }

  export const LayeredImageComposerComponent = ({ model, done }: ComposerComponentProps) =>
   {
    
    const onFinish = (images: { src: string; }[], isSubtract: boolean) => {
      
      images = isSubtract === true ? images.reverse() :  images;
      model.data["images"] = convertToImagesString(images)
      model.data["mode"] = (isSubtract).toString();
      done(model);

    }

      const Menu = () => {

        //const [form] = Form.useForm();
        

        const [isImagesUploaded, setIsImagesUploaded] = useState(false);

        const [dragItemIndex, setDragItemIndex] = useState<number | undefined>(undefined);
        const [dragOverItemIndex, setDragOverItemIndex] = useState<number | undefined>(undefined);
        const [isSubtract, setIsSubtract] = useState(false);

        const [imgs,setImgs] = useState(convertToObjects(model.data['images']));
        console.log(imgs);

        const handleDragStart = (index: number) => {
          
          setDragItemIndex(index);
          
        };

        const handleDragOver = (event: React.DragEvent) => {
          event.preventDefault();
          event.dataTransfer.effectAllowed="move";
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

        const deleteItem = (index: number) => {
          const newArray = [...imgs.slice(0,index), ...imgs.slice(index + 1)];
          setImgs(newArray);
        }

        useEffect(() => {
          // Ensure model.data['images'] exists and is not empty before converting
          if (model.data['images']) {
            const convertedImages = convertToObjects(model.data['images']);
            setImgs(convertedImages);
          }
        }, [model.data['images']]); // Depend on model.data['images']

        useEffect(() => {
          //form.setFieldsValue({images: imgs});
          
        }, [imgs]);

        useEffect(() => {
          

        },[isSubtract])

        const extractFilename = (url: string) => {
          return url.split('/').pop();
        };

        const uploaderComponent = <FileUploadComponent
          fileTypes='image/*'
          label="Upload Images"
          onUpdate={(urls)=>{
            
            model.data['images'] = urls.join(",").replace(/v0\/b\/|o\//g,"");
            setIsImagesUploaded(true);

          }}
          multiple={true}
          maxFiles={10}
          />;
        
        const uploadMenu = (
          <div>

            <p style={{margin: "5px 5px 20px 5px"}}>
              Slide to explore images in layers, where transparent layers can transform the image beneath.
            </p>
            <p style={{margin: "5px 5px 20px 5px"}}>
              Viewers can explore the gallery at their own pace with a slider at the bottom of the post. By layering transparent images, underlying layers are able to shine through making it perfect for animations, work in progress, drawovers, slide decks, and more…
            </p>

            <h3 style={{fontSize: "1rem", color:"#cfcfcf"}}>Step 1</h3>
            <h2 style={{margin: "0px 0px 16px 0px"}}>Add Images</h2>
            
            <p style={{fontSize: "0.8rem", margin: "16px 0px 32px 0px", padding: "0px 16px"}}>
              <span style={{fontWeight: "bold"}}>&#128161; Tip:</span> Use images that are the same size or aspect ratio for best results.
            </p>

            {uploaderComponent}

          </div>
        )

        const layerOrderingMenu = 
        <>  
        
          <h3 style={{fontSize: "1rem", color:"#cfcfcf"}}>Step 2</h3>
          <h2 style={{margin: "0px 0px 16px 0px"}}>Order Images</h2>

          <div
          style={{
            margin: "16px 0px",
          }}
          >
            <p style={{fontSize: "1rem", margin: "8px 0px 8px 0px"}}>
              Choose Layering Mode:
            </p>

            <p style={{fontSize: "0.8rem", margin: "16px 0px 32px 0px", padding: "0px 16px"}}>
              <span style={{fontWeight: "bold"}}>&#128161; Tip:</span> Changing layering mode is only relevant if you are using transparent images.
            </p>

            <button 
            onClick={() => {setIsSubtract(false);}}
            style={{
              flex:1,
              width: "100%",
              height:"auto", 
              padding:"12px 16px 12px 16px", 
              margin: "4px 0px",
              textAlign:"left", 
              overflowWrap:"break-word", 
              whiteSpace:"normal", 
              borderRadius:"8px",
              backgroundColor: isSubtract ? "#ffffff" : "#2050DF",
              color: isSubtract ? "#000000" : "#ffffff",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "#2050DF"
            }}
            >
                <div style={{display: "flex", flexDirection: "column",}}>
                
                <div style={{display:"flex", flexDirection: "row", alignItems: "baseline"}}>
                  <h3 style={{fontSize: "1rem", marginTop:"-4px"}}>Add</h3>
                </div>
              
                <p style={{height: "auto", fontSize: "0.75rem",boxSizing: "border-box", flexWrap:"wrap", lineHeight: "1.2"}}>
                  Images are added on top of previous images. <br/> (e.g. the 1st image will be covered by the 2nd image) 
                </p>
              </div>
              </button>

            <button 
              onClick={() => {setIsSubtract(true);}}
              style={{
                flex:1,
                width: "100%",
                height:"auto", 
                padding:"12px 16px 12px 16px", 
                margin: "4px 0px",
                textAlign:"left", 
                overflowWrap:"break-word", 
                whiteSpace:"normal", 
                borderRadius:"8px",
                backgroundColor: isSubtract ? "#2050DF" : "#ffffff",
                color: isSubtract ? "#ffffff" : "#000000",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "#2050DF"
              }}
              >
                  <div style={{display: "flex", flexDirection: "column",}}>
                  
                  <div style={{display:"flex", flexDirection: "row", alignItems: "baseline"}}>
                    <h3 style={{fontSize: "1rem", marginTop:"-4px"}}>Subtract</h3>
                  </div>
                
                  <p style={{height: "auto", fontSize: "0.75rem",boxSizing: "border-box", flexWrap:"wrap", lineHeight: "1.2"}}>
                    Images are subtracted revealing the next image underneath. <br/>(e.g. the 1st image will be removed to reveal 2nd image) 
                  </p>
                </div>
              </button>
          </div>
         
          <div
          style={{
            margin:"32px 0px 64px 0px",

          }}
          > 
            <p style={{fontSize: "1rem", margin: "16px 0px 8px 0px"}}>
              Drag and drop to reorder
            </p>

            <p style={{fontSize: "0.8rem", margin: "16px 0px 32px 0px", padding: "0px 16px"}}>
              <span style={{fontWeight: "bold"}}>&#128161; Tip:</span> First image determines post dimensions. If an image does not have the same aspect ratio as the first, it will be cropped.
            </p>
            
            <div> 
              {imgs.map((image, index) => (
                <div
                  key={index} 
                  style={dragOverItemIndex === index ? { width:"100%", outline:"2px solid #2050DF", backgroundColor:"#e4e6eb", padding:"8px 16px", borderRadius:"8px", margin:"7px 0px 16px 0px", opacity:"0.999"} : {width:"100%", backgroundColor:"#e4e6eb", padding:"8px 16px", borderRadius:"8px", margin:"7px 0px 16px 0px", opacity:"0.999"}} 
                  draggable="true" 
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}

                  >

                    <div 
                      style={{
                        width: "100%", 
                        display:"flex", 
                        alignItems:"center",
                        justifyContent:"space-between",
                        gap: "16px",
                      }}
                      >
                        
                        <svg 
                        style={{
                          width: "12px",
                          height: "auto",

                        }}
                        viewBox="0 0 325 525" 
                        xmlns="http://www.w3.org/2000/svg" 
                        >
                          
                          <path 
                          style={{
                            fill: "#969a9e",
                            strokeWidth: "0px",
                            opacity: "100%",
                          }}
                          d="m100,50c0,27.61-22.39,50-50,50S0,77.61,0,50,22.39,0,50,0c27.61,0,50,22.39,50,50Zm175,50c27.61,0,50-22.39,50-50S302.61,0,275,0s-50,22.39-50,50c0,27.61,22.39,50,50,50ZM50,212.5c-27.61,0-50,22.39-50,50s22.39,50,50,50,50-22.39,50-50h0c0-27.61-22.39-50-50-50h0Zm225,0c-27.61,0-50,22.39-50,50s22.39,50,50,50,50-22.39,50-50h0c0-27.61-22.39-50-50-50h0ZM50,425c-27.61,0-50,22.39-50,50s22.39,50,50,50,50-22.39,50-50c0-27.61-22.39-50-50-50h0Zm225,0c-27.61,0-50,22.39-50,50s22.39,50,50,50,50-22.39,50-50c0-27.61-22.39-50-50-50h0Z"
                          />
                          
                        </svg>
                        
                        
                        <span
                        style={{padding:"0px 0px 0px 16px"}}
                        >
                          {index + 1}
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
                            src={image.src}
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
                        
                        <div 
                        style={{
                          flexGrow: "1",


                        }}
                        >
                        <p 
                        style={{
                          width: "100%",
                          wordBreak: "break-word",
                          wordWrap: "break-word"
                        }}
                        >
                        image_{image.id}
                        </p>

                        </div>

                        <button 
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          color: "#d64747",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderColor: "#d64747",
                          fontSize: "0.7rem",

                        }}
                        onClick={()=> deleteItem(image.id)}
                        >
                        Remove  
                        </button>
                      </div> 

                  </div>

              ))}
              
            </div> 

            <ErrorState imgCount={imgs.length}/>
             
          </div>
          
          



          <div 
          style={{
          display: imgs.length < 2 || imgs.length > 10 ? "none" : "inline-block",
          width: "100%",
          }}
          >  
          <SeamSaveButton onClick={() => onFinish(imgs, isSubtract)}/>
          </div>  
          
          {/* <Form form={form} initialValues={{images: imgs, isSubtract: false}}
          style={{width: "100%", display:"block"}}
          onValuesChange={handleValueChange}
          onFinish={onFinish}
          autoComplete="off"
          >
          
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
          
          </Form> */}
      </> 
        return(
          <>
            
            <div className='hideScroll' style={{padding:"3px 12px", maxHeight: "90vh",overflow: "hidden", overflowY: "scroll"}}>
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

  
