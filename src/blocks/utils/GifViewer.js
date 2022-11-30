import React, { useState, useEffect } from "react";
import { Gif } from "@giphy/react-components"
import { GiphyFetch } from "@giphy/js-fetch-api";

export default function GifViewer({ id }) {
  const giphyFetch = new GiphyFetch(process.env.REACT_APP_GIPHY_KEY);

  const [gifData, setGifData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data } = await giphyFetch.gif(id);
      setGifData(data);
    }
    fetchData()
  }, [id]);

  return gifData && <Gif gif={gifData} width={"100%"} height={"100%"} noLink={true} />;
}