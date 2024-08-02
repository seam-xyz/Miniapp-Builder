import {
  IonContent,
  IonList,
  IonModal,
} from "@ionic/react";
import { useRef, useReducer } from "react";
import { ChevronLeft, Plus, X } from "react-feather";
import ComposerMiniAppItem from "./ComposerMiniAppItem";
import SeamHeaderBar from "../components/SeamHeaderBar";
import { Button, Divider, Input } from "@mui/material";
import BlockFactory from "../blocks/BlockFactory";
import { BlockTypes } from "../blocks/types";
import { makeStyles } from "@mui/styles";
import BlockSelectorModal from "./BlockSelectorModal";
import { createTheme } from "@mui/material/styles";

const initialState = {
  isOpen: false,
  selectedBlockType: null,
  description: "",
  selectedBlockData: {},
  composerStep: "selectBlock",
};

const useStyles = makeStyles({
  noScrollBar: {
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "-ms-overflow-style": "none" /* IE and Edge */,
    "scrollbar-width": "none" /* Firefox */,
  },
});

const defaultTheme = createTheme({
  palette: {
    primary: {        // Page Background
      main: "#FEFEFE"
    },
    secondary: {
      main: "#FEFEFE"  // Block Background (Profile, ect. Buttons take on the info)
    },
    info: {
      main: "#0288D1"
    }
  },
  typography: {
    fontFamily: "Public Sans"
  },
})

// Define the reducer function
function reducer(state, action) {
  switch (action.type) {
    case "dismiss":
      return { ...initialState };
    case "tapReblog":
      return {
        ...state,
        isOpen: true,
        reblogPost: action.payload,
        composerStep: "reblog",
      };
    case "handleGoBack":
      if (state.composerStep === "editBlock") {
        return { ...state, composerStep: "selectBlock" };
      } else if (state.composerStep === "previewPost") {
        return { ...state, composerStep: "editBlock" };
      }
    case "chooseBlock":
      return {
        ...state,
        selectedBlockType: action.payload,
        composerStep: "editBlock",
      };
    case "finishBlockEditing":
      return {
        ...state,
        selectedBlockData: action.payload,
        composerStep: "previewPost",
      };
    case "setIsOpen":
      return { ...state, isOpen: action.payload };
    case "setDescription":
      return { ...state, description: action.payload };
    default:
      throw new Error();
  }
}

