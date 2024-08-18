import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Button } from '@mui/material';
import Slider from '@mui/material/Slider';
import ImageList from '@mui/material/ImageList';
import Typography from '@mui/material/Typography';
import ImageListItem from '@mui/material/ImageListItem';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import { ComposerComponentProps, FeedComponentProps } from './types';
import { Char_Body, Char_Hair, Char_Eyes, Char_Eyebrows, Char_Eyelashes, Char_Mouth, Char_Top, Char_Bottom, Char_Shoes, Char_BW } from "./assets/Wardrobe/dress"

export const WardrobeFeedComponent = ({ model }: FeedComponentProps) => {
  const Outfit = JSON.parse(model.data.Outfits);
  const BgColor = model.data.BgColor;
  return (
    <div className="relative w-full h-[32em]">
      <div className={`absolute mt-4 left-1/2 -translate-x-1/2 w-[20em] h-[30em] pointer-events-none rounded-lg shadow-lg ${BgColor}`}>
        {Object.keys(Outfit).map((part, index) => (
          <div key={index}>
            {Outfit[part] !== "" ?
              <img src={Outfit[part]} alt={part} className="absolute -top-10 w-full" />
              : <></>}
          </div>
        ))}
      </div>
    </div>
  );
}

export const WardrobeComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [selectedOutfits, setSelectedOutfits] = useState(model.data.Outfits ? JSON.parse(model.data.Outfits) : {
    Body: Char_BW[0],
    Eyes: Char_BW[1],
    Eyebrows: Char_BW[2],
    Eyelashes: Char_BW[3],
    Hair: Char_BW[4],
    Mouth: Char_BW[5],
    Top: Char_BW[6],
    Bottom: Char_BW[7],
    Shoe: Char_BW[8],
  });
  const [selectColor, setColor] = useState(model.data.BgColor ? model.data.BgColor : "bg-white");

  const handleDressUp = (part: string, outfit: string) => {
    setSelectedOutfits((prevOutfits: any) => ({
      ...prevOutfits,
      [part]: outfit,
    }));
  };

  const handleSubmit = () => {
    // console.log('----' + selectColor)
    model.data.Outfits = JSON.stringify(selectedOutfits);
    model.data.BgColor = selectColor;
    done(model);
  }

  return (
    <div>
      <div className="flex justify-between gap-2 select-none">
        <DressUpDisplay outfits={selectedOutfits} backColor={selectColor} setBackColor={setColor} />
        <MenuDisplay onDressUp={handleDressUp} />
        <Button sx={{position: "absolute", bottom: 50, right: 40}} color="secondary" variant="contained" onClick={handleSubmit}>
          <span>Preview</span>
          <ChevronRightRoundedIcon className="-translate-y-[1px]" />
        </Button>
      </div>
    </div>
  );
}



interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (<Box>{children}</Box>)}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const MenuDisplay = ({ onDressUp }: { onDressUp: (part: string, outfit: string) => void }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const actions = {
    Body: Char_Body,
    Eyes: Char_Eyes,
    Eyebrows: Char_Eyebrows,
    Eyelashes: Char_Eyelashes,
    Hair: Char_Hair,
    Mouth: Char_Mouth,
    Top: Char_Top,
    Bottom: Char_Bottom,
    Shoe: Char_Shoes,
  };

  return (
    <Box sx={{ display: 'flex', height: '100%', width: 300 }} className='border shadow-md bg-slate-100 rounded-lg'>
      {Object.keys(actions).map((part, index) => (
        <TabPanel key={index} value={value} index={index}>
          <ImageList sx={{ width: 130, height: 440 }} cols={1}>
            {actions[part as keyof typeof actions].map((item: string) => (
              <ImageListItem key={item} onClick={() => onDressUp(part, item)}>
                {item !== "" ?
                  <img srcSet={item} src={item} alt='outfit' className='hover:bg-slate-200 cursor-pointer' loading="lazy" />
                  : <DoNotDisturbAltIcon className='w-full h-full text-red-600 hover:bg-slate-200 cursor-pointer p-3' />}
              </ImageListItem>
            ))}
          </ImageList>
        </TabPanel>
      ))}
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        textColor="inherit"
        indicatorColor="secondary"
        aria-label="Parts container"
        sx={{ borderLeft: 1, borderColor: 'divider', width: 100 }}
        className='border-[#9c27b0] text-[#9c27b0]'
      >
        {Object.keys(actions).map((part, index) => (
          <Tab key={index} label={part} {...a11yProps(index)} />
        ))}
      </Tabs>
    </Box>
  );
};

const DressUpDisplay = ({ outfits, backColor, setBackColor }: { outfits: { [key: string]: string }; backColor: string; setBackColor: (color: string) => void }) => {
  const backgroundColors = [
    'bg-white',
    'bg-slate',
    'bg-gray',
    'bg-zinc',
    'bg-neutral',
    'bg-stone',
    'bg-red',
    'bg-orange',
    'bg-amber',
    'bg-yellow',
    'bg-lime',
    'bg-green',
    'bg-emerald',
    'bg-teal',
    'bg-cyan',
    'bg-sky',
    'bg-blue',
    'bg-indigo',
    'bg-violet',
    'bg-purple',
    'bg-fuchsia',
    'bg-pink',
    'bg-rose',
  ];
  const [backgroundColor, setBackgroundColor] = useState(backColor === "bg-white" ? backColor : backColor.slice(0, -4));
  const [colorLevel, setColorLevel] = useState(backColor === "bg-white" ? "-500" : backColor.slice(-4, backColor.length));
  const handleIntensityChange = (event: Event, newValue: number | number[]) => {
    setColorLevel("-" + (newValue as number).toString());
    setBackColor(backgroundColor + "-" + (newValue as number).toString());
    // console.log(backgroundColor, colorLevel, backColor, "---Intensity");
  }
  const handleColorChange = (newValue: string) => {
    setBackgroundColor(newValue as string);
    setBackColor((newValue as string) + colorLevel);
    // console.log(backgroundColor, colorLevel, backColor, "---Color");
  }
  return (
    <div className={`border shadow-md rounded-lg ${backgroundColor === "bg-white" ? backgroundColor : backgroundColor + colorLevel}`}>
      <div className="relative w-[20em] pointer-events-none">
        {Object.keys(outfits).map((part, index) => (
          <div key={index}>
            {outfits[part] !== "" ?
              <img src={outfits[part]} alt={part} className="absolute -top-12 w-full" />
              : <></>}
          </div>
        ))}
      </div>
      <div className="absolute w-full bottom-6 left-1/2 -translate-x-1/2">
        <Box className="relative flex flex-col items-center w-[95%] left-1/2 -translate-x-1/2 bg-slate-300 p-4 border shadow-md rounded-lg">
          <Slider
            aria-label="Color Intensity"
            defaultValue={500}
            onChange={handleIntensityChange}
            step={100}
            marks
            min={100}
            max={900}
            color="secondary"
            valueLabelDisplay="off"
          />
          <Typography className="text-[#9c27b0] -translate-y-1">Change Intensity</Typography>
          <Box className="grid grid-cols-11 border p-2 bg-slate-200 rounded-md">
            {backgroundColors.map((color, index) => (
              <button
                key={index}
                className={`w-10 h-10 m-1 ${color === "bg-white" ? color : color + colorLevel} hover:opacity-75 rounded-full shadow-md`}
                onClick={() => handleColorChange(color)}
              >
              </button>
            ))}
          </Box>
        </Box>
      </div>
    </div>
  );
};