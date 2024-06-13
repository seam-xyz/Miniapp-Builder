import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'

export default class CalligraphyBlock extends Block {
  render() {
    return (
      <h1>Calligraphy Block!</h1>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <h1>Edit Calligraphy Block!</h1>
    )
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}