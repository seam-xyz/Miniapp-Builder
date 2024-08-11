import { TwitterTimelineEmbed } from 'react-twitter-embed';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import { ComposerComponentProps, FeedComponentProps } from './types';

export const TwitterFeedComponent = ({ model }: FeedComponentProps) => {
  let name = model.data["name"];
  if (name === undefined) {
    return <h1>Error: Couldn't figure out the url</h1>;
  }

  return (
    <TwitterTimelineEmbed
      sourceType="profile"
      screenName={name}
      options={{
        height: "1200",
      }}
      noScrollbar={true}
      noBorders={true}
    />
  );
}

export const TwitterComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const onFinish = (event: any) => {
    const data = new FormData(event.currentTarget);
    var name = data.get("name") as string;

    // data sanitization to help with proper inputs
    var name1 = name.replace(/@/g, "");

    // remove the twitter url if someone accidentally pasted it in
    const regex = /(http(s)?(:))?(\/\/)?(\/\/)?(www\.)?twitter.com\//g;
    var name2 = name1.replace(regex, "");

    model.data = { "name": name2 };
    done(model);
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
        defaultValue={model.data['name']}
        fullWidth
        id="name"
        label="Twitter Handle"
        name="name"
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
  );
}