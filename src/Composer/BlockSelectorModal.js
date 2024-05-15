import React, { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import BlockFactory from '../blocks/BlockFactory';
import { createTheme } from "@mui/material/styles";

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#020303"
    },
    secondary: {
      main: "#1C1C1C"
    },
    info: {
      main: "#CCFE07" // Button Background
    }
  },
  typography: {
    fontFamily: "monospace"
  },
});

const BlockSelectorModal = ({ selectedBlockType, setSelectedBlockData }) => {
  const [selectedBlockInstance, setSelectedBlockInstance] = useState(null);
  const [width, setWidth] = useState(0);
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      setWidth(divRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    const model = {
      type: selectedBlockType,
      data: {},
      uuid: nanoid()  // Generate a new unique ID
    };

    const blockInstance = BlockFactory.getBlock(model, defaultTheme);
    if (blockInstance) {
      setSelectedBlockInstance(blockInstance);
    } else {
      console.error(`Failed to load block of type ${selectedBlockType}`);
    }
  }, [selectedBlockType]);

  const handleDone = (data) => {
    setSelectedBlockData(data);  // Update the block data in parent component
  };

  return (
    <div ref={divRef} style={{ maxWidth: '100vw', overflow: 'visible', }}>
      {selectedBlockInstance && selectedBlockInstance.renderEditModal(handleDone, width)}
    </div>
  );
};

export default BlockSelectorModal;
