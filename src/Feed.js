import { makeStyles } from "@mui/styles";
import InfiniteScroll from "react-infinite-scroll-component";
import BlockFactory from "./blocks/BlockFactory";
import { createTheme } from "@mui/material/styles";
import SeamPillButton from "./components/SeamPillButton";
import { Heart, MessageSquare } from "react-feather";
import SeamUserItem from "./components/SeamUserItem";

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

function FeedItem({ post }) {
  return (
    <div className="flex flex-col items-start p-2 rounded-[20px] border border-gray-200 bg-[#FCFCFC] shadow-none">
      <SeamUserItem subtitle={BlockFactory.getPrintableBlockName(post) + " Miniapp"}/>
      <div className="w-full h-full max-w-full overflow-clip mt-2">
        {BlockFactory.getBlock(post, defaultTheme).render()}
      </div>
      <div className="w-full mt-2">
        <div className="flex items-center">
          {/* Comment button on the left */}
          <SeamPillButton
            icon={<MessageSquare size={16} className="text-gray-600" />}
            label={"Comments"}
            onClick={() => {}}
          />
          <div className="flex-grow"></div>
          <div className="flex gap-2">
            <SeamPillButton
              icon={<Heart size={16} className="text-gray-600" />}
              label={12}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

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
          <FeedItem post={post} />
        </div>
      ))}
    </InfiniteScroll>
  )
}