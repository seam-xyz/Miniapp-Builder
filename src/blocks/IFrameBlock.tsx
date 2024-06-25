import React, { useState, useEffect, useCallback } from 'react';
import Block from './Block';
import { BlockModel } from './types';
import BlockFactory from './BlockFactory';
import './BlockStyles.css';
import Iframely from './utils/Iframely';
import { Box, TextField, CircularProgress, Typography, Button, Divider } from "@mui/material";
import SeamSaveButton from '../components/SeamSaveButton';
import { debounce } from 'lodash';

export default class IFrameBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!);
    }

    let url = this.model.data["url"];
    if (url === undefined) {
      return this.renderErrorState();
    }

    return (
      <Box style={{ height: '100%', width: '100%' }}>
        <Iframely url={url} style={{ height: '100%', width: '100%' }} />
      </Box>
    );
  }

  renderEditModal(done: (data: BlockModel) => void): React.ReactNode {
    return <IFrameEditModal model={this.model} done={done} />;
  }

  renderErrorState() {
    return (
      <h1>Broken URL, please try again.</h1>
    );
  }
}

const IFrameEditModal: React.FC<{ model: BlockModel; done: (data: BlockModel) => void }> = ({ model, done }) => {
  const [loading, setLoading] = useState(false);
  const [embedHtml, setEmbedHtml] = useState<string | null>(null);
  const [url, setUrl] = useState<string>(model.data['url'] || "");

  const fetchEmbed = useCallback(
    debounce(async (url: string) => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://cdn.iframe.ly/api/iframely?url=${encodeURIComponent(url)}&key=${process.env.REACT_APP_IFRAMELY_KEY}&iframe=0&omit_script=1`
        );
        const data = await response.json();
        if (data.html) {
          setEmbedHtml(data.html);
          model.data['url'] = url;
        } else {
          setEmbedHtml(null);
          console.error('Failed to fetch embed:', data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching embed:', error);
        setEmbedHtml(null);
      } finally {
        setLoading(false);
      }
    }, 2500),
    []
  );

  useEffect(() => {
    if (url) {
      fetchEmbed(url);
    }
  }, [url, fetchEmbed]);

  const handleFinalize = () => {
    if (embedHtml) {
      done(model);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    setUrl(newUrl);
  };

  return (
    <Box className="w-full h-full">
      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}
      {embedHtml && !loading && (
        <Box mt={2}>
          <Typography>Embed Preview:</Typography>
          <div dangerouslySetInnerHTML={{ __html: embedHtml }} />
        </Box>
      )}
      {!embedHtml && !loading && url && (
        <Box className="w-full h-full flex justify-center items-start" mt={2}>
          <Typography variant="h1">No preview available for this URL.</Typography>
        </Box>
      )}
      <Box
        component="form"
        className="bg-seam-white px-4"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)',
          paddingTop: 'calc(env(safe-area-inset-bottom, 24px) + 24px)',
          backgroundColor: 'background.paper',
          zIndex: 1301,
        }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="url"
          label="Post a link from anywhere on the web"
          name="url"
          value={url}
          onChange={handleUrlChange}
          disabled={loading}
          sx={{
            [`& fieldset`]: {
              borderRadius: 0,
            },
            "& .MuiInputBase-input": {
              fontFamily: "Public Sans",
              // Additional styling here if needed
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none", // This removes the border
              },
              "&:hover fieldset": {
                border: "none", // Removes the border on hover
              },
              "&.Mui-focused fieldset": {
                border: "none", // Removes the border when the component is focused
              },
            },
            "& .MuiInputLabel-root": {
              color: '#606060', // Label color
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: '#606060', // Ensures the label color remains the same when focused
            }
          }}
        />
        <Divider className="h-[2px] w-full mb-4"/>
        <SeamSaveButton onClick={() => handleFinalize} />
      </Box>
    </Box>
  );
};