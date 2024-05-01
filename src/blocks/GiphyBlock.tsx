import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import GifViewer from './utils/GifViewer';
// @ts-ignore
import ReactGiphySearchbox from 'react-giphy-searchbox'

export default class GiphyBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    let gifID = this.model.data["gif"]

    return (
      <GifViewer id={gifID} />
    )
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <ReactGiphySearchbox
        apiKey={process.env.REACT_APP_GIPHY_KEY}
        onSelect={(item: any) => {
          this.model.data["gif"] = item.id as string
          done(this.model)
        }}
        gifListHeight='75vh'
        masonryConfig={[
          { columns: 2, imageWidth: 170, gutter: 10 },
          { mq: "700px", columns: 3, imageWidth: 150, gutter: 10 }
        ]}
      />
    )
  }
}
