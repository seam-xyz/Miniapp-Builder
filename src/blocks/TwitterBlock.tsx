import { TwitterTimelineEmbed } from 'react-twitter-embed';
import Block from './Block'
import { BlockModel } from './types'
import { Button, Form, Input } from "antd";
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
    const onFinish = (values: any) => {
      var name = values["name"]

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
          name: this.model.data['name']
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Twitter Handle"
          name="name"
          rules={[
            {
              required: true,
              message: 'Wait, you didn\'t add a twitter handle here',
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