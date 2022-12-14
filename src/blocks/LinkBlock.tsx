import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default class LinkBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    let url = this.model.data["url"]
    let title = this.model.data["title"]
    if (url === undefined) {
      return this.renderErrorState()
    }

    return (
      <a href={url} target="_blank" style={{textDecoration: "none"}}>
        <Button
          variant="contained"
          style={{
            backgroundColor: `#0051E8`,
            color: 'white',
            height: '100%',
            width: '100%',
            fontFamily: "Public Sans",
            textTransform: "none"
          }}>
          {title}
        </Button>
      </a>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = (event: any) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      let url = data.get('url') as string
      let title = data.get('title') as string
      url = (url.indexOf('://') === -1) ? 'http://' + url : url;
      this.model.data['url'] = url
      this.model.data['title'] = title
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
          defaultValue={this.model.data['title']}
          fullWidth
          id="title"
          label="Title"
          name="title"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          defaultValue={this.model.data['url']}
          fullWidth
          id="url"
          label="URL"
          name="url"
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