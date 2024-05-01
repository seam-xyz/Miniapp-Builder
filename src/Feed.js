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
        <div
          key={post?.id}
          className="flex flex-col items-start p-2 rounded-[20px] border border-gray-200 bg-[#FCFCFC] shadow-none"
        >
          <div className="w-full h-full max-w-full overflow-clip">
            {BlockFactory.getBlock(post, defaultTheme).render()}
          </div>
        </div>
      ))}
    </InfiniteScroll>
  )
}