import { BlockModel, BlockTypes, ComposerComponentProps, FeedComponentProps } from './types';
import './TatergangsStyles.css'
import { useState, useRef } from 'react'
import SeamSaveButton from '../components/SeamSaveButton';
import background from './assets/Potato/background.png'
// arm imports
import arrrgh from './assets/Potato/arms/arrrgh.png'
import chadArms from './assets/Potato/arms/chadArms.png'
import gothArms from './assets/Potato/arms/gothArms.png'
import gunna from './assets/Potato/arms/gunna.png'
import kawaii from './assets/Potato/arms/kawaii.png'
import measure from './assets/Potato/arms/measure.png'
import puppetArms from './assets/Potato/arms/puppetArms.png'
import rockon from './assets/Potato/arms/rockon.png'
import slothCoffee from './assets/Potato/arms/slothCoffee.png'
import soup from './assets/Potato/arms/soup.png'
import spideyGrab from './assets/Potato/arms/spideyGrab.png'
import sticks from './assets/Potato/arms/sticks.png'
import strong from './assets/Potato/arms/strong.png'
import violin from './assets/Potato/arms/violin.png'
import yay from './assets/Potato/arms/yay.png'
// eyes imports
import babyEyes from './assets/Potato/eyes/babyEyes.png'
import chill from './assets/Potato/eyes/chill.png'
import crybaby from './assets/Potato/eyes/crybaby.png'
import dead from './assets/Potato/eyes/dead.png'
import determined from './assets/Potato/eyes/determined.png'
import diabolical from './assets/Potato/eyes/diabolical.png'
import entertainer from './assets/Potato/eyes/entertainer.png'
import flirt from './assets/Potato/eyes/flirt.png'
import glamVamp from './assets/Potato/eyes/glamVamp.png'
import iconEyes from './assets/Potato/eyes/iconEyes.png'
import insistent from './assets/Potato/eyes/insistent.png'
import pathetic from './assets/Potato/eyes/pathetic.png'
import ready from './assets/Potato/eyes/ready.png'
import spideyEyes from './assets/Potato/eyes/spideyEyes.png'
import trollEyes from './assets/Potato/eyes/trollEyes.png'
import Yang from './assets/Potato/eyes/Yang.png'
// legs imports
import ballet from './assets/Potato/legs/ballet.png'
import chadLegs from './assets/Potato/legs/chadLegs.png'
import crab from './assets/Potato/legs/crab.png'
import diaper from './assets/Potato/legs/diaper.png'
import goth from './assets/Potato/legs/goth.png'
import handy from './assets/Potato/legs/handy.png'
import islandBoy from './assets/Potato/legs/islandBoy.png'
import jeans from './assets/Potato/legs/jeans.png'
import parachute from './assets/Potato/legs/parachute.png'
import skater from './assets/Potato/legs/skater.png'
import snowBottom from './assets/Potato/legs/snowBottom.png'
import spideyJump from './assets/Potato/legs/spideyJump.png'
import trollLegs from './assets/Potato/legs/trollLegs.png'
// mouth imports
import beard from './assets/Potato/mouth/beard.png'
import bling from './assets/Potato/mouth/bling.png'
import braces from './assets/Potato/mouth/braces.png'
import buckteeth from './assets/Potato/mouth/buckteeth.png'
import deadMouth from './assets/Potato/mouth/deadMouth.png'
import drool from './assets/Potato/mouth/drool.png'
import fangs from './assets/Potato/mouth/fangs.png'
import fruit from './assets/Potato/mouth/fruit.png'
import gritNBearIt from './assets/Potato/mouth/gritNBearIt.png'
import puppetMouth from './assets/Potato/mouth/puppetMouth.png'
import sharkMouth from './assets/Potato/mouth/sharkMouth.png'
import singing from './assets/Potato/mouth/singing.png'
import smile from './assets/Potato/mouth/smile.png'
import wut from './assets/Potato/mouth/wut.png'
import yikes from './assets/Potato/mouth/yikes.png'
// nose imports
import bandaid from './assets/Potato/nose/bandaid.png'
import beak from './assets/Potato/nose/beak.png'
import carrot from './assets/Potato/nose/carrot.png'
import frysWithThat from './assets/Potato/nose/frysWithThat.png'
import gothSeptum from './assets/Potato/nose/gothSeptum.png'
import liar from './assets/Potato/nose/liar.png'
import mustachio from './assets/Potato/nose/mustachio.png'
import quirkyAndUnique from './assets/Potato/nose/quirkyAndUnique.png'
import roughNose from './assets/Potato/nose/roughNose.png'
import thicNose from './assets/Potato/nose/thicNose.png'
import thinNose from './assets/Potato/nose/thinNose.png'
import trollNose from './assets/Potato/nose/trollNose.png'
// potato imports
import chip from './assets/Potato/potato/chip.png'
import Okinawa from './assets/Potato/potato/Okinawa.png'
import red from './assets/Potato/potato/red.png'
import russet from './assets/Potato/potato/russet.png'
import sweetPurps from './assets/Potato/potato/sweetPurps.png'
import yam from './assets/Potato/potato/yam.png'
import yukon from './assets/Potato/potato/yukon.png'

