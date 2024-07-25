import React, { useEffect, useMemo, useRef, useState } from 'react';
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

const BlockSelectorModal = ({ selectedBlockType, initialBlockData, setSelectedBlockData }) => {
  const [width, setWidth] = useState(undefined);
  const divRef = useRef(null);
  const isFullscreenEdit = BlockFactory.doesBlockEditFullscreen(selectedBlockType);

  useEffect(() => {
    if (divRef.current && divRef.current.offsetWidth > 0) {
      setWidth(divRef.current.offsetWidth);
    }
  }, [divRef.current]);

  const handleDone = (data) => {
    setSelectedBlockData(data);  // Update the block data in parent component
  };

  const initialModel = {
    type: selectedBlockType,
    data: initialBlockData || {},
    uuid: nanoid()  // Generate a new unique ID
  };
  const instance = BlockFactory.getComposerComponent(initialModel, handleDone);

  return (
    <div ref={divRef} className={isFullscreenEdit ? "h-full" : "mx-4 h-auto"} style={{ overflow: 'visible' }}>
      {selectedBlockType && instance}
    </div>
  );
};

export default BlockSelectorModal;
