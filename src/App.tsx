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
    <IonPage className="w-full h-full">
      <div className={classes.headerBorder}>
        <IonHeader class="ion-no-border border-b-[2px] border-seam-black/[5%]">
          <div className="flex items-center justify-between bg-white px-4 py-4" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
            <QuestionMarkOutlined />
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              <h1> Seam Miniapp Builder </h1>
            </div>
            <div className={`flex max-w-justify-end items-center text-white rounded-full bg-[#ea3bf7]`} style={{ marginLeft: '16px' }}>
              <Composer addNewPost={addNewPost} />
            </div>
          </div>
        </IonHeader>
      </div>
      <IonContent>
        <div className="flex flex-row justify-between w-full h-full">
          <div className="w-[158px] bg-white flex-none border-r-2 border-seam-black/[5%]"></div>
          <div className="flex justify-center items-center w-full h-full">
            <div className="flex flex-row justify-center w-full h-full">
              <div className="w-full max-w-[1124px] justify-center items-center">
                <Feed loadedPosts={loadedPosts} />
              </div>
            </div>
          </div>
          <div className="w-[158px] bg-white flex-none border-l-2 border-seam-black/[5%]"></div>
        </div>
      </IonContent>
    </IonPage>
  );
}