const PotatoPersonality = (props: InnerSpudProps)=>{
  const {potato, eyes, spudName, arms, legs, mouth} = props
  let name = spudName.length ? spudName : 'This potato'
  let persona = `${name} is the newest member of the ${potatoStories[potato].gang}`


  return (
    <p className='potato-p tracking-wide text-lg'
    >{persona}</p>
  )
}

interface InnerSpudProps {
  potato: Potato
  eyes: Eyes
  spudName:string
  arms: Arms
  legs: Legs
  mouth: Mouth
  nose: Nose
}
const InnerSpud:React.FC<InnerSpudProps> = (props: InnerSpudProps)=>{
  let title;
  title = props.spudName.length? potatoSirname[props.potato].length=== 2?
  potatoSirname[props.potato][0] + ` ${props.spudName} ` + potatoSirname[props.potato][1] :
  `${props.spudName} `+ potatoSirname[props.potato][0] : ''
  const name = <div
  className='title z-50'
  >
    <p className='text-center potato-p'
    >
    {title}
    </p>
  </div>
  const farm = <img 
  src={background} 
  alt="farm pixel art" 
  className='z-0 absolute rounded-full'/>
  const potato =  <img 
  src={potatoOptions[props.potato]} 
  alt={props.potato} 
  className='absolute z-10 rounded-full'/>
  const eyes =  <img 
  src={eyeOptions[props.eyes]} 
  alt={props.eyes} 
  className='absolute z-20'/>
  const arms =  <img 
  src={armsOptions[props.arms]} 
  alt={props.arms} 
  className='absolute z-30'/>
  const legs =  <img 
  src={legOptions[props.legs]} 
  alt={props.legs} 
  className='absolute z-20 rounded-full'/>
  const mouth =  <img 
  src={mouthOptions[props.mouth]} 
  alt={props.mouth} 
  className='absolute z-20'/>
  const nose =  <img 
  src={noseOptions[props.nose]} 
  alt={props.nose} 
  className='absolute z-20'/>
  return (
    <div>
      {name}
    <div className='relative display'>
      {potato}
      {farm}
      {eyes}
      {arms}
      {legs}
      {mouth}
      {nose}
    </div>
    </div>
  )
}

type SwipeDirection = 'left' | 'right';
function useSwipe<T>(items: T[], currentItem: T, onUpdate: (item: T) => void) {
  const onTouchStart = useRef<{ x: number; y: number } | null>(null);
  const handleSwipe = (direction: SwipeDirection) => {
    const currentIndex = items.indexOf(currentItem);
    let newIndex = currentIndex;
    if (direction === 'right') {
      newIndex = (currentIndex + 1) % items.length;
    } else if (direction === 'left') {
      newIndex = (currentIndex - 1 + items.length) % items.length;
    }
    onUpdate(items[newIndex]);
  };
  const handleClick = () => {
    const currentIndex = items.indexOf(currentItem);
    const newIndex = (currentIndex + 1) % items.length;
    onUpdate(items[newIndex])
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    onTouchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!onTouchStart.current) return;

    const deltaX = e.changedTouches[0].clientX - onTouchStart.current.x;
    const deltaY = e.changedTouches[0].clientY - onTouchStart.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        handleSwipe('right');
      } else {
        handleSwipe('left');
      }
    }

    onTouchStart.current = null;
  };

  return { handleTouchStart, handleTouchEnd, handleClick };
}

