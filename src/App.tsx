import { makeStyles, ThemeProvider } from "@mui/styles";

import { BlockModel } from "./blocks/types";
import "./styles.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flexGrow: 1,
  },
}));

export default function App() {
  const classes = useStyles();

  // Add your custom block here!
  // vvvvvvvvvvvvvvvvv

  let yourBlock: BlockModel = {
    type: "Marquee",
    data: {},
    uuid: "test"
  }

  // End customization
  // ^^^^^^^^^^^^^^^^^

  return (
    <div className={classes.root}>
      <h1> Seam Miniapp Builder </h1>
    </div>
  );
}