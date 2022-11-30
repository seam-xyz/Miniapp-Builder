import Block from './Block'
import { BlockModel } from './types'
import { Button, Form, Input } from "antd";
import Iframely from './utils/Iframely';
import BlockFactory from './BlockFactory';
import './BlockStyles.css'

export default class BookmarkBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    let url = this.model.data["url"]
    if (url === undefined) {
      return this.renderErrorState()
    }

    return (
      <Iframely
        url={url}
        style={{
          position: "absolute",
          display: "flex",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          height: `100%`,
          width: `100%`
        }} />
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = (values: any) => {
      console.log('Success:', values);
      let url = values['url']
      this.model.data['url'] = url
      done(this.model)
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };

    return (
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: false,
          url: this.model.data['url']
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="URL"
          name="url"
          rules={[
            {
              required: true,
              message: 'Wait, you didn\'t add a url here',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" className="save-modal-button">
            Save
          </Button>
        </Form.Item>
      </Form>
    )
  }

  renderErrorState() {
    return (
      <h1>Error: Coudn't figure out the url</h1>
    )
  }
}