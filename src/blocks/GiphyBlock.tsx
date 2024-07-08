import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'react-feather';
import Block from './Block';
import { BlockModel } from './types';
import BlockFactory from './BlockFactory';
import { GiphyFetch, GifsResult } from '@giphy/js-fetch-api';
import { Box } from '@mui/material';
import debounce from 'lodash/debounce';

const giphyFetch = new GiphyFetch(process.env.REACT_APP_GIPHY_KEY ?? "");

export default class GiphyBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!);
    }

    let gifID = this.model.data['gif'];

    return (
      <div className="flex flex-col items-center h-full w-full rounded-lg">
        <GifViewer id={gifID} />
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void, width?: string) {
    return (
      <div style={{ height: '100%' }} className="relative flex flex-col items-center h-full rounded-lg">
        <CustomGifSearch
          onSelect={(item: any) => {
            this.model.data['gif'] = item.id as string;
            done(this.model);
          }}
        />
      </div>
    );
  }

  renderErrorState() {
    return (
      <h1 className="text-red-500">Error: Couldn't figure out the URL</h1>
    );
  }
}

interface CustomGifSearchProps {
  onSelect: (item: any) => void;
}

const CustomGifSearch: React.FC<CustomGifSearchProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [gifs, setGifs] = useState<GifsResult['data']>([]);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term) {
        giphyFetch.search(term, { limit: 20 }).then((res) => {
          setGifs(res.data);
        });
      } else {
        giphyFetch.trending({ limit: 20 }).then((res) => {
          setGifs(res.data);
        });
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  return (
    <div style={{ height: 'calc(100vh - 150px)' }} className="w-full relative flex flex-col justify-center items-center">
      <div style={{ height: '500px' }} className="flex-1 overflow-y-auto hide-scrollbar p-4 grid grid-cols-2 gap-4">
        {gifs.map((gif) => (
          <div key={gif.id} className="cursor-pointer" onClick={() => onSelect(gif)}>
            <img src={gif.images.fixed_width_downsampled.webp || gif.images.fixed_width_downsampled.url} alt={gif.title} className="rounded-lg h-full w-full max-w-[200px] max-h-[200px]" />
          </div>
        ))}
      </div>
      <Box className="space-y-2 w-auto h-auto flex justify-center items-center" style={{ paddingBottom: `calc(env(safe-area-inset-bottom, 24px) + 24px)` }} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 3, bgcolor: 'transparent', zIndex: 1301 }}>
        <div className="relative w-9/12 mr-[50px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search for GIFs"
            className="rounded-full py-2 pl-10 mr-10 border border-gray-300 placeholder:ml-1 focus:outline-none focus:ring-2 focus:ring-seam-blue w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Box>
    </div>
  );
};

interface GifViewerProps {
  id: string;
}

const GifViewer: React.FC<GifViewerProps> = ({ id }) => {
  const [gifData, setGifData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      giphyFetch.gif(id).then(({ data }) => {
        setGifData(data);
      });
    }
    fetchData();
  }, [id]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      {gifData && (
        <img
          src={gifData.images.fixed_width.webp || gifData.images.fixed_width_downsampled.url}
          className="rounded-lg w-full h-full"
          alt="GIF"
          width="100%"
        />
      )}
    </div>
  );
};