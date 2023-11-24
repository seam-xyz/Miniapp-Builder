import { makeStyles } from "@mui/styles";
import InfiniteScroll from "react-infinite-scroll-component";
import { Card } from "@mui/material";
import { useState, useEffect } from 'react';
import BlockFactory from "./blocks/BlockFactory";
import { createTheme } from "@mui/material/styles";
import Composer from "./Composer";

const useStyles = makeStyles({
  itemBackground: {
    padding: 12,
    backgroundColor: "white",
    flexShrink: 1,
    marginTop: 12,
    overflow: 'hidden',
  },
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

export default function Feed() {
  const POSTS_PER_PAGE = 10;
  const classes = useStyles();

  const [loadedPosts, setLoadedPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  async function loadMore() {
    
  }

  function addNewPost(newPost) {
    setLoadedPosts(prevPosts => [newPost, ...prevPosts]);
  }

  return (
    <InfiniteScroll
      dataLength={loadedPosts.length}
      next={loadMore}
      hasMore={hasMore}
      height={window.innerHeight - 96}
      className={classes.noScrollBar}
    >
      <div style={{ maxHeight: '500px' }}>
        <Composer addNewPost={addNewPost} />
      </div>
      {loadedPosts.map((post) => (
        <div key={post.id}>
          <Card className={classes.itemBackground} style={{ boxShadow: 0 }} elevation={0}>
            {BlockFactory.getBlock(post, defaultTheme).render()}
          </Card>
        </div>
      ))}
    </InfiniteScroll>
  )
}