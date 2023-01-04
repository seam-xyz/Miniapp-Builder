import Block from './Block'
import { BlockModel } from './types'
import './BlockStyles.css'
import BlockFactory from './BlockFactory';
import IconsRow, { IconsSelector } from './utils/IconsRow';
import UploadFormComponent from './utils/UploadFormComponent';
import Avatar from '@material-ui/core/Avatar';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React, { useState } from 'react';
import { FormControl, InputLabel, makeStyles, Theme, createStyles } from '@material-ui/core';

export default class ProfileBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    let title = this.model.data["title"]
    let bio = this.model.data["bio"]
    let imageURL = this.model.data["imageURL"]
    let icons = this.model.data['icons']

    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}>
        {imageURL && <Avatar src={imageURL} style={{ width: "160px", height: "160px", marginTop: "10px" }}></Avatar>}
        <h2 style={{ textAlign: "center", marginTop: "16px" }}> {title} </h2>
        <h4 style={{ textAlign: "center", marginBottom: "16px" }}> {bio} </h4>
        <IconsRow icons={icons} />
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = (event: any) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log('Success:', event.currentTarget);
      this.model.data['bio'] = data.get('bio') as string
      this.model.data['title'] = data.get('title') as string
      this.model.data['icons'] = data.get('icons') as string
      //done(this.model)
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };

    const uploaderComponent = <UploadFormComponent onUpdate={files => {
      if (files.length === 0) {
        console.log('No files selected.')
      } else {
        this.model.data["imageURL"] = files[0].fileUrl
      }
    }} />

    let iconList = this.model.data['icons']
    return (
      <Box
        component="form"
        onSubmit={onFinish}
        style={{}}
      >
        <TextField
          margin="normal"
          required
          defaultValue={this.model.data['title']}
          fullWidth
          id="title"
          label="Title"
          name="title"
        />
        <TextField
          margin="normal"
          required
          defaultValue={this.model.data['bio']}
          fullWidth
          id="bio"
          label="Bio"
          name="bio"
          multiline
          maxRows={2}
        />
        {uploaderComponent}
        <Form />
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

    // return (
    //   <Form
    //     name="basic"
    //     initialValues={{
    //       remember: true,
    //       bio: this.model.data['bio'],
    //       title: this.model.data['title'],
    //       icons: this.model.data['icons']
    //     }}
    //     labelCol={{
    //       span: 8,
    //     }}
    //     onFinish={onFinish}
    //     onFinishFailed={onFinishFailed}
    //     autoComplete="off"
    //   >
    //     <Form.Item
    //       label="Name"
    //       name="title"
    //       rules={[
    //         {
    //           required: false,
    //         },
    //       ]}
    //     >
    //       <Input />
    //     </Form.Item>
    //     <Form.Item
    //       label="Bio"
    //       name="bio"
    //     >
    //       <TextArea showCount maxLength={280} />
    //     </Form.Item>
    //     <Form.Item label="Profile Photo">
    //       {uploaderComponent}
    //     </Form.Item>
    //     <Form.List name="icons">
    //       {(fields, { add, remove }) => (
    //         <>
    //           {fields.map(({ key, name, ...restField }) => (
    //             <Space key={key} style={{ marginBottom: 8 }} align="baseline">
    //               <Form.Item
    //                 {...restField}
    //                 name={[name, 'icon']}
    //                 rules={[{ required: true, message: 'Missing icon' }]}
    //               >
    //                 {IconsSelector()}
    //               </Form.Item>
    //               <Form.Item
    //                 {...restField}
    //                 name={[name, 'url']}
    //                 rules={[{ required: true, message: 'Missing icon url' }]}
    //               >
    //                 <Input placeholder="URL" />
    //               </Form.Item>
    //               <MinusCircleOutlined onClick={() => remove(name)} />
    //             </Space>
    //           ))}
    //           <Form.Item>
    //             <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
    //               Add Social Icon
    //             </Button>
    //           </Form.Item>
    //         </>
    //       )}
    //     </Form.List>
    //     <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
    //       <Button type="primary" htmlType="submit" className="save-modal-button">
    //         Save
    //       </Button>
    //     </Form.Item>
    //   </Form>
    // )
  }

  renderErrorState() {
    return (
      <h1>Error: Couldn't render the profile header.</h1>
    )
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    button: {
      margin: theme.spacing(1),
    },
  }),
);

const Form: React.FC = () => {
  const [formFields, setFormFields] = useState([
    { name: '', age: '' },
  ])

  const handleFormChange = (event: any, index: number) => {
    let data: any = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  }

  const addFields = () => {
    let object = {
      name: '',
      age: ''
    }

    setFormFields([...formFields, object])
  }

  const removeFields = (index: number) => {
    let data = [...formFields];
    data.splice(index, 1)
    setFormFields(data)
  }

  return (
    <div>
      {formFields.map((form, index) => {
        return (
          <div key={index}>
            <IconsSelector />
            <input
              name='age'
              placeholder='Age'
              onChange={event => handleFormChange(event, index)}
              value={form.age}
            />
            <button onClick={() => removeFields(index)}>Remove</button>
          </div>
        )
      })}
      <button onClick={addFields}>Add More..</button>
    </div>
  );
};