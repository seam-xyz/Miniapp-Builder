import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import { FormControlLabel, Checkbox, TextField, Box, Button, Slider, InputLabel } from '@mui/material';
import { useState, useEffect } from "react";
import SeamSaveButton from '../components/SeamSaveButton';

interface FlashingTextProps {
  content: string;
  contentColor: string;
  backgroundColor: string;
  isAscii: string;
  lineHeight: string;
  transitionDuration: string;
}

function FlashingText({ content, contentColor, backgroundColor, isAscii, lineHeight, transitionDuration } : FlashingTextProps) {
  const [colors, setColors] = useState({textColor: contentColor, bgColor: backgroundColor});
  const { textColor, bgColor }  = colors;

  // we store lineHeight as a string in model.data['lineHeight'], so we convert it to a float
  let lineHeightFloat = parseFloat(lineHeight);
  let durationMs = transitionDuration === undefined ? 1000 : parseFloat(transitionDuration) * 1000;
  /*
  This conditional is important when changing themes. If we only had setColors() without the surrounding
  conditional, then the component crashes because React thinks it's too many rerenders. The conditional
  makes sure that when there is a new color combination, the state changes to reflect that
  */
  if ((contentColor !== textColor && contentColor !== bgColor) || 
      (backgroundColor !== textColor && backgroundColor !== bgColor)) {
    setColors({textColor: contentColor, bgColor: backgroundColor});
  }

  // swap colors after the component renders. changing the state triggers another render,
  // so there's an infinite loop of color swaps (we trick react)
  useEffect(() => {
    function swapColors() {
      setColors({textColor: bgColor, bgColor: textColor});
    }

    const timeoutId = setTimeout(swapColors, durationMs ?? 1000);
    return () => clearTimeout(timeoutId);
  }, [bgColor, textColor, durationMs]);
  

  // styles for the box background
  let backgroundStyles = {
    backgroundColor: bgColor,
  } as React.CSSProperties;

  // styles for the text. specific styles for regular text and ascii art are
  // defined separately as inline styles
  let textStyles = {
    color: textColor,
    backgroundColor: bgColor,
    lineHeight: lineHeight,
    overflow: "hidden",
    textOverflow: "ellipsis",
  } as React.CSSProperties;

  let asciiStlyes ={ 

  }
  
  return (
    isAscii === "true" ? (
        <div className="flex flex-col justify-center w-full h-full p-4" style={backgroundStyles}>
          <pre className="" style={{...textStyles, lineHeight: lineHeightFloat}}>
            {content}
          </pre>
        </div>
      ) : (
        <div className="flex flex-col justify-center w-full h-full p-4" style={backgroundStyles}>
          <h3 className="flex w-auto overflow-hidden text-center" style={{...textStyles, display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical"}}>
            {content}
          </h3>
        </div>
      )
  );
}

interface AsciiArtControlsProps {
  checked: boolean;
  lineHeight: string;
}

function AsciiArtControls({ checked, lineHeight } : AsciiArtControlsProps) {

  // even though we pass in checked as a prop, we still have a state for isChecked
  // so that we can sync up the slider and the checkbox
  const [isChecked, setChecked] = useState(checked);

  function handleCheckboxChange(event: React.SyntheticEvent, checked: boolean) : void {
    setChecked(checked);
  }

  // lineHeight is a string in model.data['lineHeight], so we have to convert it to a float to use it
  let lineHeightFloat = parseFloat(lineHeight);

  // if checkbox is checked, render the checked checkbox and the slider
  // if the checkbox is unchecked, render only the unchecked checkbox
  return (
    isChecked ? (
        <>
          <FormControlLabel control={<Checkbox name="ascii" value="yes"/>} 
          label="Fixed-width font (for ASCII art)" onChange={handleCheckboxChange} checked />
          <InputLabel>Line Height:</InputLabel>
          <Slider   
            name="lineHeight"
            aria-label="Line Height"
            defaultValue={lineHeightFloat}
            valueLabelDisplay="auto"
            step={0.1}
            marks
            min={0.5}
            max={1.5}>
          </Slider>
        </>
      ) : (
        <FormControlLabel control={<Checkbox name="ascii" value="yes"/>} 
        label="Fixed-width font (for ASCII art)" onChange={handleCheckboxChange}/>
      )
  )
}

export const FlashingTextFeedComponent = ({ model }: FeedComponentProps) => {
  let text = model.data['text'];
  let isAscii = model.data['isAscii'];
  let lineHeight = model.data['lineHeight'];
  let transitionDuration = model.data['transitionDuration'];

  if (text === undefined) {
    return <h1>Text not found</h1>;
  }

  return (
    <FlashingText
      content={text}
      contentColor={"black"}
      backgroundColor={"white"}
      isAscii={isAscii}
      lineHeight={lineHeight}
      transitionDuration={transitionDuration}
    />
  );
}

export const FlashingTextComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const onFinish = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let text = data.get('text') as string;
    let transitionDuration = data.get('transitionDuration') as string;
    let isAscii = data.get('ascii');
  
    if (isAscii) {
      model.data['isAscii'] = "true";
      model.data['lineHeight'] = data.get('lineHeight') as string;
    } else {
      model.data['isAscii'] = "false";
    }
  
    model.data['text'] = text;
    model.data['transitionDuration'] = transitionDuration;
    done(model);
  };  

  return (
    <Box
      component="form"
      onSubmit={onFinish}
    >
      <TextField
        margin="normal"
        required
        defaultValue={model.data['text']}
        fullWidth
        multiline
        id="text"
        label="Text"
        name="text"
      />
      <InputLabel>Transition Duration (seconds): </InputLabel>
      <Slider
        name="transitionDuration"
        aria-label="Transition Duration"
        defaultValue={parseFloat(model.data['transitionDuration']) || 1.0}
        valueLabelDisplay="auto"
        step={0.1}
        min={0.3}
        max={3}
      />
      {model.data['isAscii'] === "true" 
        ? <AsciiArtControls checked={true} lineHeight={model.data['lineHeight'] || "1.0"} />
        : <AsciiArtControls checked={false} lineHeight={model.data['lineHeight'] || "1.0"} />}
      <Button
        type="submit"
        variant="contained"
        className="save-modal-button"
        sx={{ mt: 3, mb: 2 }}
      >
        Preview
      </Button>
    </Box>
  );
}
