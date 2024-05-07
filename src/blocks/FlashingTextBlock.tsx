import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import { FormControlLabel, Checkbox, TextField, Box, Button, Slider, InputLabel } from '@mui/material';
import { useState, useEffect } from "react";

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
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  } as React.CSSProperties;

  // styles for the text. specific styles for regular text and ascii art are
  // defined separately as inline styles
  let textStyles = {
    color: textColor,
    backgroundColor: bgColor,
    margin: "auto",
    lineHeight: lineHeight
  } as React.CSSProperties;
  
  return (
    isAscii === "true" ? (
        <div style={backgroundStyles}>
          <pre style={{...textStyles, lineHeight: lineHeightFloat}}>
            {content}
          </pre>
        </div>
      ) : (
          <div style={backgroundStyles}>
          <h1 style={{...textStyles, fontSize: 64, textAlign: "center", lineHeight: 1.4}}>
            {content}
          </h1>
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

export default class FlashingTextBlock extends Block {

  render() {
    
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!);
    }

    let text = this.model.data['text'];
    let isAscii = this.model.data['isAscii'];
    let lineHeight = this.model.data['lineHeight'];
    let transitionDuration = this.model.data['transitionDuration'];

    if (text === undefined) {
      return this.renderErrorState();
    }

    return (
        <FlashingText
           content={text}
           contentColor={this.theme.palette.info.main}
           backgroundColor={this.theme.palette.secondary.main}
           isAscii={isAscii}
           lineHeight={lineHeight}
           transitionDuration={transitionDuration}/>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {

    const onFinish = (event: any) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      let text = data.get('text') as string;
      let transitionDuration = data.get('transitionDuration') as string;
      // if the checkbox was checked, ascii="yes" so data.get('ascii') returns yes
      // if the checkbox wasn't checked, ascii won't be a key and so data.get('ascii') will return null
      let isAscii = data.get('ascii');

      // if isAscii is truthy, then we update the isAscii value and lineHeight value
      // if isAscii is falsy, then we update the isAscii value. we can leave the lineHeight value
      // alone since it doesn't affect the text when it isn't ascii art. this also
      // has the benefit of saving the last used value for ascii art
      if (isAscii) {
        this.model.data['isAscii'] = "true";
        this.model.data['lineHeight'] = data.get('lineHeight') as string;
      }
      else {
        this.model.data['isAscii'] = "false";
      }

      this.model.data['text'] = text;
      this.model.data['transitionDuration'] = transitionDuration;
      done(this.model);
    };

    return (
      <Box
        component="form"
        onSubmit={onFinish}
        style={{}}
      >
        <TextField
          margin="normal"
          required
          defaultValue={this.model.data['text']}
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
          defaultValue={parseFloat(this.model.data['transitionDuration']) || 1.0}
          valueLabelDisplay="auto"
          step={0.1}
          min={0.3}
          max={3}>
          </Slider>
        {this.model.data['isAscii'] === "true" 
          ? <AsciiArtControls checked={true} lineHeight={this.model.data['lineHeight'] || "1.0"}></AsciiArtControls>
          : <AsciiArtControls checked={false} lineHeight={this.model.data['lineHeight'] || "1.0"}></AsciiArtControls>}
        <Button
          type="submit"
          variant="contained"
          className="save-modal-button"
          sx={{ mt: 3, mb: 2 }}
        >
          Save
        </Button>
      </Box>
    );
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    );
  }
}
