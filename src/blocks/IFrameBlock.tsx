import './BlockStyles.css'
import Iframely from './utils/Iframely';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ComposerComponentProps, FeedComponentProps } from './types';

export const IFrameFeedComponent = ({ model }: FeedComponentProps) => {
  let url = model.data["url"];
  let iframeAllowed = model.data["iframeAllowed"] ?? true;

  if (url === undefined) {
    return <h1>Broken URL, please try again.</h1>;
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
      <Iframely
        url={url}
        style={{
          position: "absolute",
          display: "flex",
          height: `100%`,
          width: `100%`
        }} 
      />
    );
  }
}

export const IFrameComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const onFinish = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let url = data.get('url') as string;
    url = (url.indexOf('://') === -1) ? 'https://' + url : url;

    let iframeAllowed;
    try {
      const allowedResponse = await fetch("https://www.seam.so/api/iframe.js?url=" + url);
      const allowedJSON = await allowedResponse.json();
      iframeAllowed = allowedJSON["iframeAllowed"];
    } catch (error) {
      iframeAllowed = true;
    }

    model.data['url'] = url;
    model.data['iframeAllowed'] = iframeAllowed;
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
        fullWidth
        defaultValue={model.data['url']}
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
  );
}