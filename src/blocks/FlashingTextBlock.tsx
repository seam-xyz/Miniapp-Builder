import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import { FormControlLabel, Checkbox, TextField, Box, Button } from '@mui/material';
import { useState, useEffect } from "react";

interface FlashingTextProps {
  content: string;
  contentColor: string;
  backgroundColor: string;
  isAscii: string;
}

function FlashingText({ content, contentColor, backgroundColor, isAscii } : FlashingTextProps) {
  const [colors, setColors] = useState({textColor: contentColor, bgColor: backgroundColor});
  const { textColor, bgColor }  = colors;

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

    const timeoutId = setTimeout(swapColors, 1000);
    return () => clearTimeout(timeoutId);
  }, [bgColor, textColor]);
  

  let backgroundStyles = {
    backgroundColor: bgColor,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  } as React.CSSProperties;

  let textStyles = {
    color: textColor,
    backgroundColor: bgColor,
    margin: "auto"
  } as React.CSSProperties;
  
  return (
    isAscii === "true" ? (
        <div style={backgroundStyles}>
          <pre style={textStyles}>
            {content}
          </pre>
        </div>
      ) : (
          <div style={backgroundStyles}>
          <h1 style={{...textStyles, fontSize: 64, textAlign: "center"}}>
            {content}
          </h1>
        </div>
      )
  );
}

export default class FlashingTextBlock extends Block {

  render() {
    
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!);
    }

    let text = this.model.data['text'];
    let isAscii = this.model.data['isAscii'];

    if (text === undefined) {
      return this.renderErrorState();
    }

    return (
        <FlashingText
           content={text}
           contentColor={this.theme.palette.info.main}
           backgroundColor={this.theme.palette.secondary.main}
           isAscii={isAscii}/>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {

    const onFinish = (event: any) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      let text = data.get('text') as string;

      // if the checkbox was checked, ascii="yes" so data.get('ascii') returns yes
      // if the checkbox wasn't checked, ascii won't be a key and so data.get('ascii') will return null
      let isAscii = data.get('ascii');

      // if ascii has a truthy value ("yes"), isAscii will be set to "true"
      // if ascii has a falsy value (null), isAscii will be set to "false"
      this.model.data['isAscii'] = isAscii ? "true" : "false";
      this.model.data['text'] = text;
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
          autoFocus
        />
        <FormControlLabel control={<Checkbox name="ascii" value="yes"/>} label="Fixed-width font (for ASCII art)" />
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
