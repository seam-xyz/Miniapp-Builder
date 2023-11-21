import Block from './Block'
import { BlockModel } from './types'
import Iframely from './utils/Iframely';
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TitleComponent from './utils/TitleComponent';

export default class BookmarkBlock extends Block {
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
      <div style={{ backgroundColor: this.theme.palette.secondary.main }}>
        {title && TitleComponent(this.theme, title)}
        <Iframely
          url={url}
          style={{
            display: "flex",
            height: `100%`,
            width: `100%`
          }} />
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = (event: any) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      let url = data.get('url') as string
      let title = data.get('header') as string
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
          fullWidth
          id="url"
          label="URL"
          name="url"
          defaultValue={this.model.data['url']}
          autoFocus
        />
        <TextField
          margin="normal"
          fullWidth
          id="header"
          label="Header Title"
          name="header"
          defaultValue={this.model.data['title']}
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