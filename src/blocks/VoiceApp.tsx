import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'

export default class VoiceBlock extends Block {
  render() {
    return (
      <h1>Voice Block!</h1>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <h1>Edit Voice Block!</h1>
    )
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}