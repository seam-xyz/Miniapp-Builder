import React, { useState, useEffect } from "react";
import { IconButton, Button, Typography, Grid, Stack, Avatar, Modal, Divider, Card } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";
import BlockSelectorModal from './BlockSelectorModal.js';
import feather from 'feather-icons';
import BlockFactory from "./blocks/BlockFactory";
import { createTheme } from "@mui/material/styles";
import { nanoid } from 'nanoid'

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(2),
    color: 'white',
  },
  title: {
    color: 'black',
    marginBottom: theme.spacing(4),
    fontFamily: 'Public Sans',
  },
  postTypeButton: {
    margin: theme.spacing(1),
    width: 'calc(33.33% - 16px)',
    textAlign: 'center',
  },
  iconCircle: {
    backgroundColor: '#FFFFFF',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#D3D3D3', // Darker shade on hover
    },
    boxShadow: '0px 3px 6px #00000029',
  },
  centeredContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(6),
    height: '100%',
  },
  iconButton: {
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0px',
    backgroundColor: 'white',
    boxShadow: '0px 3px 6px #00000029',
  },
  iconInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  iconContainer: {
    width: '100px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '100px',
    minWidth: '60px',
  },
  iconLabel: {
    paddingTop: theme.spacing(1),
    fontSize: '0.75rem',
    lineHeight: '1.5',
    fontFamily: 'Public Sans',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  desktopComposer: {
    backgroundColor: "#EFEFEF",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'auto',
    padding: theme.spacing(2),
    borderRadius: 24,
  },
  narrowComposer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'auto',
    paddingBlock: theme.spacing(2),
    borderRadius: 24,
  },
  composerPrompt: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 'fill-available',
    margin: theme.spacing(1),
    boxShadow: '0px 3px 6px #00000029',
  },
  promptText: {
    marginLeft: theme.spacing(2),
    color: '#909090',
    fontFamily: 'Public Sans',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  composerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    width: '100%',
    paddingInline: theme.spacing(2),
  },
  avatar: {
    marginRight: theme.spacing(2),
    boxShadow: '0px 3px 6px #00000029',
  },
  iconRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    overflowX: 'auto',
    width: '100%',
    paddingInline: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  compactComposerButton: {
    backgroundColor: '#0078FF',
    color: 'white',
    borderRadius: 24,
    width: '100%',
    textAlign: 'center',
    cursor: 'pointer',
    boxShadow: '0px 3px 6px #0000029',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'auto',
    padding: theme.spacing(2),
    fontFamily: 'Public Sans',
  },
  createPostButton: {
    backgroundColor: 'black',
    color: 'white',
    borderRadius: '24px',
    width: '100%',
    height: 'auto',
    marginTop: '20px',
    fontFamily: 'Public Sans',
  },
  dividerStyle: {
    height: '2px',
    width: '96.2%',
    marginBlock: '10px',
  }
}));

const postTypes = [
  { type: 'Pixel Art', icon: 'image', block: 'PixelArt' },
  { type: 'Music', icon: 'music', block: 'Music' },
  { type: 'GIF', icon: 'film', block: 'giphy' },
  { type: 'Video', icon: 'video', block: 'video' },
  { type: 'Photo', icon: 'camera', block: 'image' },
  { type: 'Link', icon: 'link', block: 'link' },
  { type: 'Scroll Text', icon: 'fast-forward', block: 'Marquee' },
  { type: 'Flash Text', icon: 'zap', block: 'FlashingText' },
];

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#020303"
    },
    secondary: {
      main: "#1C1C1C"
    },
    info: {
      main: "#CCFE07" // Button Background
    }
  },
  typography: {
    fontFamily: "monospace"
  },
});

