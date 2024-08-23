import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Avatar, Button } from '@mui/material';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import { ComposerComponentProps, FeedComponentProps } from './types';
import { Char_Body, Char_Hair, Char_Eyes, Char_Eyebrows, Char_Eyelashes, Char_Mouth, Char_Top, Char_Bottom, Char_Shoes, Char_BW } from "./assets/Wardrobe/dress"

export const WardrobeFeedComponent = ({ model }: FeedComponentProps) => {
  const Outfit = JSON.parse(model.data.Outfits);
  const BgColor = model.data.BgColor;
  const brightness = model.data.brightness
  return (
    <div className="relative w-full h-[32em]">
      <div
        className={`absolute mt-4 left-1/2 -translate-x-1/2 w-[20em] h-[30em] pointer-events-none rounded-lg shadow-lg`}
        style={{ backgroundColor: BgColor, filter: `brightness(${brightness})` }}
      >
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

  const [backgroundColor, setBackgroundColor] = useState(model.data.BgColor ?? "rgb(255, 255, 255)");
  const [colorLevel, setColorLevel] = useState("-500");

  const backgroundColors = [
    'rgb(255, 255, 255)', // white (No intensity for white)
    'rgb(245, 245, 245)', // slate (offwhite)
    'rgb(200, 200, 200)', // gray (light gray)
    'rgb(150, 150, 150)', // zinc (medium gray)
    'rgb(100, 100, 100)', // neutral (dark gray)
    'rgb(50, 50, 50)',    // stone (near black)
    'rgb(239, 68, 68)',   // red (Red-500)
    'rgb(249, 115, 22)',  // orange (Orange-500)
    'rgb(245, 158, 11)',  // amber (Amber-500)
    'rgb(234, 179, 8)',   // yellow (Yellow-500)
    'rgb(132, 204, 22)',  // lime (Lime-500)
    'rgb(34, 197, 94)',   // green (Green-500)
    'rgb(16, 185, 129)',  // emerald (Emerald-500)
    'rgb(20, 184, 166)',  // teal (Teal-500)
    'rgb(6, 182, 212)',   // cyan (Cyan-500)
    'rgb(14, 165, 233)',  // sky (Sky-500)
    'rgb(59, 130, 246)',  // blue (Blue-500)
    'rgb(99, 102, 241)',  // indigo (Indigo-500)
    'rgb(139, 92, 246)',  // violet (Violet-500)
    'rgb(168, 85, 247)',  // purple (Purple-500)
    'rgb(217, 70, 239)',  // fuchsia (Fuchsia-500)
    'rgb(236, 72, 153)',  // pink (Pink-500)
    'rgb(244, 63, 94)',   // rose (Rose-500)
  ];

  const handleDressUp = (part: string, outfit: string) => {
    setSelectedOutfits((prevOutfits: any) => ({
      ...prevOutfits,
      [part]: outfit,
    }));
  };

  const handleIntensityChange = (event: Event, newValue: number | number[]) => {
    const newColorLevel = (newValue as number).toString();
    setColorLevel(newColorLevel);
  };

  const handleColorChange = (newValue: string) => {
    setBackgroundColor(newValue);
  };

  const handleSubmit = () => {
    model.data.Outfits = JSON.stringify(selectedOutfits);
    model.data.BgColor = backgroundColor;
    model.data.brightness = colorLevel;
    done(model);
  };

  return (
    <div className="flex flex-col h-full w-full select-none">
      <DressUpDisplay outfits={selectedOutfits} backColor={backgroundColor} brightness={colorLevel} />
      <div className="flex flex-col items-center w-full h-full overflow-y-visible overflow-x-hidden">
        <Box className="relative flex flex-col items-center w-full p-4 bg-transparent rounded-lg">
          <MenuDisplay onDressUp={handleDressUp} />
          {/* <Slider
            aria-label="Color Intensity"
            defaultValue={0.8}
            onChange={handleIntensityChange}
            step={0.1}
            marks
            min={0.6}
            max={1}
            color="secondary"
            valueLabelDisplay="off"
            className="mt-4"
          /> */}
          {/* <Typography className="text-[#9c27b0] mt-2">Change Intensity</Typography> */}
          <Box className="grid grid-cols-11 border p-2 bg-slate-200 rounded-md mt-4">
            {backgroundColors.map((color, index) => (
              <button
                key={index}
                className={`w-10 h-10 m-1 hover:opacity-75 rounded-full shadow-md`}
                style={{ backgroundColor: color, filter: `brightness(${colorLevel})` }}
                onClick={() => handleColorChange(color)}
              ></button>
            ))}
          </Box>
          <Button sx={{ marginTop: 4 }} color="secondary" variant="contained" onClick={handleSubmit}>
            <span>Preview</span>
            <ChevronRightRoundedIcon className="-translate-y-[1px]" />
          </Button>
        </Box>
      </div>
    </div>
  );
};

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
    <Box sx={{ display: 'flex', height: 'auto', width: '100%', overflow: 'hidden', }} className='flex-col border shadow-md bg-slate-100 rounded-lg'>
      <Tabs
        orientation="horizontal"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        textColor="inherit"
        indicatorColor="secondary"
        aria-label="Parts container"
        sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}
        className='border-[#9c27b0] text-[#9c27b0]'
      >
        {Object.keys(actions).map((part, index) => (
          <Tab key={index} label={part} {...a11yProps(index)} />
        ))}
      </Tabs>
      {Object.keys(actions).map((part, index) => (
        <TabPanel key={index} value={value} index={index}>
          <div className="flex flex-row w-full justify-start overflow-x-auto hide-scrollbar"> {/* Overflow-x added for horizontal scrolling */}
            {actions[part as keyof typeof actions].map((item: string) => (
              <>
                {item !== "" ?
                  <Avatar
                    key={item}
                    src={item}
                    onClick={() => onDressUp(part, item)}
                    alt='outfit'
                    className='hover:bg-slate-200 hover:rounded-none cursor-pointer w-[100px] h-[150px] mx-2'
                    sx={{ flexShrink: 0 }}  // Ensure avatars do not shrink to fit
                  />
                  : <DoNotDisturbAltIcon
                    className='text-red-600 hover:bg-slate-200 cursor-pointer w-[100px] h-[150px] mx-2'
                    sx={{ flexShrink: 0 }}
                  />}
              </>
            ))}
          </div>
        </TabPanel>
      ))}
    </Box>
  );
};

const DressUpDisplay = ({ outfits, backColor, brightness }: { outfits: { [key: string]: string }; backColor: string, brightness: string }) => {
  return (
    <div style={{ zIndex: 3, backgroundColor: backColor, filter: `brightness(${brightness})` }} className={`w-full flex items-start justify-center h-[420px] border shadow-md rounded-lg`}>
      <div className="relative w-[20em] h-[420px] pointer-events-none">
        {Object.keys(outfits).map((part, index) => (
          <div key={index}>
            {outfits[part] !== "" ? (
              <img src={outfits[part]} alt={part} style={{ marginTop: '-64px' }} className="absolute w-full" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};