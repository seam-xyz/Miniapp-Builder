import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import Iframely from './utils/Iframely';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default class IFrameBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    let url = this.model.data["url"]
    let iframeAllowed = this.model.data["iframeAllowed"] ?? true
    if (url === undefined) {
      return this.renderErrorState()
    }

    if (iframeAllowed) {
      return (
        <iframe
          sandbox="allow-scripts"
          key={url}
          title="Iframe"
          src={url}
          style={{
            height: `100%`,
            width: `100%`
          }}
        />
      );
    } else {
      return (
        // fallback to a link bookmark
        <Iframely
          url={url}
          style={{
            position: "absolute",
            display: "flex",
            height: `100%`,
            width: `100%`
          }} />
      );
    }
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = async (event: any) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      let url = data.get('url') as string
      url = (url.indexOf('://') === -1) ? 'https://' + url : url;
      // Check to see if the iframe can embed properly. Many web2 walled gardens prevent direct embedding.
      let iframeAllowed;
      try {
        const allowedResponse = await fetch("https://www.seam.so/api/iframe.js?url=" + url)
        const allowedJSON = await allowedResponse.json()
        iframeAllowed = allowedJSON["iframeAllowed"]
      } catch (error) {
        // default to direct iframe embed
        iframeAllowed = true
      }

      this.model.data['url'] = url
      this.model.data['iframeAllowed'] = iframeAllowed
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
          fullWidth
          defaultValue={this.model.data['url']}
          id="url"
          label="URL"
          name="url"
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
      <h1>Broken URL, please try again.</h1>
    )
  }
}