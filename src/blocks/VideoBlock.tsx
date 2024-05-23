import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TitleComponent from './utils/TitleComponent';
import FileUploadComponent from './utils/FileUploadComponent';
import ReactPlayer from 'react-player/lazy'
import SeamSaveButton from '../components/SeamSaveButton';

export default class VideoBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    const url = this.model.data["url"];
    const title = this.model.data["title"];
    if (!url) {
      return this.renderErrorState();
    }

    return (
      <div style={{ backgroundColor: this.theme.palette.secondary.main, width: "100%" }}>
        {title && TitleComponent(this.theme, title)}
        <div className="flex grow relative w-full h-full min-h-[300px]" style={{ position: 'relative', width: "100%", height: "100%" }}>
          <ReactPlayer
            controls={true}
            url={url}
            style={{minHeight: '300px', width: '100%', height: 'auto', flexGrow: 1, }}
          />
        </div>
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = (event: any) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const url = data.get('url') as string;
      const title = data.get('header') as string;

      this.model.data['url'] = url;
      this.model.data['title'] = title;
      done(this.model);
    };

    const uploaderComponent = <FileUploadComponent
      fileTypes="video/*"
      label="Upload a Video"
      onUpdate={(urls) => {
        // since only one video is allowed, we take the first URL from the file uploader
        if (urls.length > 0) {
          this.model.data['url'] = urls[0];
          done(this.model);
        }
      }}
      multiple={false}
      maxFiles={1}
    />;

    return (
      <>
        {uploaderComponent}
        <Typography style={{ textAlign: "center", width: "100%", paddingTop: "18px" }}>Or</Typography>
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
            label="Video URL (YouTube, TikTok, Instagram, etc.)"
            name="url"
            defaultValue={this.model.data['url']}
          />
          <SeamSaveButton onClick={onFinish} />
        </Box>
      </>
    );
  }

  renderErrorState() {
    return (
      <h1>Error: Couldn't figure out the URL</h1>
    );
  }
}
