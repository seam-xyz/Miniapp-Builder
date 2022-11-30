// NOTE: This is a testing harness so you can resize your new block similar to how it will look on www.seam.so
// Don't edit anything in this file, it won't be reflected in production.

import React, { useState } from "react";
import { Card, Modal } from "antd";
//import 'antd/dist/antd.css';
import { v1 as uuidv1 } from 'uuid';
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import { withSize } from "react-sizeme";
import Widget from "./Widget";

// Blocks
import BlockFactory from './blocks/BlockFactory';

function Content({ size: { width }, loadedBlocks }) {
  const [layouts, setLayouts] = useState({ lg: [{ x: 0, y: 0, w: 5, h: 15, i: "test" }] });
  const [blocks, setBlocks] = useState(loadedBlocks);

  const [isEditingBlock, setIsEditingBlock] = useState(-1) // number is the index of the block being edited
  const onLayoutChange = (_, allLayouts) => {
    setLayouts(allLayouts);
  };

  // incoming blockUUID
  const onRemoveItem = (itemId) => {
    setBlocks(blocks.filter((model) => model.uuid !== itemId));
  };
  const onEditItem = (itemId) => {
    const indexOfEditedBlock = blocks.findIndex(element => element.uuid == itemId)
    console.log("editing block " + indexOfEditedBlock)
    setIsEditingBlock(indexOfEditedBlock)
  };
  const onAddItem = (blockName) => {
    const newBlock = {
      type: blockName,
      data: {},
      uuid: uuidv1()
    }
    setBlocks([...blocks, newBlock]);
  };
  const renderBlock = (model) => {
    let block = BlockFactory.getBlock(model)
    return block.render()
  }
  const renderBlockEditModal = () => {
    const block = isEditingBlock != -1 ? BlockFactory.getBlock(blocks[isEditingBlock]) : null
    return (
      <Modal
        visible={isEditingBlock != -1}
        footer={null}
        onCancel={() => setIsEditingBlock(-1)}
        bodyStyle={{
          padding: "15px",
          fontSize: "17px",
          fontWeight: "500",
        }}
        style={{ fontSize: "16px", fontWeight: "500" }}
      >
        {"Edit Block " + isEditingBlock}
        <Card
          style={{
            marginTop: "10px",
            borderRadius: "1rem",
          }}
          bodyStyle={{ padding: "15px" }}
        >
          {block?.renderEditModal(saveBlockData)}
        </Card>
      </Modal>
    );
  }

  const saveBlockData = (data) => {
    console.log("updating block data")
    let blocksCopy = blocks
    blocksCopy[isEditingBlock] = data
    console.log(blocksCopy)
    setBlocks(blocksCopy)
    setIsEditingBlock(-1)
  }

  return (
    <>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, xxs: 0 }}
        cols={{ lg: 12, xxs: 2 }}
        rowHeight={5}
        width={width}
        onLayoutChange={onLayoutChange}
        resizeHandles={['se']}
      >
        {blocks.map((model, index) => (
          <div
            key={model.uuid}
            className="widget"
            data-grid={{ w: 3, h: 2, x: 0, y: Infinity }}
          >
            <Widget id={model.uuid}
              onRemoveItem={onRemoveItem}
              onEditItem={onEditItem}
            >
              {renderBlock(model)}
            </Widget>
          </div>
        ))}
      </ResponsiveGridLayout>
      {renderBlockEditModal()}
    </>
  );
}

export default withSize({ refreshMode: "debounce", refreshRate: 60 })(Content);