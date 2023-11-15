import React, { useState, useEffect } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";

export default function RandomGifViewer({ tag }) {
  const giphyFetch = new GiphyFetch(process.env.REACT_APP_GIPHY_KEY);

  const [gifData, setGifData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data } = await giphyFetch.random({ tag });

      setGifData(data);
    }
    fetchData();
  }, [tag]);

  return (
    gifData && <img src={gifData.images.original.url} width={"100%"}/>
  );
}
