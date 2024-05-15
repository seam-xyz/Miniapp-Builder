import { makeStyles } from "@mui/styles";
import InfiniteScroll from "react-infinite-scroll-component";
import BlockFactory from "./blocks/BlockFactory";
import { createTheme } from "@mui/material/styles";

const useStyles = makeStyles({
  noScrollBar: {
    "&::-webkit-scrollbar": {
      display: "none"
    },
    "-ms-overflow-style": "none",  /* IE and Edge */
    "scrollbar-width": "none",  /* Firefox */
  },
});

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

export default function Feed({ loadedPosts }) {
  const classes = useStyles();

  return (
    <InfiniteScroll
      dataLength={loadedPosts.length}
      hasMore={false}
      height={window.innerHeight - 96}
      className={classes.noScrollBar}
    >
      {loadedPosts.map((post) => (
        <div key={post.id} className="w-full max-w-[720px] h-auto m-auto pt-4 px-4">
          {BlockFactory.getBlock(post, defaultTheme).render()}
        </div>
      ))}
    </InfiniteScroll>
  )
}