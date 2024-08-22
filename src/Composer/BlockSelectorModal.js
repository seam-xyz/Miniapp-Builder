import React, { useEffect, useMemo, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import BlockFactory from '../blocks/BlockFactory';

const BlockSelectorModal = ({ selectedBlockType, initialBlockData, setSelectedBlockData }) => {
  const [width, setWidth] = useState(undefined);
  const divRef = useRef(null);
  const isFullscreenEdit = BlockFactory.doesBlockEditFullscreen(selectedBlockType);

  useEffect(() => {
    if (divRef.current && divRef.current.offsetWidth > 0) {
      setWidth(divRef.current.offsetWidth);
    }
  }, [divRef.current]);

  const done = (data) => {
    setSelectedBlockData(data);  // Update the block data in parent component
  };

  const model = {
    type: selectedBlockType,
    data: initialBlockData || {},
    uuid: nanoid()  // Generate a new unique ID
  };
  const instance = BlockFactory.getComposerComponent({model, done, width});

  return (
    <div 
      ref={divRef} 
      className={isFullscreenEdit ? "h-full" : "mx-4 h-full"} 
      style={isFullscreenEdit ? undefined : { height: 'calc(100% - 72px)' }}
    > 
      {selectedBlockType && instance}
    </div>
  );
};

export default BlockSelectorModal;
