import React, { useEffect, useState } from 'react';
import { ThemeTypes } from '../../themes/ThemeTypes';  
import { nanoid } from 'nanoid';
import BlockFactory from './blocks/BlockFactory';

const BlockSelectorModal = ({ selectedBlockType, setSelectedBlockData }) => {
  const [selectedBlockInstance, setSelectedBlockInstance] = useState(null);
  const themeName = "Blueprint"; 

  useEffect(() => {
    const model = {
      type: selectedBlockType,
      data: {},
      uuid: nanoid()  // Generate a new unique ID
    };
    
    const blockInstance = BlockFactory.getBlock(model, ThemeTypes[themeName].theme);
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
    <div style={{ maxWidth: '100vw', overflow: 'visible',}}>
      {selectedBlockInstance && selectedBlockInstance.renderEditModal(handleDone)}
    </div>
  );
};

export default BlockSelectorModal;
