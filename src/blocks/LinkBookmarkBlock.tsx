import Block from './Block'
import { BlockModel } from './types'
import Iframely from './utils/Iframely';
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default class LinkBookmarkBlock extends Block {
  props: any;
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    let url = this.model.data["url"]
    if (url === undefined) {
      return this.renderErrorState()
    }

    return (
      <div style={{ backgroundColor: this.theme.palette.secondary.main, width: "100%", height: "100%" }}>
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
      this.model.data['url'] = url
      done(this.model)
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
          label={"Link URL"}
          name="url"
          defaultValue={this.model.data['url']}
          autoFocus
        />
        <Button
          type="submit"
          variant="contained"
          className="save-modal-button"
          sx={{ mt: 3, mb: 2 }}
        >
          PREVIEW
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