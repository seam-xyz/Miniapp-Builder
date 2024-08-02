import { TwitterTweetEmbed } from 'react-twitter-embed';
import { ComposerComponentProps, FeedComponentProps } from './types'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export const TweetFeedComponent = ({ model }: FeedComponentProps) => {
  let tweetId = model.data["tweetId"];
  if (tweetId === undefined) {
    return <h1>Error: Couldn't figure out the url</h1>;
  }

  return (
    <TwitterTweetEmbed
      tweetId={tweetId}
    />
  );
}

export const TweetComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const onFinish = (event: any) => {
    const data = new FormData(event.currentTarget);
    model.data['tweetId'] = data.get('tweetId') as string;
    done(model);
  };

  return (
    <Box
      component="form"
      onSubmit={onFinish}
      style={{}}
    >
      <TextField
        margin="normal"
        required
        defaultValue={model.data['tweetId']}
        fullWidth
        id="tweetId"
        label="Tweet Id"
        name="tweetId"
        autoFocus
      />
      <Button
        type="submit"
        variant="contained"
        className="save-modal-button"
        sx={{ mt: 3, mb: 2 }}
      >
        Save
      </Button>
    </Box>
  );
}