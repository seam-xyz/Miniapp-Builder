import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import { useState } from 'react';
import Button from '@mui/material/Button';

type FakeFormProps = {
  onSave: (name: string) => void;
}

const FakeForm = ({onSave}: FakeFormProps) => {
  const [name, setName] = useState<string>()
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (name) {
     onSave(name)
     
    }
  }
  return (
    <div>
    <form onSubmit={handleSubmit}>
      <input style={{border: "1px solid"}} type="text" value={name} onChange={(e) => setName(e.target.value)}  />
      <button type='submit'>POST</button>
    </form>
    </div>
  )
  
}

export default class VoiceBlock extends Block {
  render() {
    return (
      <div>
        <div>{this.model.data['']}</div>
        <div></div>
        <div></div>
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const handleSave = (name: string) => {
      this.model.data["name"] = name
      done(this.model)
    }
   return <FakeForm onSave={handleSave}/>
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}