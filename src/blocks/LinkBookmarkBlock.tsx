import { ComposerComponentProps, FeedComponentProps } from './types'
import './BlockStyles.css'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Iframely from './utils/Iframely';

export const LinkBookmarkFeedComponent = ({ model }: FeedComponentProps) => {
  let url = model.data["url"];
  if (url === undefined) {
    return renderErrorState();
  }

  return (
    <Box style={{ height: '100%', width: '100%' }}>
      <Iframely url={url} style={{ height: '100%', width: '100%' }} />
    </Box>
  );
}

export const LinkBookmarkComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const onFinish = (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    let url = data.get('url') as string;
    model.data['url'] = url;
    done(model);
  };

  return (
    <Box
      component="form"
      onSubmit={onFinish}
      className="space-y-2"
      style={{ paddingBottom: `calc(env(safe-area-inset-bottom, 24px) + 24px)` }} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 3, bgcolor: 'background.paper', boxShadow: 3, zIndex: 1301 }}
    >
      <TextField
        required
        fullWidth
        id="url"
        label={"Link URL"}
        name="url"
        defaultValue={model.data['url']}
      />
      <div className="flex justify-between items-center w-full h-[60px]">
        <Button
          type="submit"
          variant="contained"
          className="save-modal-button w-full h-[60px]"
        >
          PREVIEW
        </Button>
      </div>
    </Box>
  );
}

const renderErrorState = () => {
  return (
    <h1>Error: Couldn't figure out the url</h1>
  );
}