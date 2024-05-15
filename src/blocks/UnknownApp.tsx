import Block from './Block'
import { BlockModel } from './types'
import './BlockStyles.css'

export default class UnknownBlock extends Block {
  render() {
    return (
      <h1>Unknown Miniapp! Update your app or come back later.</h1>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <h1>Edit Unknown Block!</h1>
    )
  }
}