import React, { useState, useEffect } from "react";
import { Gif } from "@giphy/react-components"
import { GiphyFetch } from "@giphy/js-fetch-api";

export default function GifViewer({ id }) {
  const giphyFetch = new GiphyFetch(process.env.REACT_APP_GIPHY_KEY);

  const [gifData, setGifData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      giphyFetch.gif(id).then(({ data }) => {
        setGifData(data);
      });
    }
    fetchData()
  }, [id]);

  return (
    <div className="w-full">
    {gifData && <img src={gifData.images.original.url} width={"100%"}/>}
    </div>
  );
}