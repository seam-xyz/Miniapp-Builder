import { TwitterTweetEmbed } from 'react-twitter-embed';
import Block from './Block'
import { BlockModel } from './types'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import BlockFactory from './BlockFactory';
import './BlockStyles.css'

export default class TweetBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    let tweetId = this.model.data["tweetId"]
    if (tweetId === undefined) {
      return this.renderErrorState()
    }

    return (
      <TwitterTweetEmbed
        tweetId={tweetId}
      />
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = (event: any) => {
      const data = new FormData(event.currentTarget);
      this.model.data['tweetId'] = data.get('tweetId') as string
      done(this.model)
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
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
          defaultValue={this.model.data['tweetId']}
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
    )
  }

  renderErrorState() {
    return (
      <h1>Error: Coudn't figure out the url</h1>
    )
  }
}