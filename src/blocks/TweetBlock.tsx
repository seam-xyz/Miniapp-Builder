import { TwitterTweetEmbed } from 'react-twitter-embed';
import Block from './Block'
import { BlockModel } from './types'
import { Button, Form, Input } from "antd";
import BlockFactory from './BlockFactory';
import './BlockStyles.css'

export default class TweetBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    let tweetId = this.model.data["tweetId"]
    if (tweetId === undefined) {
      return this.renderErrorState()
    }

    return (
      <TwitterTweetEmbed
        tweetId={tweetId}
      />
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = (values: any) => {
      console.log('Success:', values);
      this.model.data = values
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
          url: this.model.data['tweetId']
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Tweet Id"
          name="tweetId"
          rules={[
            {
              required: true,
              message: 'Wait, you didn\'t add an ID here',
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