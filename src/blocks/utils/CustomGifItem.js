import React from "react";

export default function CustomGifItem({ gif, onGifClick }) {
  return (
    <div className="p-1 cursor-pointer" onClick={() => onGifClick(gif)}>
      <img src={gif.images.fixed_width.url} alt={gif.title} className="rounded-lg" />
    </div>
  );
}