import React, { useState } from "react";
import { Button, Modal, Divider, Card } from "@mui/material";
import { makeStyles } from "@mui/styles";
import BlockSelectorModal from './BlockSelectorModal.js';
import BlockFactory from "./blocks/BlockFactory";
import { createTheme } from "@mui/material/styles";
import feather from 'feather-icons';
import { BlockTypes } from "./blocks/types";
import ComposerMiniAppItem from "./ComposerMiniAppItem";

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
      backgroundColor: '#D3D3D3',
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
  const [isOpen, setIsOpen] = useState(null);
  const [selectedBlockType, setSelectedBlockType] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedBlockData, setSelectedBlockData] = useState(null);
  const [composerStep, setComposerStep] = useState('selectBlock');
  const isMobile = false;
  let supportedBlocks = (Object.entries(BlockTypes).filter((blockType) => !blockType[1].deprecated && blockType[1].doesBlockPost)).reverse();

  const classes = useStyles({ isMobile });

  const handleCreatePost = () => {
    addNewPost(selectedBlockData)
    setDescription('');
    setSelectedBlockType(null);
    setSelectedBlockData(null);  // Reset the block data

    handleClose();  // Close the modal after creating the post
  };

  const getFeatherIcon = (iconName) => {
    return feather.icons[iconName] ? feather.icons[iconName].toSvg() : '';
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
    setIsOpen(false);
  };

  const handleGoBack = () => {
    if (composerStep === 'editBlock') {
      handleClose();
    } else if (composerStep === 'previewPost') {
      setComposerStep('editBlock');
    }
  };

  const renderDesktopPostTypeButtons = () => {
    return (
      <div>
        <h2 className="mb-4">All miniapps</h2>
        {supportedBlocks.map((block) => (
          <div id={block[1].type}>
            <ComposerMiniAppItem
              block={block[1]}
              tapAction={() => {
                setIsOpen(true)
                setSelectedBlockType(block[1].type);
                setComposerStep('editBlock');
              }}
            />
            <Divider />
          </div>
        ))}
        <div style={{ height: "100px" }} />
      </div>
    );
  };

  const editBlockStep = () => (
    <div style={{ maxHeight: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
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

  const renderContent = () => {
    switch (composerStep) {
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
      {renderDesktopPostTypeButtons()}
      <Modal
        open={isOpen}
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
          {renderContent()}
        </Card>
      </Modal>
    </>
  );
};

export default Composer;