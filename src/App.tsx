import { makeStyles, createTheme, ThemeProvider } from "@material-ui/core/styles";

import Content from "./Content";
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

const defaultTheme = createTheme({
  palette: {
    primary: {        // Card Background
      main: "#020303"
    },
    secondary: {
      main: "#1C1C1C"  // Block Background
    },
    info: {
      main: "#CCFE07"  // Accent Color
    }
  },
  typography: {
    fontFamily: "monospace"
  }
});

export default function App() {
  const classes = useStyles();

  // Add your custom block here!
  // vvvvvvvvvvvvvvvvv

  let yourBlock: BlockModel = {
    type: "link",
    data: {},
    uuid: "test"
  }

  // End customization
  // ^^^^^^^^^^^^^^^^^

  return (
    <ThemeProvider theme={defaultTheme}>
      <div className={classes.root}>
        <h1> Seam Block SDK </h1>
        <Content loadedBlocks={[yourBlock]} />
      </div>
    </ThemeProvider>
  );
}