const potatoOptions: Record<string, string>= {
  'russet': russet,
  'yukon': yukon,
  'lil red': red,
  'sweet purps': sweetPurps,
  'Okinawa': Okinawa,
  'yam': yam,
  'chip': chip
}
type GangStory = {
  gang: string,
  story: string
}
interface PotatoStory{
[potato:string]: GangStory
}
const potatoStories: PotatoStory={
  'russet': {
    gang: 'Tougheye gang',
    story: 'The Tougheye gang is the oldest and most Notorious of the Tater gangs.'},
  'yukon': {
    gang: '',
    story: ''},
  'lil red':{
    gang: '',
    story: ''},
  'sweet purps':{
    gang: '',
    story: ''},
  'Okinawa': {
    gang: '',
    story: ''},
  'yam': {
    gang: '',
    story: ''},
  'chip': {
    gang: '',
    story: ''}
}
type Potato = keyof typeof potatoOptions
interface PotatoSelectorProps extends InnerSpudProps{
  setPotato: (x: Potato)=>void;
}
const PotatoSelector = (props: PotatoSelectorProps) => {
  const potatoKeys = Object.keys(potatoOptions) as Potato[];
  const { handleTouchStart, handleTouchEnd, handleClick } = useSwipe(potatoKeys, props.potato, props.setPotato);

  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick = {handleClick}
    >
    <InnerSpud nose={props.nose} mouth={props.mouth}  potato={props.potato} legs={props.legs} spudName={props.spudName} eyes={props.eyes} arms={props.arms}/>
    <p>swipe or click to change potato</p>
    </div>
  );
};



const eyeOptions: Record<string, string> ={
'babyEyes' : babyEyes,
'chill' : chill,
'crybaby' : crybaby,
'dead' : dead,
'determined' : determined,
'diabolical' : diabolical,
'entertainer' : entertainer,
'flirt' : flirt,
'glamVamp' : glamVamp,
'iconEyes' : iconEyes,
'insistent' : insistent,
'pathetic' : pathetic,
'ready' : ready,
'spideyEyes' : spideyEyes,
'trollEyes' : trollEyes,
'Yang' : Yang,
}
type Eyes = keyof typeof eyeOptions
interface EyesSelectorProps extends InnerSpudProps{
  setEyes: (x: Eyes)=>void
}
const EyesSelector = (props: EyesSelectorProps) => {
  const eyeKeys = Object.keys(eyeOptions) as Eyes[];
  const { handleTouchStart, handleTouchEnd, handleClick } = useSwipe(eyeKeys, props.eyes, props.setEyes);

  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center"
      onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
      onClick = {handleClick}
    >
    <InnerSpud nose={props.nose} mouth={props.mouth}  potato={props.potato} legs={props.legs} spudName={props.spudName} eyes={props.eyes} arms={props.arms}/>
    <p>swipe or click to change eyes</p>
    </div>
  );
};

const noseOptions: Record<string, string> ={
  'bandaid' : bandaid,
  'beak' : beak,
  'carrot' : carrot,
  'frysWithThat' : frysWithThat,
  'gothSeptum' : gothSeptum,
  'liar' : liar,
  'mustachio' : mustachio,
  'quirkyAndUnique' : quirkyAndUnique,
  'roughNose' : roughNose,
  'thicNose' : thicNose,
  'thinNose' : thinNose,
  'trollNose' : trollNose,
  
  }
  type Nose = keyof typeof noseOptions
  interface NoseSelectorProps extends InnerSpudProps{
    setNose: (x: Nose)=>void
  }
  const NoseSelector = (props: NoseSelectorProps) => {
    const noseKeys = Object.keys(noseOptions) as Nose[];
    const { handleTouchStart, handleTouchEnd, handleClick } = useSwipe(noseKeys, props.nose, props.setNose);
  
    return (
      <div
        className="w-full h-full flex flex-col justify-center items-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick = {handleClick}
      >
      <InnerSpud mouth={props.mouth} nose={props.nose}  potato={props.potato} spudName={props.spudName} legs={props.legs} arms={props.arms} eyes={props.eyes}/>
      <p>swipe or click to change nose</p>
      </div>
    );
  };

