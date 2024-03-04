import React, { useState, useEffect } from "react";
import { Gif } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";

export default function RandomGifViewer({ tag }) {
  const giphyFetch = new GiphyFetch(import.meta.env.VITE_GIPHY_KEY);

  const [gifData, setGifData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data } = await giphyFetch.random({ tag });

      setGifData(data);
    }
    fetchData();
  }, [tag]);

  return (
    gifData && (
      <Gif gif={gifData} width={"100%"} height={"100%"} noLink={true} />
    )
  );
}
