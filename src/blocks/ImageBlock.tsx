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
    if (!url || !this.isValidImageUrl(url)) {
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
        onError={(e) => e.currentTarget.src = 'https://www.shutterstock.com/image-illustration/no-picture-available-placeholder-thumbnail-600nw-2179364083.jpg'}
      />
    );
  }

  addHTTPS(url: string) {
    return (url.indexOf('://') === -1) ? 'http://' + url : url
  }

  isValidImageUrl(url: string) {
    const isUploadedUrl = url.startsWith("https://upcdn.io/") || url.startsWith("http://upcdn.io/");
    return isUploadedUrl || /\.(jpg|jpeg|png|gif)$/.test(url);
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = (event: any) => {
      event.preventDefault();

      const data = new FormData(event.currentTarget);
      let url = data.get('url') as string;

      if (!url && this.model.data['url']) {
        // Assuming that a valid URL is already present (possibly from an uploaded file)
        url = this.model.data['url'];
      } else if (url) {
        // Add 'http://' if necessary
        url = this.addHTTPS(url);

        // Check if the URL is valid
        if (!this.isValidImageUrl(url)) {
          alert('Please provide a valid image URL.');
          return;
        }
      } else {
        alert('Please enter a valid URL or upload a file before continuing.');
        return;
      }

      // Update the model with the new URL
      this.model.data['url'] = url;
      done(this.model);
    };

    const uploaderComponent = <UploadFormComponent onUpdate={files => {
      if (files.length === 0) {
        console.log('No files selected.');
        this.model.data['url'] = "";
      } else {
        // Directly use the URL from the uploaded file
        this.model.data['url'] = files[0].fileUrl;
      }
    }} />;

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
          Preview
        </Button>
      </Box>
    )
  }

  renderErrorState() {
    return (
      <img
        src="https://www.shutterstock.com/image-illustration/no-picture-available-placeholder-thumbnail-600nw-2179364083.jpg"
        title="Image"
        style={{ height: '100%', width: '100%', }}
      />
    )
  }
}