const mouthOptions: Record<string, string> ={
  'beard': beard,
  'bling': bling,
  'braces': braces,
  'buckteeth': buckteeth,
  'deadmouth': deadMouth,
  'drool': drool,
  'fangs': fangs,
  'fruit': fruit,
  'gritNBearIt': gritNBearIt,
  'puppetMouth': puppetMouth,
  'sharkMouth': sharkMouth,
  'singing': singing,
  'smile': smile,
  'wut': wut,
  'yikes': yikes
  }
  type Mouth = keyof typeof mouthOptions
  interface MouthSelectorProps extends InnerSpudProps{
    setMouth: (x: Mouth)=>void
  }
  const MouthSelector = (props: MouthSelectorProps) => {
    const mouthKeys = Object.keys(mouthOptions) as Mouth[];
    const { handleTouchStart, handleTouchEnd, handleClick } = useSwipe(mouthKeys, props.mouth, props.setMouth);
  
    return (
      <div
        className="w-full h-full flex flex-col justify-center items-center"
        onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
        onClick = {handleClick}
      >
      <InnerSpud nose={props.nose} mouth={props.mouth}  potato={props.potato} spudName={props.spudName} legs={props.legs} arms={props.arms} eyes={props.eyes}/>
      <p>swipe or click to change mouth</p>
      </div>
    );
  };
  

const legOptions: Record<string, string> ={
'ballet' : ballet,
'chadLegs' : chadLegs,
'crab' : crab,
'diaper' : diaper,
'goth' : goth,
'handy' : handy,
'islandBoy' : islandBoy,
'jeans' : jeans,
'parachute' : parachute,
'skater' : skater,
'snowBottom' : snowBottom,
'spideyJump' : spideyJump,
'trollLegs' : trollLegs,
}
type Legs = keyof typeof legOptions
interface LegsSelectorProps extends InnerSpudProps{
  setLegs: (x: Legs)=>void
}
const LegsSelector = (props: LegsSelectorProps) => {
  const legKeys = Object.keys(legOptions) as Legs[];
  const { handleTouchStart, handleTouchEnd, handleClick } = useSwipe(legKeys, props.legs, props.setLegs);

  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center"
      onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
      onClick = {handleClick}
    >
    <InnerSpud nose={props.nose} mouth={props.mouth}  potato={props.potato} spudName={props.spudName} legs={props.legs} arms={props.arms} eyes={props.eyes}/>
    <p>swipe or click to change legs</p>
    </div>
  );
};

const armsOptions: Record<string, string> ={
'arrrgh' : arrrgh,
'chadArms' : chadArms,
'gothArms' : gothArms,
'gunna' : gunna,
'kawaii' : kawaii,
'measure' : measure,
'puppetArms' : puppetArms,
'rockon' : rockon,
'slothCoffee' : slothCoffee,
'soup' : soup,
'spideyGrab' : spideyGrab,
'sticks' : sticks,
'strong' : strong,
'violin' : violin,
'yay' : yay,
}
type Arms = keyof typeof armsOptions
interface ArmsSelectorProps extends InnerSpudProps{
  setArms: (x: Arms)=>void
}
const ArmsSelector = (props: ArmsSelectorProps) => {
  const armKeys = Object.keys(armsOptions) as Arms[];
  const { handleTouchStart, handleTouchEnd, handleClick } = useSwipe(armKeys, props.arms, props.setArms);

  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center"
      onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
      onClick = {handleClick}
    >
    <InnerSpud nose={props.nose} mouth={props.mouth}  potato={props.potato} legs={props.legs} spudName={props.spudName} arms={props.arms} eyes={props.eyes}/>
    <p>swipe or click to change arms</p>
    </div>
  );
};

const potatoSirname: Record<string, string[]>= {
  'russet': ['Tougheye'],
  'yukon': ['Spudster'],
  'lil red': ['lil','Red'],
  'sweet purps': ['Sweet', 'Purps'],
  'Okinawa': ['Okinawa'],
  'yam': ['Yams'],
  'chip': ['Tatergiest']
}

interface NameSelectorProps extends InnerSpudProps{
  setSpudName: (x: string)=> void;
}
const NameSelector = (props: NameSelectorProps) => {
  return (
    <div className='w-full h-full flex flex-col items-center'>
      <InnerSpud mouth={props.mouth} nose={props.nose}  potato={props.potato} legs={props.legs} spudName={props.spudName} eyes={props.eyes} arms={props.arms}/>
      <p>name your tater:</p>
      <div className='border border-black w-2/3 object-contain rounded-md z-50'>
        <input
        id="name" 
        type="text"
        placeholder="spudster"
        value={props.spudName}
        onChange={(e)=> props.setSpudName(e.target.value)}
        />
      </div>
    </div>
    )
};

