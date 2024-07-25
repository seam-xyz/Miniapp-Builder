import { ComposerComponentProps, FeedComponentProps } from './types'
import './BlockStyles.css'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

type MarqueeProps = React.HTMLAttributes<HTMLElement>

function TypescriptMarquee(props: MarqueeProps) {
  // @ts-ignore
  return <marquee scrollamount="15" direction="left" {...props} />
}

export const MarqueeFeedComponent = ({ model }: FeedComponentProps) => {

  let text = model.data['text'];
  if (text === undefined) {
    return renderErrorState();
  }

  return (
    <div style={{
      backgroundColor: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "100%",
      width: "100%"
    }}>
      <TypescriptMarquee style={{
        color: "black",
        fontFamily: "Public Sans",
        fontSize: "64px",
      }}>
        {text}
      </TypescriptMarquee>
    </div>
  );
}

export const MarqueeComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const onFinish = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let text = data.get('text') as string;
    model.data['text'] = text;
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
        defaultValue={model.data['text']}
        fullWidth
        id="text"
        label="Text"
        name="text"
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

const renderErrorState = () => {
  return (
    <h1>Error!</h1>
  );
}