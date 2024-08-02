import { ComposerComponentProps, FeedComponentProps } from './types'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export const LinkFeedComponent = ({ model }: FeedComponentProps) => {
  const navigateToUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank');
    } else {
      console.error('Invalid URL');
    }
  };

  let url = model.data["url"];
  let title = model.data["title"];
  if (url === undefined) {
    return <h1>Error: Couldn't figure out the url</h1>;
  }

  return (
    <Button
      variant="contained"
      onClick={() => navigateToUrl(url)}
      style={{
        backgroundColor: "white",
        color: "black",
        whiteSpace: "normal",
        height: '100%',
        width: '100%',
        fontFamily: "Public Sans",
        textTransform: "none"
      }}
    >
      {title}
    </Button>
  );
}

export const LinkComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const onFinish = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let url = data.get('url') as string;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
    let title = data.get('title') as string;
    url = (url.indexOf('://') === -1) ? 'http://' + url : url;
    model.data['url'] = url;
    model.data['title'] = title;
    done(model);
  };

  return (
    <Box
      component="form"
      onSubmit={onFinish}
    >
      <TextField
        margin="normal"
        required
        defaultValue={model.data['url']}
        fullWidth
        id="url"
        label="URL"
        name="url"
      />
      <TextField
        margin="normal"
        required
        defaultValue={model.data['title']}
        fullWidth
        id="title"
        label="Link Button Title"
        name="title"
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