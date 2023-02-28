import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import './BlockStyles.css'

export default class feelingsBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    let feeling = this.model.data["feeling"]
    if (feeling === undefined) {
      return this.renderErrorState()
    }

    return (
      <Box
      style={{
        backgroundColor: this.theme.palette.info.main,
        color: this.theme.palette.secondary.main,
        whiteSpace: "normal",
        height: '100%',
        width: '100%',
        fontFamily: this.theme.typography.fontFamily,
        textTransform: "none"
      }}>
        <h3> today i'm feeling {feeling} </h3>
        </Box>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = (event: any) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      let feeling = data.get('feeling') as string
      this.model.data['feeling'] = feeling
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
      <h1>how are you feeling right now?</h1>
      <TextField
        margin="normal"
        required
        defaultValue={this.model.data['feeling']}
        fullWidth
        id="feeling"
        label="Feeling"
        name="feeling"
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
      <h2>Error! This user is feeling nothing right now :(</h2>
    )
  }
}