const Composer = ({ addNewPost }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedBlockType, setSelectedBlockType] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedBlockData, setSelectedBlockData] = useState(null);
  const [composerStep, setComposerStep] = useState('selectBlock');
  const promptText = "Welcome to the Seam Block SDK!"
  const isMobile = false

  const getFeatherIcon = (iconName) => {
    return feather.icons[iconName] ? feather.icons[iconName].toSvg() : '';
  };

  const classes = useStyles({ isMobile });

  const handleCreatePost = () => {
    addNewPost(selectedBlockData)
    setDescription('');
    setSelectedBlockType(null);
    setSelectedBlockData(null);  // Reset the block data

    handleClose();  // Close the modal after creating the post
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleIconClick = (event, blockType) => {
    handleClick(event);
    setSelectedBlockType(blockType);
    setComposerStep('editBlock'); // Directly go to the edit block step
  };

  const renderBlockPreview = (blockData) => {
    if (!blockData) return <div>No Block Data</div>;
    const blockPreview = BlockFactory.getBlock(blockData, defaultTheme)?.render?.();

    if (!blockPreview) {
      return <div>Preview not available</div>;
    }

    return (
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        {blockPreview}
      </div>
    );
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGoBack = () => {
    if (composerStep === 'editBlock') {
      setComposerStep('selectBlock');
    } else if (composerStep === 'previewPost') {
      setComposerStep('editBlock');
    }
    // No action for 'selectBlock' as it's the first step
  };

  const handleBlockTypeClick = (blockType) => {
    setSelectedBlockType(blockType);
    setComposerStep('editBlock'); // Move to the block editing step
  };

  const renderPostTypeButtons = () => {
    return (
      <>
        {postTypes.map((postType) => (
          <Grid item key={postType.type} className={classes.postTypeButton}>
            <div className={classes.iconCircle} onClick={() => handleBlockTypeClick(postType.block)}>
              <i style={{ color: "black", height: '24px', width: '24px' }} dangerouslySetInnerHTML={{ __html: getFeatherIcon(postType.icon) }} />
            </div>
            <Typography style={{ color: "black" }} className={classes.iconLabel} variant="caption">{postType.type}</Typography>
          </Grid>
        ))}
        <Grid item className={classes.postTypeButton}>
          <div className={classes.iconCircle}>
            <i style={{ color: "black", height: '24px', width: '24px' }} dangerouslySetInnerHTML={{ __html: getFeatherIcon('edit') }} />
          </div>
          <Typography style={{ color: "black" }} className={classes.iconLabel} variant="caption">Text Post</Typography>
        </Grid>
      </>
    );
  };


  const renderDesktopPostTypeButtons = () => {
    return (
      <Stack direction={"row"} className={classes.iconRow} spacing={1}>
        {postTypes.map((postType) => (
          <div key={postType.type} className={classes.iconContainer}>
            <IconButton
              className={classes.iconButton}
              aria-label={postType.type.toLowerCase()}
              onClick={(event) => handleIconClick(event, postType.block)}
            >
              <span className={classes.iconInner} dangerouslySetInnerHTML={{ __html: getFeatherIcon(postType.icon, "black") }} />
            </IconButton>
            <Typography className={classes.iconLabel} variant="caption">
              {postType.type}
            </Typography>
          </div>
        ))}
      </Stack>
    );
  };

  // Step rendering functions
  const chooseBlockStep = () => (
    <div className={classes.centeredContent}>
      <Typography variant="h5" className={classes.title}>Choose a Block</Typography>
      <Grid container>
        {renderPostTypeButtons()}
      </Grid>
    </div>
  );

  const editBlockStep = () => (
    <div style={{ maxHeight: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', }}>
        <Button onClick={handleGoBack} style={{ color: "black", marginBottom: '20px' }}>
          Go Back
        </Button>
        <IconButton className={classes.closeButton} onClick={handleClose}>
          <CloseIcon style={{ color: "black" }} />
        </IconButton>
      </div>
      <BlockSelectorModal
        selectedBlockType={selectedBlockType}
        setSelectedBlockData={(data) => {
          console.log(data)
          setSelectedBlockData(data);
          setComposerStep('previewPost'); // Move to the next step after editing
        }}
        style={{ width: '100%' }} // Ensure BlockSelectorModal takes full width
      />
    </div>
  );

  const previewBlockStep = () => (
    <div style={{ maxHeight: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', }}>
        <Button onClick={handleGoBack} style={{ color: "black", marginBottom: '20px' }}>
          Go Back
        </Button>
      </div>
      {/* Render the block preview only if there is block data */}
      {selectedBlockData && renderBlockPreview(selectedBlockData)}
      <Button onClick={handleCreatePost} className={classes.createPostButton}>Create Post</Button>
    </div>
  );

  // Function to determine which step to render
  const renderContent = () => {
    switch (composerStep) {
      case 'selectBlock':
        return chooseBlockStep();
      case 'editBlock':
        return editBlockStep();
      case 'previewPost':
        return previewBlockStep();
      default:
        return null;
    }
  };

  return (
    <>
      <div className={classes.desktopComposer}>
        <div className={classes.composerHeader}>
          <Avatar className={classes.avatar} />
          <div className={classes.composerPrompt}>
            <Typography variant="subtitle1" className={classes.promptText}>{promptText}</Typography>
          </div>
        </div>
        <Divider className={classes.dividerStyle} />
        {renderDesktopPostTypeButtons()}
        <Modal
          open={open}
          footer={null}
          onClose={handleClose}
          style={{
            display: 'block',
            fontSize: "16px",
            overflowY: 'visible'
          }}
        >
          <Card
            style={{
              marginTop: "10px",
              borderRadius: "1rem",
              padding: "15px",
              width: isMobile ? "100%" : "500px",
              position: 'absolute',
              top: isMobile ? 0 : '0%',
              left: '50%',
              transform: 'translate(-50%, 0)',
              height: isMobile ? "100%" : undefined,
              maxHeight: "90%"
            }}
          >
            <IconButton className={classes.closeButton} onClick={handleClose}>
              <CloseIcon style={{ color: "black" }} />
            </IconButton>
            {renderContent()}
          </Card>
        </Modal>
      </div>
    </>
  );
};

export default Composer;