enum SpudSelectionView {
  POTATO,
  EYES,
  NAME,
  ARMS,
  LEGS,
  MOUTH,
  NOSE
}
interface SpudSelectionProps {
  setActiveSelectionTab: (tab: SpudSelectionView)=> void
  activeSelectionTab: SpudSelectionView
}
const SpudSelection = (props: SpudSelectionProps) => {
  return (
    <div className='w-full'>
      <p className='title text-center'
      >Menu Selection</p>
       <div className='relative flex flex-wrap justify-evenly w-full h-full'>
        <div
          className='flex-1 text-center'
          onClick={() => props.setActiveSelectionTab(SpudSelectionView.POTATO)}
          style={{ color: props.activeSelectionTab === SpudSelectionView.POTATO ? '#8b5cf6' : 'black' }}
        >
        <p className='menu-item text-lg'
        >potato</p>
        </div>   
        <div
          className='flex-1 text-center'
          onClick={() => props.setActiveSelectionTab(SpudSelectionView.EYES)}
          style={{ color: props.activeSelectionTab === SpudSelectionView.EYES ? '#8b5cf6' : 'black' }}
        >
        <p className='menu-item text-lg'
        >eyes</p>
        </div>
        <div
          className='flex-1 text-center'
          onClick={() => props.setActiveSelectionTab(SpudSelectionView.NOSE)}
          style={{ color: props.activeSelectionTab === SpudSelectionView.NOSE ? '#8b5cf6' : 'black' }}
        >
        <p className='menu-item text-lg'
        >nose</p>
        </div>
        <div
          className='flex-1 text-center'
          onClick={() => props.setActiveSelectionTab(SpudSelectionView.MOUTH)}
          style={{ color: props.activeSelectionTab === SpudSelectionView.MOUTH ? '#8b5cf6' : 'black' }}
        >
        <p className='menu-item text-lg'
        >mouth</p>
        </div>
      </div>
      <div className='flex flex-wrap p-1 justify-evenly w-full'>
        <div
          className='flex-1 text-center'
          onClick={() => props.setActiveSelectionTab(SpudSelectionView.LEGS)}
          style={{ color: props.activeSelectionTab === SpudSelectionView.LEGS ? '#8b5cf6' : 'black' }}
        >
        <p className='menu-item text-lg'
        >legs</p>
        </div>
        <div
          className='flex-1 text-center'
          onClick={() => props.setActiveSelectionTab(SpudSelectionView.ARMS)}
          style={{ color: props.activeSelectionTab === SpudSelectionView.ARMS ? '#8b5cf6' : 'black' }}
        >
        <p className='menu-item text-lg'
        >arms</p>
        </div>
        <div
          className='flex-1 text-center'
          onClick={() => props.setActiveSelectionTab(SpudSelectionView.NAME)}
          style={{ color: props.activeSelectionTab === SpudSelectionView.NAME ? '#8b5cf6' : 'black' }}
        >
        <p className='menu-item text-lg'
        >name</p>
        </div>
      </div>
    </div>
     
  )
}


interface SpudSelectionTabProps extends InnerSpudProps{
  activeSelectionTab: SpudSelectionView
  setPotato: (potato: Potato) => void
  setEyes: (eyes: Eyes) => void
  setArms: (arms: Arms) => void
  setLegs: (legs: Legs) => void
  setMouth: (mouth: Mouth) => void
  setNose: (nose: Nose) => void
  setSpudName: (spudName: string) => void
}
const SpudSelectionTab = (props: SpudSelectionTabProps) => {
  return (
    <div className='flex w-full h-full selectionTab'>
      {props.activeSelectionTab === SpudSelectionView.POTATO
        && <PotatoSelector potato={props.potato} legs={props.legs} setPotato={props.setPotato} eyes={props.eyes} spudName={props.spudName} arms={props.arms} mouth={props.mouth} nose={props.nose}
        />
      }
      {props.activeSelectionTab === SpudSelectionView.EYES
        && <EyesSelector eyes={props.eyes} setEyes={props.setEyes} potato={props.potato} legs={props.legs} spudName={props.spudName} arms={props.arms} mouth={props.mouth} nose={props.nose}
        />
      }
      {props.activeSelectionTab === SpudSelectionView.LEGS
        && <LegsSelector legs={props.legs} setLegs={props.setLegs} potato={props.potato} spudName={props.spudName} arms={props.arms} eyes={props.eyes} mouth={props.mouth} nose={props.nose}
        />
      }
      {props.activeSelectionTab === SpudSelectionView.ARMS
        && <ArmsSelector arms={props.arms} setArms={props.setArms} potato={props.potato} legs={props.legs} spudName={props.spudName} eyes={props.eyes} mouth={props.mouth} nose={props.nose}
        />
      }
      {props.activeSelectionTab === SpudSelectionView.MOUTH
        && <MouthSelector mouth={props.mouth} setMouth={props.setMouth} potato={props.potato} legs={props.legs} spudName={props.spudName} eyes={props.eyes} arms={props.arms} nose={props.nose}
        />
      }
      {props.activeSelectionTab === SpudSelectionView.NOSE
        && <NoseSelector nose={props.nose} setNose={props.setNose} potato={props.potato} legs={props.legs} spudName={props.spudName} eyes={props.eyes} arms={props.arms} mouth={props.mouth}
        />
      }
      {props.activeSelectionTab === SpudSelectionView.NAME
        && <NameSelector spudName={props.spudName} setSpudName={props.setSpudName} eyes={props.eyes} potato={props.potato} legs={props.legs} arms={props.arms} mouth={props.mouth} nose={props.nose}
        />
      }
    </div>
  );
}

