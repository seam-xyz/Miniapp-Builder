import React, { useState } from 'react';
import { Button, TextField, IconButton, Box, Avatar } from "@mui/material";
import { PlusCircle, MinusCircle } from 'react-feather';
import Block from './Block';
import { BlockModel } from './types';
import './BlockStyles.css';
import BlockFactory from './BlockFactory';
import IconsRow from './utils/IconsRow';
import { IconsSelector } from './utils/IconsRow'
import UploadFormComponent from './utils/UploadFormComponent';

interface EditModalProps {
  model: BlockModel;
  done: (data: BlockModel) => void;
}

interface IconField {
  icon: string;
  url: string;
}

const ProfileEditModal: React.FC<EditModalProps> = ({ model, done }) => {
  const [fields, setFields] = useState<any>(model.data['icons'] ?? []);
  const [title, setTitle] = useState<string>(model.data['title'] ?? '');
  const [bio, setBio] = useState<string>(model.data['bio'] ?? '');
  const [imageURL, setImageURL] = useState<string>(model.data['imageURL'] ?? '');

  const handleAddField = () => {
    setFields([...fields, { icon: '', url: '' }]);
  };

  const handleRemoveField = (index: number) => {
    const newFields = fields.filter((_: any, i: any) => i !== index);
    setFields(newFields);
  };

  const handleFieldChange = (index: number, name: keyof IconField, value: string) => {
    const newFields = [...fields];
    newFields[index][name] = value;
    setFields(newFields);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    model.data['title'] = title;
    model.data['bio'] = bio;
    model.data['icons'] = fields;
    model.data['imageURL'] = imageURL;
    done(model);
  };

  return (
    <Box component="form" className="flex flex-col" onSubmit={handleSubmit}>
      <TextField
        label="Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: '16px' }}
        fullWidth
      />
      <TextField
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        multiline
        rows={4}
        inputProps={{ maxLength: 280 }}
        helperText={`${bio.length}/280`}
        style={{ marginBottom: '16px' }}
        fullWidth
      />
      <Box style={{ marginBottom: '16px' }}>
        <UploadFormComponent onUpdate={files => {
          if (files.length === 0) {
            console.log('No files selected.');
          } else {
            setImageURL(files[0].fileUrl);
          }
        }} />
      </Box>
      {fields.map((field: any, index: any) => (
        <Box key={index} className="flex items-center mb-4">
          <Box flex={1}>
            {IconsSelector({
              value: field.icon,
              onChange: (icon: string) => handleFieldChange(index, 'icon', icon)
            })}
          </Box>
          <TextField
            placeholder="URL"
            value={field.url}
            onChange={(e) => handleFieldChange(index, 'url', e.target.value)}
            style={{ width: "250px", marginLeft: '16px' }}
            required
          />
          <IconButton onClick={() => handleRemoveField(index)}>
            <MinusCircle />
          </IconButton>
        </Box>
      ))}
      <Button variant="outlined" onClick={handleAddField} startIcon={<PlusCircle />}>
        Add Social Icon
      </Button>
      <Button type="submit" variant="contained" color="primary" className="save-modal-button" style={{ marginTop: "16px" }}>
        Save
      </Button>
    </Box>
  );
};

export default class ProfileBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    const title = this.model.data["title"];
    const bio = this.model.data["bio"];
    const imageURL = this.model.data["imageURL"];
    const icons = this.model.data['icons'];

    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}>
        {imageURL && <Avatar src={imageURL} style={{ maxWidth: "160px", maxHeight: "160px", width: "160px", height: "160px", marginTop: "10px", borderRadius: '50%' }}/>}
        <h2 style={{ textAlign: "center", marginTop: "16px" }}> {title} </h2>
        <h4 style={{ textAlign: "center", marginBottom: "16px" }}> {bio} </h4>
        <IconsRow icons={icons} color={"black"}/>
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return <ProfileEditModal model={this.model} done={done} />;
  }

  renderErrorState() {
    return (
      <h1>Error: Couldn't render the profile header.</h1>
    )
  }
}