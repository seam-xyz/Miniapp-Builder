import Block from './Block'
import { BlockModel } from './types'
import { Button, Form, Input, message, Space } from "antd";
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import Iframely from './utils/Iframely';

export default class IFrameBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    let url = this.model.data["url"]
    let iframeAllowed = this.model.data["iframeAllowed"] ?? true
    console.log(iframeAllowed)
    if (url === undefined) {
      return this.renderErrorState()
    }

    if (iframeAllowed) {
      return (
        <iframe
          key={url}
          title="Iframe"
          src={url}
          style={{
            height: `100%`,
            width: `100%`
          }}
        />
      );
    } else {
      return (
        // fallback to a link bookmark
        <Iframely
          url={url}
          style={{
            position: "absolute",
            display: "flex",
            height: `100%`,
            width: `100%`
          }} />
      );
    }
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = async (values: any) => {
      let url = values['url']
      url = (url.indexOf('://') === -1) ? 'http://' + url : url;
      // Check to see if the iframe can embed properly. Many web2 walled gardens prevent direct embedding.
      let iframeAllowed;
      try {
        const allowedResponse = await fetch("https://www.seam.so/api/iframe.js?url=" + url)
        const allowedJSON = await allowedResponse.json()
        iframeAllowed = allowedJSON["iframeAllowed"]
      } catch (error) {
        // default to direct iframe embed
        iframeAllowed = true
      }

      this.model.data['url'] = url
      this.model.data['iframeAllowed'] = iframeAllowed
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
      <h1>Broken URL, please try again.</h1>
    )
  }
}