import { useRef, useState } from 'react'
import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types'
import SeamSaveButton from '../components/SeamSaveButton';
import { Preview } from '@mui/icons-material';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { Button } from '@mui/material';



const EmojiTile = (props: {Emoji: string, DisplayEmoji?: boolean}) => {

  return(
    <div className='w-16 h-16 max-[600px]:w-8 max-[600px]:h-8 flex justify-center items-center'>
      <span 
      className='w-full text-6xl max-[600px]:text-3xl text-center m-auto' 
      style={{
        display: props.DisplayEmoji ? "inline" : "none",

      }}
      >
        {props.Emoji}
      </span>
      <div 
      className='w-1/2 h-1/2 bg-slate-300 rounded-full'
      style={{
        display: props.DisplayEmoji ? "none" : "inline",

      }}
      >
      </div>

    </div>
  )

}

const EmojiRating = (props: {Emoji: string, StarRating: number}) => {

  return (
    <div className='flex flex-row justify-start gap-2 max-[600px]:gap-0.5'>
      <EmojiTile Emoji={props.Emoji} DisplayEmoji={true}/>
      <EmojiTile Emoji={props.Emoji} DisplayEmoji={props.StarRating > 1 ? true : false}/>
      <EmojiTile Emoji={props.Emoji} DisplayEmoji={props.StarRating > 2 ? true : false}/>
      <EmojiTile Emoji={props.Emoji} DisplayEmoji={props.StarRating > 3 ? true : false}/>
      <EmojiTile Emoji={props.Emoji} DisplayEmoji={props.StarRating > 4 ? true : false}/>
    </div>
  )
}

const EmojiRatingForm = (props: {onSubmit: (data: any) => void}) => {
  
  const [currentEmoji, setCurrentEmoji] = useState('🍕');
  const [rating, setRating] = useState(5);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const ratingRef = useRef(null);

  const maxCharacters = { // form character limits for each input
    item: 70,
    unit: 50,
    description: 300,
  }

  const [textBoxLength, setTextBoxLength] = useState({ // current character count of each form input field
    item: 0,
    unit: 0,
    description: 0
  })

  const inputTailwindClasses = 'h-fit w-full border-solid border-2 border-slate-400 rounded-md px-3 py-2 mt-2'
  const characterCountTailwidnClasses = ' float-right text-sm text-right text-slate-400 my-1 mr-1 '

  const handleTextChange = (e:any) => { // for character count
    const { name, value } = e.target;

    setTextBoxLength({
      ...textBoxLength,
      [name]: value.length,
    })
  }

  const handleRatingBlur = (e:React.FocusEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    
    if (value > 5) {
      setRating(5)
    } else if (value < 1) {
      setRating(1)
    }
  }

  const submitForm = (e: any) => {
    e.preventDefault()

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData)
    payload.emoji = currentEmoji
    console.log(payload)
    props.onSubmit(payload)
  }

  return(
    <form 
    className='flex flex-col gap-5'
    onSubmit={submitForm}
    >
      <label
      className='text-base text-slate-600'
      > Name:
        <input 
        type="text" 
        name='item'
        maxLength={maxCharacters.item} 
        onChange={handleTextChange}
        placeholder='e.g. Kiwi Fruit'
        className={inputTailwindClasses}
        />
        <span
        className={characterCountTailwidnClasses}
        >
          {textBoxLength.item}/{maxCharacters.item} characters
        </span>
      </label>

      <label 
      className='flex flex-row justify-center'
      >
        <Button
        type='button'
        name='emoji'
        variant='contained'
        onClick={() => setIsPickerVisible(!isPickerVisible)}
        className='w-fit text-7xl rounded-md bg-slate-200 hover:bg-slate-300 p-4'
        >
          {currentEmoji}
        </Button>
      </label>

      <div 
      className={`${isPickerVisible ? "flex" : "hidden"} w-full flex-row justify-center`}
      >
        <Picker 
        data={data} 
        previewPosition="none" 
        onEmojiSelect={(e: any) => {
          setCurrentEmoji(e.native);
          setIsPickerVisible(!isPickerVisible);
          }}/>
      </div>

      <label
      className='text-base text-slate-600 '
      > Rating (1-5):
        <div 
        className='flex flex-row justify-start gap-5 max-[600px]:items-center'
        >
        <div
        className='w-fit'
        >
        <input 
        type="number" 
        name="rating"
        max={5}
        min={1}
        value={rating}
        defaultValue={5}
        onBlur={handleRatingBlur}
        onChange={(e) => setRating(Number(e.target.value))}
        className={`${inputTailwindClasses} w-fit block`}
        required/>
        </div>
          <EmojiRating Emoji={currentEmoji} StarRating={rating}/>
        </div>
      </label>

      <label
      className='text-base text-slate-600'
      > Unit of Measurement:
        <input 
        type="text" 
        name='unit'
        maxLength={maxCharacters.unit} 
        onChange={handleTextChange}
        placeholder='e.g. Pizzas'
        className={inputTailwindClasses}
        />
        <span
        className={characterCountTailwidnClasses}
        >
          {textBoxLength.unit}/{maxCharacters.unit} characters
        </span>
      </label>

      <label
      className='text-base text-slate-600'
      > Description:
        <textarea 
        name='description'
        maxLength={maxCharacters.description} 
        onChange={handleTextChange}
        cols={50}
        rows={5}
        placeholder="e.g. Kiwi's are edible but not pizza shaped."
        className={`${inputTailwindClasses} block`}
        
        ></textarea>
        <span
        className={characterCountTailwidnClasses}
        >
          {textBoxLength.description}/{maxCharacters.description} characters
        </span>
      </label>
      
      <div className="flex justify-between items-center w-full h-[60px] mb-20">
      <Button 
      type='submit' 
      variant='contained'
      fullWidth
      save-modal-button className='save-modal-button'
      >
      Preview
      </Button>
      </div>

    </form>

  )

}




export const ReviewThingsAppFeedComponent = ({ model }: FeedComponentProps) => {
  
  
  
  return (
    <div className='w-full h-fit flex bg-slate-200 rounded-md px-5 py-5 max-[600px]:p-3 flex-col gap-4 max-[600px]:gap-2'>
      <span className='font-bold text-2xl max-[600px]:text-xl'>{model.data['name']}</span>
      <div className='-m-1 flex flex-row gap-4 max-[600px]:gap-2'>
        <span 
        className='font-thin text-center text-8xl max-[600px]:text-6xl'
        style={{
          // fontSize:"100px",

        }}
        >
          {model.data['rating']}/5
        </span>

        <div className='flex flex-col w-full justify-center'>
        <EmojiRating Emoji={model.data['emoji']} StarRating={Number(model.data['rating'])}/>
        <span className=' font-medium mx-1 text-2xl max-[600px]:text-lg' >{model.data['unit']}</span>

        </div>


      </div>

      <span className='text-base font-normal' >{model.data['note']}</span>

    </div>
   );
}

export const ReviewThingsAppComposerComponent = ({ model, done }: ComposerComponentProps) => {
  
  const onFinish = (data: any) => {
    model.data['name'] = data.item
    model.data['emoji'] = data.emoji
    model.data['rating'] = data.rating
    model.data['unit'] = data.unit
    model.data['note'] = data.description
    console.log(model)
    done(model)
  }
  
  
  return (
    <EmojiRatingForm onSubmit={onFinish}/>
  )
}