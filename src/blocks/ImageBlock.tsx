import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import UploadFormComponent from './utils/UploadFormComponent';
import Button from "@mui/material/Button";

export default class ImageBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    let url = this.model.data["url"]
    if (url === undefined) {
      return this.renderErrorState()
    }

    return (
      <img
        src={url}
        title="image"
        style={{
          height: `100%`,
          width: `100%`
        }}
      />
    );
  }

  addHTTPS(url: string) {
    return (url.indexOf('://') === -1) ? 'http://' + url : url
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = (event: any) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      let url = data.get('url') as string
      const hasInternetURL = url != ""
      url = hasInternetURL ? this.addHTTPS(url) : this.model.data['url']
      this.model.data['url'] = url
      done(this.model)
    };

    const uploaderComponent = <UploadFormComponent onUpdate={files => {
      if (files.length === 0) {
        console.log('No files selected.')
      } else {
        console.log(files)
        this.model.data['url'] = files[0].fileUrl
      }
    }} />

    return (
      <Box
        component="form"
        onSubmit={onFinish}
        style={{}}
      >
          {uploaderComponent}
          <TextField
          margin="normal"
          defaultValue={this.model.data['url']}
          fullWidth
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
      <h1>Error: Coudn't figure out the url</h1>
    )
  }
}