import { useRef, useState } from 'react'
import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types'
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { Button } from '@mui/material';



const EmojiTile = ({Emoji, DisplayEmoji, isClickable=false, onClick} : {Emoji: string, DisplayEmoji?: boolean,isClickable?:boolean, onClick?: () => void}) => {

  return(
    <div onClick={isClickable ? onClick : undefined} className='w-16 h-16 max-[600px]:w-8 max-[600px]:h-8 flex justify-center items-center'>
      <span 
      className={`${isClickable ? "select-none": ""} w-full text-6xl max-[600px]:text-3xl text-center m-auto`} 
      style={{
        display: DisplayEmoji ? "inline" : "none",
      }}
      >
        {Emoji}
      </span>
      <div 
      className='w-1/2 h-1/2 bg-slate-300 rounded-full'
      style={{
        display: DisplayEmoji ? "none" : "inline",
      }}
      >
      </div>

    </div>
  )

}

const EmojiRating = (props: {Emoji: string, StarRating: number, isInput?: boolean, onRatingChange?: (newRating: number) => void}) => {
  
  const handleClick = (rating: number) => {
    if(props.isInput && props.onRatingChange) {
      props.onRatingChange(rating);
    }

  }
  
  return (
    <div className={`flex flex-row justify-start gap-2 max-[600px]:gap-0.5 ${props.isInput ? "max-[600px]:my-2" : ""}`}>
      {[1,2,3,4,5].map((RatingPosition)=> (
        <EmojiTile 
        key={RatingPosition} 
        Emoji={props.Emoji}
        DisplayEmoji={props.StarRating >= RatingPosition}
        onClick={() => handleClick(RatingPosition)} 
        isClickable={props.isInput}  
        />
      ))}
    </div>
  )
}

const EmojiRatingForm = (props: {onSubmit: (data: any) => void}) => {
  
  const [currentEmoji, setCurrentEmoji] = useState('🍕');
  const [rating, setRating] = useState<number>(5);
  const [isPickerVisible, setIsPickerVisible] = useState(false);

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

  const handleRatingBlur = (e:React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)

    if (value > 5) {
      setRating(5)
    } else if (value < 1) {
      setRating(1)
    }

    e.target.value = value.toString() // changes the input field value to a number without leading zeros
  }

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement
    input.select()
  }

  const submitForm = (e: any) => {
    e.preventDefault()

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData)
    payload.emoji = currentEmoji
    props.onSubmit(payload)
  }

  return(
    <form 
    className='flex flex-col gap-5'
    autoComplete='off'
    onSubmit={submitForm}
    >
      <label
      className='text-base text-slate-600'
      > Name:
        <input 
        type="text" 
        name='item'
        autoComplete='off'
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

      
        <div 
        className='flex flex-row justify-start gap-5 items-end mt-2'
        >
        <div
        className='w-24'
        >
          <label
          className='text-base text-slate-600 '
          > Rating (1-5):
          <input 
          type="number" 
          name="rating"
          max={5}
          min={1}
          value={rating}
          onClick={handleClick}
          onChange={(e) => {setRating(parseInt(e.target.value, 10)); handleRatingBlur(e);}}
          className={`${inputTailwindClasses} block`}
          required/>
          </label>
        </div>
          <EmojiRating Emoji={currentEmoji} StarRating={rating} isInput={true} onRatingChange={(newRating) => setRating(newRating)}/>
        </div>
      

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
          {Number(model.data['rating'])}/5
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
    done(model)
  }
  
  return (
    <EmojiRatingForm onSubmit={onFinish}/>
  )
}