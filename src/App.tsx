import { useState } from "react";
import Composer from "./Composer/Composer";
import { IonHeader, IonContent, IonPage } from "@ionic/react";
import Feed from "./Feed";
import { BlockModel } from "./blocks/types";
import { makeStyles } from "@mui/styles";
import { QuestionMarkOutlined } from "@mui/icons-material";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import DesktopSidebarWrapper from "./DesktopSidebarWrapper";

const useStyles = makeStyles((theme) => ({
  headerBorder: {
    position: 'relative',
    width: '100%',
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: '2px solid #101010',
      opacity: '5%',
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
    }
  },
  noScrollBar: {
    "&::-webkit-scrollbar": {
      display: "none"
    },
    "-ms-overflow-style": "none",  /* IE and Edge */
    "scrollbar-width": "none",  /* Firefox */
  },
}));

export default function App() {
  const classes = useStyles();
  const [loadedPosts, setLoadedPosts] = useState<BlockModel[]>([
    {
      type: 'FlashingText',
      data: {
        text: 'Welcome to the Seam Miniapp Builder!',
      },
      uuid: '1',
    }
  ]);

  function addNewPost(newPost: BlockModel) {
    setLoadedPosts((prevPosts: BlockModel[]) => [newPost, ...prevPosts]);
  }

  return (
    <IonPage className={classes.noScrollBar}>
      <div className={classes.headerBorder}>
        <IonHeader class="ion-no-border border-b-[2px] border-seam-black/[5%]">
          <div className="flex items-center justify-between bg-white px-4 py-4" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
            <div className="p-2 rounded-full bg-seam-gray cursor-pointer hover:bg-seam-gray/50" onClick={() => {window.open("http://docs.getseam.xyz")}}>
              <QuestionMarkOutlined />
            </div>
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', maxWidth: '60%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <h1 style={{ fontSize: 'calc(10px + 2vmin)' }}> Seam Miniapp Builder </h1>
            </div>
            <div className={`flex max-w-justify-end items-center text-white rounded-full bg-[#ea3bf7] ${classes.noScrollBar}`} style={{ marginLeft: '16px' }}>
              <Composer addNewPost={addNewPost} />
            </div>
          </div>
        </IonHeader>
      </div>
      <IonContent fullscreen={true} scrollY={false}>
        <DesktopSidebarWrapper>
          <Feed loadedPosts={loadedPosts} />
        </DesktopSidebarWrapper>
      </IonContent>
    </IonPage>
  );
}