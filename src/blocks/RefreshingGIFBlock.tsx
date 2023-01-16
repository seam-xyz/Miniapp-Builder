import React, { useState, useEffect } from "react";

import Block from "./Block";
import { BlockModel } from "./types";
import BlockFactory from "./BlockFactory";
import "./BlockStyles.css";

import RandomGifViewer from "./utils/RandomGifViewer";

// @ts-ignore
import ReactGiphySearchbox from "react-giphy-searchbox";

export default class RefreshingGIFBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!);
    }

    let gifTag = this.model.data["randomGifTag"];

    return <RandomGifViewer tag={gifTag} />;
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <ReactGiphySearchbox
        apiKey={process.env.REACT_APP_GIPHY_KEY}
        onSelect={(item: any) => {
          console.log(item);
          this.model.data["randomGif"] = item.id as string;
          done(this.model);
        }}
        onSearch={(search: any) => {
          console.log("Search", search);
          this.model.data["randomGifTag"] = search as string;
        }}
        masonryConfig={[{ columns: 3, imageWidth: 150, gutter: 10 }]}
      />
    );
  }

  renderErrorState() {
    return <h1>Error: Coudn't figure out the url</h1>;
  }
}
