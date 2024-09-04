
import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types'
import './BlockStyles.css';
import './assets/LayeredImageBlock/LayeredImageStyles.css';
import React, { useState, useEffect, useRef, Children } from 'react';
import FileUploadComponent from './utils/FileUploadComponent';
import SeamSaveButton from '../components/SeamSaveButton';
import 'dndtouch2';

const TipCard = (props: { children: any }) => {
  return (
    <>
      <p style={{ fontSize: "0.8rem", margin: "16px 0px 32px 0px", padding: "0px 16px" }}>
        <span style={{ fontWeight: "bold" }}>&#128161; Tip:</span> {props.children}
      </p>
    </>
  )
}

const SliderCounter = (props: { images: string[], count: number, mode: boolean }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const sliderMax = 1000;
  const maxRatio = 4 / 5;

  const [progress, setProgress] = useState(0);

  const images = props.images;
  const ImgCount = images.length;

  const snapStep = sliderMax / ImgCount;
  const currentImage = Math.floor(sliderValue / snapStep);

  const imgRef = useRef<HTMLImageElement>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [firstImgSize, setFirstImgSize] = useState<number[]>([0, 0]);
  const [imgContainerSize, setImgContainerSize] = useState<number[]>([0, 0]);
  const [imgScaleFactor, setImgScaleFactor] = useState<number>();
  const [maxheight, setMaxHeight] = useState<number>();

  const currentSnapPoint = (_index: number, _imgMax: number, _sliderMax: number) => {
    switch (_index) {
      case 0:
        return 0
      case _imgMax - 1:
        return _sliderMax - 1;
      default:
        return Math.floor((_index + 1) * (snapStep) - (snapStep / 2));
    }
  }

  const sliderChange = (event: any) => {
    setSliderValue(parseInt(event.target.value));
  }

  const snapValue = (event: any) => {
    setSliderValue(currentSnapPoint(currentImage, ImgCount, sliderMax))
  }

  const modeOpacity = (_image: any, currentImage: number, totalImg: number) => {
    if (props.mode) {
      return _image <= (totalImg - 1) - currentImage ? 1 : 0;
    } else {
      return _image <= currentImage ? 1 : 0;
    }
  }

  const modePosition = (_image: any, totalImg: number) => {
    if (props.mode) {
      return _image === (totalImg - 1) ? "relative" : "absolute";
    } else {
      return _image === 0 ? "relative" : "absolute";
    }
  }

  const pickRef = (_image: any, totalImg: number) => {
    if (props.mode) {
      return _image === (totalImg - 1) ? imgRef : null
    } else {
      return _image === 0 ? imgRef : null
    }
  }

  const isBiggerThanRatio = (_imgSize: number[], _ratio: number) => {
    if (_imgSize[0] < _imgSize[1]) {
      return (_imgSize[0] / (_ratio)) < _imgSize[1];
    } else {
      return false;
    }
  }

  const findMaxheight = (_ratio: number, _containerWidth: number) => {
    return Math.floor(_containerWidth / _ratio) - 100;
  }

  const findScaleFactor = (_imgSize: number[], _maxHeight: number) => {
    return _maxHeight / _imgSize[1]
  }

  const updateImageSize = () => {
    if (imgRef.current) {
      setFirstImgSize([imgRef.current.width, imgRef.current.height]);
    }
  }

  const updateContainerSize = () => {
    if (imgContainerRef.current) {
      setImgContainerSize([imgContainerRef.current.offsetWidth, imgContainerRef.current.offsetHeight])
    }
  }

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.onload = () => {
        updateImageSize();
      }
    }

    window.addEventListener("resize", updateImageSize);

    return () => {
      window.removeEventListener('resize', updateImageSize);
    }
  }, [])

  useEffect(() => {
    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);

    return () => {
      window.removeEventListener('resize', updateContainerSize);
    }

  }, [firstImgSize])

  useEffect(() => {
    const sliderProgress = (sliderValue / sliderMax) * 100;
    setProgress(sliderProgress);
  }, [sliderValue])

  useEffect(() => {
    setImgScaleFactor(findScaleFactor(firstImgSize, findMaxheight(maxRatio, imgContainerSize[0])));
    setMaxHeight(findMaxheight(maxRatio, imgContainerSize[0]));
  }, [imgContainerSize])

  return (
    <div style={{ width: `100%` }}>

      <div style={{ width: `100%`, height: `${isBiggerThanRatio(firstImgSize, maxRatio) ? maxheight + "px" : "auto"}`, overflow: "hidden", }}>
        <div ref={imgContainerRef} style={{ width: "100%", height: "auto", position: "relative", overflow: "hidden", transformOrigin: "top center", borderRadius: "10px", scale: `${isBiggerThanRatio(firstImgSize, maxRatio) ? imgScaleFactor : 1}` }}>
          {images.map((image) => (
            <img
              key={images.indexOf(image)}
              ref={pickRef(images.indexOf(image), ImgCount)}
              src={image}
              title="image"
              draggable="false"
              style={{
                width: `100%`,
                borderRadius: "10px",
                position: modePosition(images.indexOf(image), ImgCount),
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
            className={'LayeredImageBlock-slider touch-none select-none'}
            style={{ background: `linear-gradient(to right, #2050DF ${progress}%, #ccc ${progress}% )` }}
            type='range'
            min={0}
            max={sliderMax - 1}
            value={sliderValue}
            onChange={sliderChange}
            onMouseUp={snapValue}

          />
          <p style={{ whiteSpace: 'nowrap', width: "7%", textAlign: "end" }}>{currentImage + 1} / {ImgCount}</p>
        </div>
      </div>
    </div>
  )

}

export const LayeredImageFeedComponent = ({ model }: FeedComponentProps) => {
  let images = JSON.parse(model.data['images'] ?? [])
  let isSubtract = (model.data["mode"] === "true");
  let count = images.length;

  return (
    <div style={{ width: "100%" }}>
      <SliderCounter
        images={images}
        count={count}
        mode={isSubtract}
      />
    </div>
  )
}

export const LayeredImageComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const onFinish = (images: string[], isSubtract: boolean) => {
    images = isSubtract === true ? images.reverse() : images;
    model.data["images"] = JSON.stringify(images)
    model.data["mode"] = (isSubtract).toString();
    done(model);
  }

  const Menu = () => {
    const [isImagesUploaded, setIsImagesUploaded] = useState(model.data["images"] != undefined);
    const [dragItemIndex, setDragItemIndex] = useState<number | undefined>(undefined);
    const [dragOverItemIndex, setDragOverItemIndex] = useState<number | undefined>(undefined);
    const [isSubtract, setIsSubtract] = useState(false);
    const [imgs, setImgs] = useState(model.data["images"] ? JSON.parse(model.data["images"]) : []);
    const handleDragStart = (index: number) => {
      setDragItemIndex(index);
    }

    const handleDragOver = (event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.effectAllowed = "move";
    }

    const handleDrop = () => {
      if (dragItemIndex !== dragOverItemIndex && dragItemIndex !== undefined && dragOverItemIndex !== undefined) {
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

    const deleteItem = (index: number) => {
      const newArray = [...imgs.slice(0, index), ...imgs.slice(index + 1)];
      setImgs(newArray);
    }

    const uploaderComponent = <FileUploadComponent
      fileTypes='image/*'
      label="Upload Images"
      onUpdate={(urls) => {
        setImgs(urls)
        setIsImagesUploaded(true);
      }}
      multiple={true}
      maxFiles={10}
    />;

    const uploadMenu = (
      <div>
        <p style={{ margin: "5px 5px 20px 5px" }}>
          Slide to explore images in layers, where transparent layers can transform the image beneath.
        </p>
        <p style={{ margin: "5px 5px 20px 5px" }}>
          Viewers can explore the gallery at their own pace with a slider at the bottom of the post. By layering transparent images, underlying layers are able to shine through making it perfect for animations, work in progress, drawovers, slide decks, and more…
        </p>
        <h3 style={{ fontSize: "1rem", color: "#cfcfcf" }}>Step 1</h3>
        <h2 style={{ margin: "0px 0px 16px 0px" }}>Add Images</h2>
        <TipCard>Use images that are the same size or aspect ratio for best results.</TipCard>
        {uploaderComponent}
      </div>
    )

    const layerOrderingMenu = (
      <>
        <h3 style={{ fontSize: "1rem", color: "#cfcfcf" }}>Step 2</h3>
        <h2 style={{ margin: "0px 0px 16px 0px" }}>Order Images</h2>
        <div
          style={{
            margin: "16px 0px",
          }}
        >
          <p style={{ fontSize: "1rem", margin: "8px 0px 8px 0px" }}>
            Choose Layering Mode:
          </p>

          <TipCard>Changing layering mode is only relevant if you are using transparent images.</TipCard>

          <button
            onClick={() => { setIsSubtract(false); }}
            className={`mode-button box-border ${isSubtract ? "": "mode-button-highlight"}`}
          >
            <div style={{ display: "flex", flexDirection: "column", }}>

              <div style={{ display: "flex", flexDirection: "row", alignItems: "baseline" }}>
                <h3 style={{ fontSize: "1rem", marginTop: "-4px" }}>Add</h3>
              </div>

              <p style={{ height: "auto", fontSize: "0.75rem", boxSizing: "border-box", flexWrap: "wrap", lineHeight: "1.2" }}>
                Images are added on top of previous images. <br /> (e.g. the 1st image will be covered by the 2nd image)
              </p>
            </div>
          </button>

          <button
            onClick={() => { setIsSubtract(true); }}
            className={`mode-button box-border ${isSubtract ? "mode-button-highlight": ""}`}
          >
            <div style={{ display: "flex", flexDirection: "column", }}>

              <div style={{ display: "flex", flexDirection: "row", alignItems: "baseline" }}>
                <h3 style={{ fontSize: "1rem", marginTop: "-4px" }}>Subtract</h3>
              </div>

              <p style={{ height: "auto", fontSize: "0.75rem", boxSizing: "border-box", flexWrap: "wrap", lineHeight: "1.2" }}>
                Images are subtracted revealing the next image underneath. <br />(e.g. the 1st image will be removed to reveal 2nd image)
              </p>
            </div>
          </button>
        </div>

        <div
          style={{
            margin: "32px 0px 64px 0px",

          }}
        >
          <p style={{ fontSize: "1rem", margin: "16px 0px 8px 0px" }}>
            Drag and drop to reorder
          </p>

          <TipCard>First image determines post dimensions. If an image does not have the same aspect ratio as the first, it will be cropped.</TipCard>

          <div>
            {imgs.map((image: string, index: number) => (
              <div
                key={index}
                className={`img-card touch-none select-none box-border ${dragOverItemIndex === index ? "outline-card" : ""}`}
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <svg
                    className='hideScreenSmall'
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
                  <span style={{ padding: "0px 0px 0px 16px" }}>
                    {index + 1}
                  </span>

                  <div
                    style={{
                      border: "1px solid #c7c7c7",
                      display: "inline-block",
                      width: "100px",
                      height: "56px",
                      overflow: "hidden",
                      borderRadius: "5px",
                      userSelect: "none",
                      flexShrink: "0"
                    }}
                  >
                    <img
                      src={image}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        userSelect: "none",
                        flexShrink: "0"
                      }}
                      draggable="false"
                    />
                  </div>

                  <div className="hideScreenSmall" style={{ flexGrow: "1" }}>
                    <p
                      style={{
                        width: "100%",
                        wordBreak: "break-word",
                        wordWrap: "break-word"
                      }}
                    >
                      image_{index}
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
                    onClick={() => deleteItem(index)}
                  >
                    Remove
                  </button>
                </div>

              </div>
            ))}
          </div>
          <ErrorState imgCount={imgs.length} />
        </div>
        <div
          style={{
            display: imgs.length < 2 || imgs.length > 10 ? "none" : "inline-block",
            width: "100%",
          }}
        >
          <SeamSaveButton onClick={() => onFinish(imgs, isSubtract)} />
        </div>
      </>
    )

    return (
      <>
        <div className='hideScroll border-box' style={{ padding: "3px 12px", maxHeight: "90vh", overflow: "hidden", overflowY: "scroll" }}>
          {isImagesUploaded ? layerOrderingMenu : uploadMenu}
        </div>
      </>
    )
  }

  return (
    <>
      <Menu />
    </>
  )
}

const ErrorState = (props: { imgCount: number }) => {
  let canContinue = false;
  let errorMessage = '';

  if (props.imgCount < 2) {
    canContinue = false;
    errorMessage = "Must have more than two images. Return to step one to add more images."
  } else if (props.imgCount > 10) {
    canContinue = false;
    errorMessage = "Max images is 10. Remove images to continue."
  } else {
    canContinue = true;
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
        <span style={{ fontWeight: "bold" }}>Error: </span>{errorMessage}
      </div>
    </>
  )
}


