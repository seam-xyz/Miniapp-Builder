import { makeStyles } from "@material-ui/core/styles";

import Content from "./Content";
import { BlockModel } from "./blocks/types";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
    width: "100%"
  },
  content: {
    flexGrow: 1,
    height: "100%"
  },
}));

export default function App() {
  const classes = useStyles();

  // Add your custom block here!
  // vvvvvvvvvvvvvvvvv

  let yourBlock: BlockModel = {
    type: "iframe", // rename to whatever you want your block name to be
    data: {},
    uuid: "test"
  }

  // End customization
  // ^^^^^^^^^^^^^^^^^

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <Content loadedBlocks={[yourBlock]} />
      </main>
    </div>
  );
}