function Composer({ addNewPost }) {
  const modal = useRef(null);
  const blockPreviewRef = useRef(null);
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  let supportedBlocks = Object.entries(BlockTypes).filter((blockType) => !blockType[1].deprecated && blockType[1].doesBlockPost).reverse();

  const handleCreatePost = async () => {
    addNewPost(state.selectedBlockData, state.description);

    dismiss();
  };

  function dismiss() {
    dispatch({ type: "dismiss" });
    modal.current?.dismiss();
  }

  const chooseBlock = (blockType) => {
    dispatch({ type: "chooseBlock", payload: blockType });
  };

  const chooseBlockStep = () => (
    <div className={`${classes.noScrollBar} mx-4 my-0 h-full`}>
      <div className={`${classes.noScrollBar} flex items-center justify-between bg-white`}>
        <div className="flex items-start w-full flex-col mt-4 space-y-4">
          <div className="flex flex-row w-full justify-between items-center">
            <h2 className="w-full">Test your new miniapp here!</h2>
            <div
              onClick={() => {
                dismiss();
              }}
              className="flex justify-center items-center gap-2 py-2 px-2 text-white rounded-full bg-[#efefef]"
            >
              <X color="black" />
            </div>
          </div>
          <h3>See how making a post with your miniapp would look on Seam.</h3>
          <Divider className="w-full h-auto" />
          <div className="space-y-2">
            <h3 style={{fontWeight: '600'}} className="text-[#E12451]">**Please read: The Miniapp Builder is a work in progress.</h3>
            <h4 style={{fontWeight: '500'}}>If you're having trouble with your miniapp, try reading <a target="_blank" href="http://docs.getseam.xyz"><span>our docs!</span></a></h4>
            <h4 style={{fontWeight: '500'}}>Alternatively, you can <a target="_blank" href="mailto:hello@getseam.xyz"><span>contact the Seam Team </span></a>for help or to report an issue.**</h4>
          </div>
        </div>
      </div>
      <Divider className="mt-4 mb-4" />
      <h2 >All miniapps</h2>
      <IonList className={`${classes.noScrollBar}`}>
        {supportedBlocks.map((block) => (
          <div id={block[1].type}>
            <ComposerMiniAppItem
              block={block[1]}
              tapAction={() => {
                chooseBlock(block[1]);
              }}
            />
            <Divider />
          </div>
        ))}
        <div style={{ height: "100px" }} />
      </IonList>
    </div>
  );

  const editBlockStep = () => (
    <div
      style={{
        maxHeight: "100%",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: '100%',
      }}
    >
      <div className="px-4" style={{ position: BlockFactory.doesBlockEditFullscreen(state.selectedBlockType?.type) ? "absolute" : "relative", paddingBottom: 16, width: "100%" }}>
        <SeamHeaderBar
          leftComponent={<ChevronLeft color="black" />}
          rightComponent={<X color="black" />}
          centerComponent={ BlockFactory.doesBlockEditFullscreen(state.selectedBlockType?.type) ? null : <h3>{state.selectedBlockType?.displayName}</h3>}
          leftAction={() => {
            dispatch({ type: "handleGoBack" });
          }}
          rightAction={dismiss}
        />
      </div>
      <BlockSelectorModal
        selectedBlockType={state.selectedBlockType.type}
        initialBlockData={state.selectedBlockData?.data ?? {}}
        setSelectedBlockData={(data) => {
          dispatch({ type: "finishBlockEditing", payload: data });
        }}
        style={{ width: "100%" }}
      />
    </div>
  );

  const renderBlockPreview = (blockData) => {
    if (!blockData) return <div>No Block Data</div>;

    return (
      <div
        className="flex flex-row justify-center min-w-full min-h-full"
        ref={blockPreviewRef}
      >
        {BlockFactory.getFeedComponent(blockData)}
        <div className="flex grow"></div>
      </div>
    );
  };

  const previewBlockStep = () => (
    <div className="flex flex-col h-full mx-4 my-0">
      <div className="pb-4 sticky top-0 bg-white z-10">
        <SeamHeaderBar
          leftComponent={<ChevronLeft color="black" />}
          rightComponent={<X color="black" />}
          centerComponent={<h3>{state.selectedBlockType?.displayName}</h3>}
          leftAction={() => {
            dispatch({ type: "handleGoBack" });
          }}
          rightAction={dismiss}
        />
      </div>
      {/* This div is for the content area above the Post button section */}
      <div className="flex-grow overflow-auto">
        {/* Render the block preview only if there is block data */}
        {state.selectedBlockData != {} &&
          renderBlockPreview(state.selectedBlockData)}
      </div>
      {/* This div is for the Post button section to stick to the bottom */}
      <div
        className="p-4 bg-[#FCFCFC] rounded-[20px] border-2 border-b-0 border-seam-gray mb-4 w-full"
        style={{
          marginLeft: "-1rem",
          marginRight: "-1rem",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="flex flex-row w-full">
          {/* Profile Pic and Text Input */}
          <div className="mr-4">
            <img
              className="rounded-full h-8 w-8"
              src={"https://upcdn.io/W142hWW/raw/uploads/2024/02/23/start-4skb.png"}
              alt="Profile"
            />
          </div>
          <div className="w-full">
            <Input
              textValue={state.description}
              onChange={(_, newValue) =>
                dispatch({ type: "setDescription", payload: newValue })
              }
              placeholder="Add a description"
              className="w-full"
            />
          </div>
        </div>
        <Divider className="my-2" />
        <Button
          onClick={handleCreatePost}
          fullWidth
          variant="contained"
          color="primary"
          className="mt-4 h-[60px] justify-center items-center flex rounded-[8px] bg-seam-blue"
        >
          <h3 className="text-seam-white">Post</h3>
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (state.composerStep) {
      case "selectBlock":
        return chooseBlockStep();
      case "editBlock":
        return editBlockStep();
      case "previewPost":
        return previewBlockStep();
      default:
        return null;
    }
  };

  return (
    <div>
      <div
        className="py-2 px-6 cursor-pointer"
        onClick={() => {
          dispatch({ type: "setIsOpen", payload: true });
        }}
        id="open-modal"
        expand="block"
      >
        <Plus color="white" />
      </div>
      <IonModal
        className={`composer-modal h-screen custom-modal-fullscreen`}
        ref={modal}
        isOpen={state.isOpen}
        canDismiss={true}
        showBackdrop={true}
        onDidDismiss={() => {
          dispatch({ type: "dismiss" });
        }}
      >
        <div className={`flex flex-col overflow-y-scroll justify-between h-full ${classes.noScrollBar}`}>
          {renderContent()}
        </div>
      </IonModal>
    </div>
  );
}

export default Composer;