interface UpdateSpudProps {
  model: BlockModel;
  done: (data: BlockModel) => void;
}

const UpdateSpud: React.FC<UpdateSpudProps> = ({ model, done }) => {
  const [potato, setPotato] = useState<Potato>('russet');
  const [eyes, setEyes] = useState<Eyes>('');
  const [arms, setArms] = useState<Arms>('');
  const [mouth, setMouth] = useState<Mouth>('');
  const [nose, setNose] = useState<Nose>('');
  const [legs, setLegs] = useState<Legs>('');
  const [spudName, setSpudName] = useState('');
  const [activeSelectionTab, setActiveSelectionTab] = useState(SpudSelectionView.POTATO);
  const handleSave = () => {
    model.data.potato = potato;
    model.data.eyes = eyes;
    model.data.arms = arms;
    model.data.mouth = mouth;
    model.data.nose = nose;
    model.data.legs = legs;
    model.data.spudName = spudName;
    done(model);
  };

  return (
    <div className='flex flex-col items-center h-full w-full '>
      <SpudSelectionTab
        activeSelectionTab={activeSelectionTab}
        potato={potato}
        setPotato={setPotato}
        eyes={eyes}
        setEyes={setEyes}
        arms={arms}
        setArms={setArms}
        mouth={mouth}
        setMouth={setMouth}
        nose={nose}
        setNose={setNose}
        legs={legs}
        setLegs={setLegs}
        spudName={spudName}
        setSpudName={setSpudName}
        />
        <div className='absolute bottom-0 flex flex-col items-center w-10/12'>
            <SpudSelection
              setActiveSelectionTab={setActiveSelectionTab}
              activeSelectionTab={activeSelectionTab}
            />
          <div className="p-3 w-2/3">
            <SeamSaveButton onClick={handleSave} />
          </div>
        </div>
    </div>
  );
};


const DisplaySpud: React.FC<InnerSpudProps> = ({ eyes, potato, spudName, arms, legs, mouth, nose }) => {
  const [view, setView] = useState('headshot');

  const toggleView = () => setView((prevView) => (prevView === 'headshot' ? 'info' : 'headshot'));

  return (
    <div className='relative flex flex-col items-center h-full w-full bg-green-200 rounded-xl'>
      {view === 'headshot' ? (
        <div className='flex flex-col items-center w-10/12'>
          <InnerSpud mouth={mouth} nose={nose}  potato={potato} eyes={eyes} spudName={spudName} arms={arms} legs={legs}/>
          <p 
          className='potato-p text-center my-3'
          onClick={toggleView}
          >information</p>
        </div>
      ) : (
        <div>
          <PotatoPersonality potato={potato} eyes={eyes} spudName={spudName} arms={arms} legs={legs} mouth={mouth} nose={nose}/>
          <p 
          className='potato-p text-center my-3'
          onClick={toggleView}
          >headshot</p>
        </div>
      )}
    </div>
  );
};

export const TatergangsFeedComponent = ({ model }: FeedComponentProps) => {
  const {eyes, potato, spudName, arms, legs, mouth, nose } = model.data
  return <DisplaySpud mouth={mouth} nose={nose} eyes={eyes} potato={potato} spudName={spudName} arms={arms} legs={legs}/>
}

export const TatergangsComposerComponent = ({ model, done }: ComposerComponentProps) => {
  return (
    <div className='h-full'>
      <UpdateSpud done={done} model={model} />
    </div>
  );
}
