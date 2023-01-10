import { TwitterTimelineEmbed } from 'react-twitter-embed';
import Block from './Block'
import { BlockModel } from './types'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import BlockFactory from './BlockFactory';
import './BlockStyles.css'

export default class TwitterBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    let name = this.model.data["name"]
    if (name === undefined) {
      return this.renderErrorState()
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

  getValidTwitterName(name: string) {
    return true
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = (event: any) => {
      const data = new FormData(event.currentTarget);
      var name = data.get("name") as string

      // data sanitization to help with proper inputs
      var name1 = name.replace(/@/g, "")

      // remove the twitter url if someone accidentally pasted it in
      const regex = /(http(s)?(:))?(\/\/)?(\/\/)?(www\.)?twitter.com\//g;
      var name2 = name1.replace(regex, "")

      this.model.data = { "name": name2 }
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
          defaultValue={this.model.data['name']}
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
    )
  }

  renderErrorState() {
    return (
      <h1>Error: Coudn't figure out the url</h1>
    )
  }
}