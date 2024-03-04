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
    var searchString = "";
    return (
      <ReactGiphySearchbox
        apiKey={import.meta.env.VITE_GIPHY_KEY}
        onSelect={(item: any) => {
          this.model.data["randomGif"] = item.id as string;
          if (searchString) this.model.data["randomGifTag"] = searchString;
          done(this.model);
        }}
        onSearch={(search: any) => {
          searchString = search;
        }}
        masonryConfig={[{ columns: 3, imageWidth: 150, gutter: 10 }]}
      />
    );
  }

  renderErrorState() {
    return <h1>Error: Coudn't figure out the url</h1>;
  }
}
