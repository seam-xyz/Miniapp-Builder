import {
  BlockModel,
  BlockTypes,
  ComposerComponentProps,
  FeedComponentProps,
} from "./types";
import "./TatergangsStyles.css";
import { useState, useRef } from "react";
import SeamSaveButton from "../components/SeamSaveButton";
import fortune from "./assets/Potato/fortune.png"
import background from "./assets/Potato/background.png";
// arm imports
import arrrgh from "./assets/Potato/arms/arrrgh.png";
import chadArms from "./assets/Potato/arms/chadArms.png";
import gothArms from "./assets/Potato/arms/gothArms.png";
import gunna from "./assets/Potato/arms/gunna.png";
import kawaii from "./assets/Potato/arms/kawaii.png";
import measure from "./assets/Potato/arms/measure.png";
import puppetArms from "./assets/Potato/arms/puppetArms.png";
import rockon from "./assets/Potato/arms/rockon.png";
import slothCoffee from "./assets/Potato/arms/slothCoffee.png";
import soup from "./assets/Potato/arms/soup.png";
import spideyGrab from "./assets/Potato/arms/spideyGrab.png";
import sticks from "./assets/Potato/arms/sticks.png";
import strong from "./assets/Potato/arms/strong.png";
import violin from "./assets/Potato/arms/violin.png";
import yay from "./assets/Potato/arms/yay.png";
// eyes imports
import babyEyes from "./assets/Potato/eyes/babyEyes.png";
import chill from "./assets/Potato/eyes/chill.png";
import crybaby from "./assets/Potato/eyes/crybaby.png";
import dead from "./assets/Potato/eyes/dead.png";
import determined from "./assets/Potato/eyes/determined.png";
import diabolical from "./assets/Potato/eyes/diabolical.png";
import entertainer from "./assets/Potato/eyes/entertainer.png";
import flirt from "./assets/Potato/eyes/flirt.png";
import glamVamp from "./assets/Potato/eyes/glamVamp.png";
import iconEyes from "./assets/Potato/eyes/iconEyes.png";
import insistent from "./assets/Potato/eyes/insistent.png";
import pathetic from "./assets/Potato/eyes/pathetic.png";
import ready from "./assets/Potato/eyes/ready.png";
import spideyEyes from "./assets/Potato/eyes/spideyEyes.png";
import trollEyes from "./assets/Potato/eyes/trollEyes.png";
import Yang from "./assets/Potato/eyes/Yang.png";
// legs imports
import ballet from "./assets/Potato/legs/ballet.png";
import chadLegs from "./assets/Potato/legs/chadLegs.png";
import crab from "./assets/Potato/legs/crab.png";
import diaper from "./assets/Potato/legs/diaper.png";
import goth from "./assets/Potato/legs/goth.png";
import handy from "./assets/Potato/legs/handy.png";
import islandBoy from "./assets/Potato/legs/islandBoy.png";
import jeans from "./assets/Potato/legs/jeans.png";
import parachute from "./assets/Potato/legs/parachute.png";
import skater from "./assets/Potato/legs/skater.png";
import snowBottom from "./assets/Potato/legs/snowBottom.png";
import spideyJump from "./assets/Potato/legs/spideyJump.png";
import trollLegs from "./assets/Potato/legs/trollLegs.png";
// mouth imports
import beard from "./assets/Potato/mouth/beard.png";
import bling from "./assets/Potato/mouth/bling.png";
import braces from "./assets/Potato/mouth/braces.png";
import buckteeth from "./assets/Potato/mouth/buckteeth.png";
import deadMouth from "./assets/Potato/mouth/deadMouth.png";
import drool from "./assets/Potato/mouth/drool.png";
import fangs from "./assets/Potato/mouth/fangs.png";
import fruit from "./assets/Potato/mouth/fruit.png";
import gritNBearIt from "./assets/Potato/mouth/gritNBearIt.png";
import puppetMouth from "./assets/Potato/mouth/puppetMouth.png";
import sharkMouth from "./assets/Potato/mouth/sharkMouth.png";
import singing from "./assets/Potato/mouth/singing.png";
import smile from "./assets/Potato/mouth/smile.png";
import wut from "./assets/Potato/mouth/wut.png";
import yikes from "./assets/Potato/mouth/yikes.png";
// nose imports
import bandaid from "./assets/Potato/nose/bandaid.png";
import beak from "./assets/Potato/nose/beak.png";
import carrot from "./assets/Potato/nose/carrot.png";
import frysWithThat from "./assets/Potato/nose/frysWithThat.png";
import gothSeptum from "./assets/Potato/nose/gothSeptum.png";
import liar from "./assets/Potato/nose/liar.png";
import mustachio from "./assets/Potato/nose/mustachio.png";
import quirkyAndUnique from "./assets/Potato/nose/quirkyAndUnique.png";
import roughNose from "./assets/Potato/nose/roughNose.png";
import thicNose from "./assets/Potato/nose/thicNose.png";
import thinNose from "./assets/Potato/nose/thinNose.png";
import trollNose from "./assets/Potato/nose/trollNose.png";
// potato imports
import chip from "./assets/Potato/potato/chip.png";
import Okinawa from "./assets/Potato/potato/Okinawa.png";
import red from "./assets/Potato/potato/red.png";
import russet from "./assets/Potato/potato/russet.png";
import sweetPurps from "./assets/Potato/potato/sweetPurps.png";
import yam from "./assets/Potato/potato/yam.png";
import yukon from "./assets/Potato/potato/yukon.png";

interface InnerSpudProps {
  potato: Potato;
  eyes: Eyes;
  spudName: string;
  arms: Arms;
  legs: Legs;
  mouth: Mouth;
  nose: Nose;
}
const InnerSpud: React.FC<InnerSpudProps> = (props: InnerSpudProps) => {
  let title;
  title = props.spudName.length
    ? potatoSirname[props.potato].length === 2
      ? potatoSirname[props.potato][0] +
        ` ${props.spudName} ` +
        potatoSirname[props.potato][1]
      : `${props.spudName} ` + potatoSirname[props.potato][0]
    : "";
  const name = (
    <div className="title z-50">
      <p className="text-center potato-p">{title}</p>
    </div>
  );
  const farm = (
    <img
      src={background}
      alt="farm pixel art"
      className="z-0 absolute rounded-3xl"
    />
  );
  const potato = (
    <img
      src={potatoOptions[props.potato]}
      alt={props.potato}
      className="absolute z-10 rounded-3xl"
    />
  );
  const eyes = (
    <img
      src={eyeOptions[props.eyes]}
      alt={props.eyes}
      className="absolute z-20"
    />
  );
  const arms = (
    <img
      src={armsOptions[props.arms]}
      alt={props.arms}
      className="absolute z-30"
    />
  );
  const legs = (
    <img
      src={legOptions[props.legs]}
      alt={props.legs}
      className="absolute z-20 rounded-3xl"
    />
  );
  const mouth = (
    <img
      src={mouthOptions[props.mouth]}
      alt={props.mouth}
      className="absolute z-20"
    />
  );
  const nose = (
    <img
      src={noseOptions[props.nose]}
      alt={props.nose}
      className="absolute z-20"
    />
  );
  return (
    <div>
      {name}
      <div className="relative display">
        {potato}
        {farm}
        {eyes}
        {arms}
        {legs}
        {mouth}
        {nose}
      </div>
    </div>
  );
};

type SwipeDirection = "left" | "right";
function useSwipe<T>(items: T[], currentItem: T, onUpdate: (item: T) => void) {
  const onTouchStart = useRef<{ x: number; y: number } | null>(null);
  const handleSwipe = (direction: SwipeDirection) => {
    const currentIndex = items.indexOf(currentItem);
    let newIndex = currentIndex;
    if (direction === "right") {
      newIndex = (currentIndex + 1) % items.length;
    } else if (direction === "left") {
      newIndex = (currentIndex - 1 + items.length) % items.length;
    }
    onUpdate(items[newIndex]);
  };
  const handleClick = () => {
    const currentIndex = items.indexOf(currentItem);
    const newIndex = (currentIndex + 1) % items.length;
    onUpdate(items[newIndex]);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    onTouchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!onTouchStart.current) return;

    const deltaX = e.changedTouches[0].clientX - onTouchStart.current.x;
    const deltaY = e.changedTouches[0].clientY - onTouchStart.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        handleSwipe("right");
      } else {
        handleSwipe("left");
      }
    }

    onTouchStart.current = null;
  };

  return { handleTouchStart, handleTouchEnd, handleClick };
}

const potatoOptions: Record<string, string> = {
  russet: russet,
  yukon: yukon,
  lilRed: red,
  sweetPurps: sweetPurps,
  Okinawa: Okinawa,
  yam: yam,
  chip: chip,
};
type Potato = keyof typeof potatoOptions;
interface PotatoSelectorProps extends InnerSpudProps {
  setPotato: (x: Potato) => void;
}
const PotatoSelector = (props: PotatoSelectorProps) => {
  const potatoKeys = Object.keys(potatoOptions) as Potato[];
  const { handleTouchStart, handleTouchEnd, handleClick } = useSwipe(
    potatoKeys,
    props.potato,
    props.setPotato
  );

  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      <InnerSpud
        nose={props.nose}
        mouth={props.mouth}
        potato={props.potato}
        legs={props.legs}
        spudName={props.spudName}
        eyes={props.eyes}
        arms={props.arms}
      />
      <p className="mt-8">swipe or click to change potato</p>
    </div>
  );
};

const eyeOptions: Record<string, string> = {
  babyEyes: babyEyes,
  chill: chill,
  crybaby: crybaby,
  dead: dead,
  determined: determined,
  diabolical: diabolical,
  entertainer: entertainer,
  flirt: flirt,
  glamVamp: glamVamp,
  iconEyes: iconEyes,
  insistent: insistent,
  pathetic: pathetic,
  ready: ready,
  spideyEyes: spideyEyes,
  trollEyes: trollEyes,
  Yang: Yang,
};
type Eyes = keyof typeof eyeOptions;
interface EyesSelectorProps extends InnerSpudProps {
  setEyes: (x: Eyes) => void;
}
const EyesSelector = (props: EyesSelectorProps) => {
  const eyeKeys = Object.keys(eyeOptions) as Eyes[];
  const { handleTouchStart, handleTouchEnd, handleClick } = useSwipe(
    eyeKeys,
    props.eyes,
    props.setEyes
  );

  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      <InnerSpud
        nose={props.nose}
        mouth={props.mouth}
        potato={props.potato}
        legs={props.legs}
        spudName={props.spudName}
        eyes={props.eyes}
        arms={props.arms}
      />
      <p className="mt-8">swipe or click to change eyes</p>
    </div>
  );
};

const noseOptions: Record<string, string> = {
  bandaid: bandaid,
  beak: beak,
  carrot: carrot,
  frysWithThat: frysWithThat,
  gothSeptum: gothSeptum,
  liar: liar,
  mustachio: mustachio,
  quirkyAndUnique: quirkyAndUnique,
  roughNose: roughNose,
  thicNose: thicNose,
  thinNose: thinNose,
  trollNose: trollNose,
};
type Nose = keyof typeof noseOptions;
interface NoseSelectorProps extends InnerSpudProps {
  setNose: (x: Nose) => void;
}
const NoseSelector = (props: NoseSelectorProps) => {
  const noseKeys = Object.keys(noseOptions) as Nose[];
  const { handleTouchStart, handleTouchEnd, handleClick } = useSwipe(
    noseKeys,
    props.nose,
    props.setNose
  );

  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      <InnerSpud
        mouth={props.mouth}
        nose={props.nose}
        potato={props.potato}
        spudName={props.spudName}
        legs={props.legs}
        arms={props.arms}
        eyes={props.eyes}
      />
      <p className="mt-8">swipe or click to change nose</p>
    </div>
  );
};

const mouthOptions: Record<string, string> = {
  beard: beard,
  bling: bling,
  braces: braces,
  buckteeth: buckteeth,
  deadmouth: deadMouth,
  drool: drool,
  fangs: fangs,
  fruit: fruit,
  gritNBearIt: gritNBearIt,
  puppetMouth: puppetMouth,
  sharkMouth: sharkMouth,
  singing: singing,
  smile: smile,
  wut: wut,
  yikes: yikes,
};
type Mouth = keyof typeof mouthOptions;
interface MouthSelectorProps extends InnerSpudProps {
  setMouth: (x: Mouth) => void;
}
const MouthSelector = (props: MouthSelectorProps) => {
  const mouthKeys = Object.keys(mouthOptions) as Mouth[];
  const { handleTouchStart, handleTouchEnd, handleClick } = useSwipe(
    mouthKeys,
    props.mouth,
    props.setMouth
  );

  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      <InnerSpud
        nose={props.nose}
        mouth={props.mouth}
        potato={props.potato}
        spudName={props.spudName}
        legs={props.legs}
        arms={props.arms}
        eyes={props.eyes}
      />
      <p className="mt-8">swipe or click to change mouth</p>
    </div>
  );
};

const legOptions: Record<string, string> = {
  ballet: ballet,
  chadLegs: chadLegs,
  crab: crab,
  diaper: diaper,
  goth: goth,
  handy: handy,
  islandBoy: islandBoy,
  jeans: jeans,
  parachute: parachute,
  skater: skater,
  snowBottom: snowBottom,
  spideyJump: spideyJump,
  trollLegs: trollLegs,
};
type Legs = keyof typeof legOptions;
interface LegsSelectorProps extends InnerSpudProps {
  setLegs: (x: Legs) => void;
}
const LegsSelector = (props: LegsSelectorProps) => {
  const legKeys = Object.keys(legOptions) as Legs[];
  const { handleTouchStart, handleTouchEnd, handleClick } = useSwipe(
    legKeys,
    props.legs,
    props.setLegs
  );

  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      <InnerSpud
        nose={props.nose}
        mouth={props.mouth}
        potato={props.potato}
        spudName={props.spudName}
        legs={props.legs}
        arms={props.arms}
        eyes={props.eyes}
      />
      <p className="mt-8">swipe or click to change legs</p>
    </div>
  );
};

const armsOptions: Record<string, string> = {
  arrrgh: arrrgh,
  chadArms: chadArms,
  gothArms: gothArms,
  gunna: gunna,
  kawaii: kawaii,
  measure: measure,
  puppetArms: puppetArms,
  rockon: rockon,
  slothCoffee: slothCoffee,
  soup: soup,
  spideyGrab: spideyGrab,
  sticks: sticks,
  strong: strong,
  violin: violin,
  yay: yay,
};
type Arms = keyof typeof armsOptions;
interface ArmsSelectorProps extends InnerSpudProps {
  setArms: (x: Arms) => void;
}
const ArmsSelector = (props: ArmsSelectorProps) => {
  const armKeys = Object.keys(armsOptions) as Arms[];
  const { handleTouchStart, handleTouchEnd, handleClick } = useSwipe(
    armKeys,
    props.arms,
    props.setArms
  );

  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      <InnerSpud
        nose={props.nose}
        mouth={props.mouth}
        potato={props.potato}
        legs={props.legs}
        spudName={props.spudName}
        arms={props.arms}
        eyes={props.eyes}
      />
      <p className="mt-8">swipe or click to change arms</p>
    </div>
  );
};

const potatoSirname: Record<string, string[]> = {
  russet: ["Tougheye"],
  yukon: ["Yukon"],
  lilRed: ["lil", "Red"],
  sweetPurps: ["Sweet", "Purps"],
  Okinawa: ["Okinawa"],
  yam: ["Yams"],
  chip: ["Krisps"],
};

interface NameSelectorProps extends InnerSpudProps {
  setSpudName: (x: string) => void;
}
const NameSelector = (props: NameSelectorProps) => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <InnerSpud
        mouth={props.mouth}
        nose={props.nose}
        potato={props.potato}
        legs={props.legs}
        spudName={props.spudName}
        eyes={props.eyes}
        arms={props.arms}
      />
      <div className="mt-8 text-center">
        <p>name your tater:</p>
        <input
          className="w-1/2 bg-transparent focus:outline-none border-2 border-black rounded-md text-center text-blue-700 font-bold"
          id="name"
          type="text"
          placeholder="spudster"
          value={props.spudName}
          onChange={(e) => props.setSpudName(e.target.value)}
        />
      </div>
    </div>
  );
};

enum SpudSelectionView {
  POTATO,
  EYES,
  NAME,
  ARMS,
  LEGS,
  MOUTH,
  NOSE,
}
interface SpudSelectionProps {
  setActiveSelectionTab: (tab: SpudSelectionView) => void;
  activeSelectionTab: SpudSelectionView;
}
const SpudSelection = (props: SpudSelectionProps) => {
  return (
    <div className="w-full">
      <p className="title text-center">Menu Selection</p>
      <div className="relative flex flex-wrap justify-evenly w-full h-full">
        <div
          className="flex-1 text-center"
          onClick={() => props.setActiveSelectionTab(SpudSelectionView.POTATO)}
          style={{
            color:
              props.activeSelectionTab === SpudSelectionView.POTATO
                ? "#8b5cf6"
                : "black",
          }}
        >
          <p className="menu-item text-lg">potato</p>
        </div>
        <div
          className="flex-1 text-center"
          onClick={() => props.setActiveSelectionTab(SpudSelectionView.EYES)}
          style={{
            color:
              props.activeSelectionTab === SpudSelectionView.EYES
                ? "#8b5cf6"
                : "black",
          }}
        >
          <p className="menu-item text-lg">eyes</p>
        </div>
        <div
          className="flex-1 text-center"
          onClick={() => props.setActiveSelectionTab(SpudSelectionView.NOSE)}
          style={{
            color:
              props.activeSelectionTab === SpudSelectionView.NOSE
                ? "#8b5cf6"
                : "black",
          }}
        >
          <p className="menu-item text-lg">nose</p>
        </div>
        <div
          className="flex-1 text-center"
          onClick={() => props.setActiveSelectionTab(SpudSelectionView.MOUTH)}
          style={{
            color:
              props.activeSelectionTab === SpudSelectionView.MOUTH
                ? "#8b5cf6"
                : "black",
          }}
        >
          <p className="menu-item text-lg">mouth</p>
        </div>
      </div>
      <div className="flex flex-wrap p-1 justify-evenly w-full">
        <div
          className="flex-1 text-center"
          onClick={() => props.setActiveSelectionTab(SpudSelectionView.LEGS)}
          style={{
            color:
              props.activeSelectionTab === SpudSelectionView.LEGS
                ? "#8b5cf6"
                : "black",
          }}
        >
          <p className="menu-item text-lg">legs</p>
        </div>
        <div
          className="flex-1 text-center"
          onClick={() => props.setActiveSelectionTab(SpudSelectionView.ARMS)}
          style={{
            color:
              props.activeSelectionTab === SpudSelectionView.ARMS
                ? "#8b5cf6"
                : "black",
          }}
        >
          <p className="menu-item text-lg">arms</p>
        </div>
        <div
          className="flex-1 text-center"
          onClick={() => props.setActiveSelectionTab(SpudSelectionView.NAME)}
          style={{
            color:
              props.activeSelectionTab === SpudSelectionView.NAME
                ? "#8b5cf6"
                : "black",
          }}
        >
          <p className="menu-item text-lg">name</p>
        </div>
      </div>
    </div>
  );
};

interface SpudSelectionTabProps extends InnerSpudProps {
  activeSelectionTab: SpudSelectionView;
  setPotato: (potato: Potato) => void;
  setEyes: (eyes: Eyes) => void;
  setArms: (arms: Arms) => void;
  setLegs: (legs: Legs) => void;
  setMouth: (mouth: Mouth) => void;
  setNose: (nose: Nose) => void;
  setSpudName: (spudName: string) => void;
}
const SpudSelectionTab = (props: SpudSelectionTabProps) => {
  return (
    <div className="flex w-full h-full selectionTab">
      {props.activeSelectionTab === SpudSelectionView.POTATO && (
        <PotatoSelector
          potato={props.potato}
          legs={props.legs}
          setPotato={props.setPotato}
          eyes={props.eyes}
          spudName={props.spudName}
          arms={props.arms}
          mouth={props.mouth}
          nose={props.nose}
        />
      )}
      {props.activeSelectionTab === SpudSelectionView.EYES && (
        <EyesSelector
          eyes={props.eyes}
          setEyes={props.setEyes}
          potato={props.potato}
          legs={props.legs}
          spudName={props.spudName}
          arms={props.arms}
          mouth={props.mouth}
          nose={props.nose}
        />
      )}
      {props.activeSelectionTab === SpudSelectionView.LEGS && (
        <LegsSelector
          legs={props.legs}
          setLegs={props.setLegs}
          potato={props.potato}
          spudName={props.spudName}
          arms={props.arms}
          eyes={props.eyes}
          mouth={props.mouth}
          nose={props.nose}
        />
      )}
      {props.activeSelectionTab === SpudSelectionView.ARMS && (
        <ArmsSelector
          arms={props.arms}
          setArms={props.setArms}
          potato={props.potato}
          legs={props.legs}
          spudName={props.spudName}
          eyes={props.eyes}
          mouth={props.mouth}
          nose={props.nose}
        />
      )}
      {props.activeSelectionTab === SpudSelectionView.MOUTH && (
        <MouthSelector
          mouth={props.mouth}
          setMouth={props.setMouth}
          potato={props.potato}
          legs={props.legs}
          spudName={props.spudName}
          eyes={props.eyes}
          arms={props.arms}
          nose={props.nose}
        />
      )}
      {props.activeSelectionTab === SpudSelectionView.NOSE && (
        <NoseSelector
          nose={props.nose}
          setNose={props.setNose}
          potato={props.potato}
          legs={props.legs}
          spudName={props.spudName}
          eyes={props.eyes}
          arms={props.arms}
          mouth={props.mouth}
        />
      )}
      {props.activeSelectionTab === SpudSelectionView.NAME && (
        <NameSelector
          spudName={props.spudName}
          setSpudName={props.setSpudName}
          eyes={props.eyes}
          potato={props.potato}
          legs={props.legs}
          arms={props.arms}
          mouth={props.mouth}
          nose={props.nose}
        />
      )}
    </div>
  );
};

interface UpdateSpudProps {
  model: BlockModel;
  done: (data: BlockModel) => void;
}

const UpdateSpud: React.FC<UpdateSpudProps> = ({ model, done }) => {
  const [potato, setPotato] = useState<Potato>("russet");
  const [eyes, setEyes] = useState<Eyes>("");
  const [arms, setArms] = useState<Arms>("");
  const [mouth, setMouth] = useState<Mouth>("");
  const [nose, setNose] = useState<Nose>("");
  const [legs, setLegs] = useState<Legs>("");
  const [spudName, setSpudName] = useState("");
  const [activeSelectionTab, setActiveSelectionTab] = useState(
    SpudSelectionView.POTATO
  );
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
    <div className="flex flex-col items-center h-full w-full ">
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
      <div className="absolute bottom-0 flex flex-col items-center w-10/12">
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

const PotatoPersonality = (props: InnerSpudProps) => {
  const { potato, eyes, arms, legs, mouth, nose } = props;
  let chapters = [];
  chapters.push(<p className="menu-item">Love Languages</p>)
  const love = `Your major love languages are  ${loveLanguage[potato].language}. ${loveLanguage[potato].def}`
  chapters.push(<p>{love}</p>);
  if (eyes.length) {
    chapters.push(<p className="menu-item">Secret Shame</p>)
    const secret = `Your secret shame is that ${secretShame[eyes].secret}. ${secretShame[eyes].def}`
    chapters.push(<p>{secret}</p>);
  }
  if (nose.length) {
    chapters.push(<p className="menu-item">Besties</p>)
    const bestie = `Your bff is ${bff[nose].bff}. ${bff[nose].def}`
    chapters.push(<p>{bestie}</p>);
  }
  if (mouth.length) {
    chapters.push(<p className="menu-item">Favorite Food</p>)
    const food = `Your fave snack is ${cuisine[mouth].food}. ${cuisine[mouth].def}`
    chapters.push(<p>{food}</p>);
  }
  if (legs.length) {
    chapters.push(<p className="menu-item">Happy Place</p>)
    const secret = `Your happy place is ${happyPlace[legs].place}. ${happyPlace[legs].def}}`
    chapters.push(<p>{secret}</p>);
  }
  if (eyes.length) {
    chapters.push(<p className="menu-item">Horoscope</p>)
    const future = `Your week will be defined by ${horoscope[arms].future}. ${horoscope[arms].def}`
    chapters.push(<p>{future}</p>);
  }
  if (!eyes.length || !nose.length || !mouth.length || !legs.length || !arms.length){
    chapters.push(<p>♥ auntie makes her best forecasts when choices are made for every potato feature ♥</p>)
  }
  return (
    <div className="text-center">
      <p className="text-2xl text-white mt-1">♥ forecast ♥</p>
      <div className="bg-white rounded-3xl p-2 tater tracking-wide m-2 overflow-y-scroll h-3/4 max-h-72">
        {chapters}
      </div>
    </div>
  );
};
type Definition = {
  [keyword: string]: string;
  def: string;
};

interface PotatoInfo {
  [potato: Potato]: Definition;
}
const loveLanguage: PotatoInfo = {
  russet: {
    language: "acts of service and quality time",
    def: "You're a classic spud who wants to know that your fellow tuber is loyal to you as you are to them.",
  },
  yukon: {
    language: "receiving gifts and words of affirmation",
    def: "You are a high value spud and you expect high value treatment. Loneliness doesn't scare you as you already treat yourself to a glamorous lifestyle.",
  },
  lilRed: {
    language: "words of affirmation and quality time",
    def: "Is your tuber going to be there for you? Are they really though? You care deeply for those in your circle and like to know that that care is reciprocated.",
  },
  sweetPurps: {
    language: "physical touch and quality time",
    def: "You are a sensual spud, and you are deeply romantic. You are loyal and enjoy treating your partner as royalty.",
  },
  Okinawa: {
    language: "acts of service and quality time",
    def: "To you the most powerful act of love is simply being there. Your ideal date is enjoying meal that was prepared together, and you probably pack a mean picnic.",
  },
  yam: {
    language: "physical touch and words of affirmation",
    def: "Listen, you put a lot of work into being this fabulous and you just want to make sure that fabulousness is gonna be appreciated, okay?",
  },
  chip: {
    language: "words of affirmation receiving gifts",
    def: "Theres nothing wrong with being a little fragile. The gentles souls are there to nurture. You need a tuber thats gonna provide some comfort and safety from this cruel world!",
  }
};

interface EyeInfo {
  [eye: Eyes]: Definition;
}
const secretShame: EyeInfo = {
  babyEyes: {
    secret: "you lie about your age",
    def: "You are secretly not old enough to drink in bars, and participate in military activities but those are your favorite things to do. You cant imagine a life where the truth has come out.",
  },
  chill: {
    secret: "you still talk to your ex",
    def: "Yep you still talk to them. You're not even sure why you do it. You may not even like the person, but something deep down inside you still needs their approval.",
  },
  crybaby: {
    secret: "you can be manipulative",
    def: "This quality actually kind of scares you, because you try your best to live true to your morals. You know its messed up to screw with people, but the problem is that you usually don't know that your doing it until the damage is done. Honestly though? Don't sweat it. You want to know what another word for manipulation is? Leadership.",
  },
  dead: {
    secret: "you care ALOT about what others think about you",
    def: "There is just something about you that makes you so likable, even though you don't really try at all. JK you try super hard, and spend all your free time perfecting the details of your image, just so that when people notice them, you can casually brush it off like they're accidental.",
  },
  determined: {
    secret: "you are delusional",
    def: "Hey, someone needs to keep moral up around here. Its a shit-show! But you cant deal with that right now-or ever! So lets just play nice and just push, push, push it down people. Ok...We got this guys!",
  },
  diabolical: {
    secret: "you are a sociopath",
    def: "Look you're the spud that delivers. The worlds not always a pretty place, but results are demanded, and someone has to take in the facts and do the dirty work regardless of who gets hurt. But for some reason you are always volunteering to be that person?",
  },
  entertainer: {
    secret: "you are a fallen angel",
    def: "Im sorry spud, but someone hurt you. You might act all cool and unbothered but you're just keeping it strong to set an example to other hurt spuds. Thanks for doing what you do homie. We need taters like you.",
  },
  flirt: {
    secret: "you are shallow",
    def: "Look your not dumb, you just don't care about smart people stuff. Life is short and there is nothing wrong with being happy and having fun. Ignore the haters. You're to pretty for them anyway.",
  },
  glamVamp: {
    secret: "you just farted",
    def: "You let them blame the poor ugly spud, but I know it was you. WTH did you eat? Wow, well that explains it. You know you shouldn't eat that. I get it, but you shouldn't have let someone take the fall for you. You're a lowkey bully for that.",
  },
  iconEyes: {
    secret: "you hate the elderly",
    def: "Level with me tater, you know it's messed up and there is nothing they can do about it. You just lack patience and they are slow, smelly, and stupid. You're not a monster though, so you keep these thoughts to yourself and dread the day you join them.",
  },
  insistent: {
    secret: "you do not understand politics -even a little bit",
    def: `Bruh its an election year and everyone is talking bout it. But every time you try to understand the system I swear, they just keep adding more complicated titles. It's ok, spuddy. Just let the other taters talk.`,
  },
  pathetic: {
    secret: "you are an incorrigible gossip",
    def: "You have always been so friendly, kind, and understanding with all the other taters. Thats why you know all their secrets, hehehe! Only a select circle knows this side of you. Every time someone comes to you for support, you are there for them, and score, because later you get to go back to the squad and tell them EVERYTHING.",
  },
  ready: {
    secret: "you have a whole lot of depression",
    def: "You are so fun to be around. You are best spuddies with almost everyone you meet. And sometimes you literally cannot think of one thing worth living for. Them I guess? You cant fathom inconveniencing people with with your sadness or your absence so, in the social cage your remain indefinitely.",
  },
  spideyEyes: {
    secret: "you are secretly Spider Man",
    def: "No-one thought to check in on the potatoes. Amongst them hiding, all this time, was the one and only Spider Man. Pretty rad if you ask me.",
  },
  trollEyes: {
    secret: "you would do ANYTHING to get the life you want",
    def: "Would you sabotage a best friend? Yup. Would you sell your pet to a research facility? As long as no-one found out. What?? You only get one life, shouldn't it be the life you want? Who cares how you have to get there? Thats what therapy is for;)",
  },
  Yang: {
    secret: "you have disgusting eating habits",
    def: "People perceive you as all fierce and pretty but the reason you enjoy your privacy is because you are GROSS. You are messy in every way and other potatoes find it disturbing how you will leave things out and nibble at them. But look, if thats how you want to live your life, we get it. You deserve your messy-face-safe-place. Do you<3",
  },
};

interface NoseInfo {
  [nose: Nose]: Definition;
}
const bff: NoseInfo = {
  bandaid: {
    bff: "your pet",
    def: "You raised them from a baby. You used to be all each other had. Things are better now, but this little animal is the purest love that exists. You love your baby, and they are with you always. ",
  },
  beak: {
    bff: "your personal assistant",
    def: "Yes you have a personal assistant, and they are your best friend. As a workaholic, this is the person that you spend the most time with, and you have kept this one for so long, because they are so good at their job. You have secretly are deeply in love with them and have willed 50% of your fortune to them. They see you, as an OK boss.",
  },
  carrot: {
    bff: "your mom",
    def: "You love your mommy and thats ok. It a cruel world, and she takes the time to understand you.",
  },
  frysWithThat: {
    bff: "your formal rival",
    def: "Yall literally thought you hated each other, until you matured, and realized that there can be more than one baddy. Ya'll are thick as thieves in the present, and you cant believe how luck you are to have each other.",
  },
  gothSeptum: {
    bff: "an old lady at the bus stop",
    def: "Cheryl is so wise, and you think she might even be a witch. You are not sure if other people can see her, but you hope they can because she is a real one, and she had had your back every weekday morning since you started high school.",
  },
  liar: {
    bff: "your sugar momma",
    def: "You live in a lavish apartment, wear the finest clothes, and want for nothing. She has mad sure of this and all she expects in return is 100% of your time and attention. The results are natural.",
  },
  mustachio: {
    bff: "your brother",
    def: "You said, brother, lets move from our home country to Japan, and he said yes brother. Lets go! Then you said brother, lets start a plumbing business. And he said yes brother. Lets do it! You said brother lets reside in the Mushroom Kingdom and save Princess Peach from the evil Bowzer. And he said, what? But still he followed. He is your best bro for life.",
  },
  quirkyAndUnique: {
    bff: "instagram",
    def: "You are a big time social media addict, and this addiction has cost you countless relationships. And one point you found yourself alone, with nothing but your clout to show for it. Eventually you found some fellow addicts that tolerate your behavior, as they do the same things. You spent almost all your free  time with your new tribe, but your number one bestie will always be the feed.",
  },
  roughNose: {
    bff: "your lover",
    def: "You are mostly work and hobbies. You never gave much though to people until they came along. They saw you and accepted you and together you experience the magic this world has to offer.",
  },
  thicNose: {
    bff: "childhood bestie",
    def: "Yall have been besties since the beginning of time. You grew together and probably had a rough patch at one point. You almost lost the friendship. One day you realized how rare true friends are in this world, and these days you're as close as ever. They are the only person permitted to challenge you, because at the end of the day they basically are you.",
  },
  thinNose: {
    bff: "your comfort object",
    def: "Is it a doll, is it a hobby tool? All I know is that its not a person. People tend be complex and hard to get along with. You prefer the company of yourself and when forced to be with others you will bring this object with you for some stability.",
  },
  trollNose: {
    bff: "your little workers",
    def: "You are actually a very good friend who takes good care of your people, but you can definitely be a little bossy. You can also be mean and judgmental, people know this about you but still want to be friends with you because the benefits outweighs the costs.",
  },
};

interface MouthInfo {
  [mouth: Mouth]: Definition;
}
const cuisine: MouthInfo = {
  beard: {
    food: "ice cream",
    def: `You like to hit the parlor "on a whim" (every summer evening) with your loved ones.`,
  },
  bling: {
    food: "hot Cheetos",
    def: "Your guilty-pleasure is family sized bag in one sitting while watching your fave show. If there is cream cheese in the house, you're dipping them all in that.",
  },
  braces: {
    food: "takoyaki",
    def: "You always kind of avoided it, until you split some with a friend at a restaurant, now you are OBSESSED!",
  },
  buckteeth: {
    food: "crabby patties",
    def: "You love them so much that you went and got a job at the Krusty Krab. You fiend!",
  },
  deadmouth: {
    food: "ganjang gaejang",
    def: "Ganjang gaejang (Crab preserved in soy sauce) all day baby.",
  },
  drool: {
    food: "rubber",
    def: "Its more about the chewing than the eating. Just feels good.",
  },
  fangs: {
    food: "blood",
    def: "You don't care if its virgin blood because you're not sexist. You do appreciate a good 0- though.",
  },
  fruit: {
    food: "sour straws",
    def: "You like most candies but you LOVE sour candies and gummies the most.",
  },
  gritNBearIt: {
    food: "Burmese takeout",
    def: "You love the curries and the tea leaf salad, but for you the star of the show is the paratha dipped in that curry sauce? Yum.",
  },
  puppetMouth: {
    food: "coffee",
    def: "Literally who has time to eat in this business?",
  },
  sharkMouth: {
    food: "clownfish",
    def: "You are a nice shark. Not a mindless eating machine. But maybe just one bite?",
  },
  singing: {
    food: "nachos",
    def: "You like a great big plate at the end of a long day. Extra messy, with all the fixings please!",
  },
  smile: {
    food: "bbq chicken",
    def: "Wow when its just right? Theres really nothing like a good roatissie chicky.",
  },
  wut: {
    food: "weed rat stew",
    def: "You don't want to brag, but you make a mean weed rat stew.",
  },
  yikes: {
    food: "ramen",
    def: "You like to go have a beer and a nice bowl of ramen after a tough weekday.",
  },
};

interface LegInfo {
  [legs: Legs]: Definition;
}
const happyPlace: LegInfo = {
  ballet: {
    place: "the studio",
    def: "It's also your sad place, but you are a dedicated tater, darnit!",
  },
  chadLegs: {
    place: "the gym",
    def: "Theres nothing like the sights, sounds, and smells of home.",
  },
  crab: {
    place: "Florida",
    def: "Listen they can keep their Mediterranean destinations and their tropical getaways. You know where the real paradise is.",
  },
  diaper: {
    place: "your mothers womb",
    def: "Take me back, am I right?",
  },
  goth: {
    place: "TJ Maxx",
    def: "Its the end-all be-all of discounted home-goods stores. It should be everyones happy place.",
  },
  handy: {
    place: "Costco",
    def: "Unbeatable quality to price ratio. The place gives you hope for this world.",
  },
  islandBoy: {
    place: "your hometown",
    def: "Everyone worships you there. What is better than that?",
  },
  jeans: {
    place: "the library",
    def: "Now shush!",
  },
  parachute: {
    place: "the passenger side of your best friend's ride",
    def: "You like trying to holler at a me to see if I want your number or want to give you mine, or if I want to meet you somewhere or if I want some of your time",
  },
  skater: {
    place: "the park",
    def: "You can skate there, and watch the birds, and sometime the ice cream and comes!",
  },
  snowBottom: {
    place: "Las Vegas ice bar",
    def: "Its just an amazingly sophisticated place. A beacon of civilization in an overheated desert of consumption.",
  },
  spideyJump: {
    place: "a good lurking vantage point",
    def: "Who doesn't love a good lurk. Tops of buildings, outside your neighbors window, and many other normal places!",
  },
  trollLegs: {
    place: "on stage",
    def: "You're like to be there to give the people what they need(you)!",
  },
};

interface ArmInfo {
  [arms: Arms]: Definition;
}
const horoscope: ArmInfo = {
  arrrgh: {
    future: "chaos",
    def: "You are in for a doozy of a week. Leave extra time for your tasks and take  any surprises with a level and you will come out on top. Be sure to get lots of rest. You will need the energy.",
  },
  chadArms: {
    future: "embarrassment",
    def: "You have been working so hard lately, and all that is soon to pay off with some well deserved recognition. This new attention will bring to light a minor embarrassment. Take it lightly and your favor will continue. Allowing ego cloud your judgement will have dire consequences.",
  },
  gothArms: {
    future: "challenge",
    def: "This week will present an opportunity for you to prove yourself in a matter that is important to you. Keep an extra helpful attitude this week and you will be just fine.",
  },
  gunna: {
    future: "peace",
    def: "A long standing conflict will reach conclusion early in the week. Put the pistols away and show your allies some gratitude.",
  },
  kawaii: {
    future: "loneliness",
    def: "This week you will be primarily in the company of yourself. Take this little break as an opportunity to contemplate your needs and cater to them.",
  },
  measure: {
    future: "friendship",
    def: "You will acquire a new friend this week. This new alliance will set you up for the future you have been dreaming of. This week say yes to invitations you would usually be unsure of and strive to connect with those in-front of you.",
  },
  puppetArms: {
    future: "adventure",
    def: "You've been a little bored lately, but an adventurous opportunity will soon come you way. When destiny calls, practice saying yes!",
  },
  rockon: {
    future: "haters",
    def: "You have been doing well, but your success has caught the attention of ill wishers. Do not engage with them, for they wish to tarnish your image.",
  },
  slothCoffee: {
    future: "closure",
    def: "A long standing mystery in your life will finally come to conclusion. One less thing to worry about:)",
  },
  soup: {
    future: "good fortune",
    def: "Your generous nature is again bringing you blessings. Accept the gifts that people in your life are bringing you, you deserve them.",
  },
  spideyGrab: {
    future: "safety",
    def: "A storm of chaos approaches your world, but you will be unaffected by these powers. You have chosen your position wisely. Be sure to stay out of the mess.",
  },
  sticks: {
    future: "love",
    def: "A new love interest is set to enter your life. Weather or not you will entertain this interest, is your decision to make.",
  },
  strong: {
    future: "new problems",
    def: "The past few weeks have been difficult for you, and this one is no different. However, if you navigate this one wisely, your fortune will soon change.",
  },
  violin: {
    future: "recognition",
    def: "Although you may sometimes feel unappreciated, powerful people have taken notice of you and are singing your praises. Keep up the good work and you will not go unrewarded.",
  },
  yay: {
    future: "unwanted attention",
    def: "This week people are going to notice you, and you are going to hate it. Try to be kind to them, as they mean no harm. The embarrassment will pass soon, and your patience wont be forgotten.",
  },
};


const DisplaySpud: React.FC<InnerSpudProps> = ({
  eyes,
  potato,
  spudName,
  arms,
  legs,
  mouth,
  nose,
}) => {
  const [view, setView] = useState("headshot");

  const toggleView = () =>
    setView((prevView) => (prevView === "headshot" ? "info" : "headshot"));

  return (
    <div className="relative flex flex-col items-center h-full w-full rounded-xl">
      {view === "headshot" ? (
        <div className="flex flex-col items-center w-10/12">
          <InnerSpud
            mouth={mouth}
            nose={nose}
            potato={potato}
            eyes={eyes}
            spudName={spudName}
            arms={arms}
            legs={legs}
          />
              <img
              src={fortune}
              alt="fortune teller"
              className="z-30 absolute bottom-0"
            />
          <p className="potato-p text-center my-2 mt-10 z-50 bg-purple-600 rounded-full bg-opacity-40" onClick={toggleView}>
          ♥ horoscope ♥
          </p>
        </div>
      ) : (
        <div className="bg-black h-96 rounded">
          <PotatoPersonality
            potato={potato}
            eyes={eyes}
            spudName={spudName}
            arms={arms}
            legs={legs}
            mouth={mouth}
            nose={nose}
          />
          <p className="text-center my-3 text-white" onClick={toggleView}>
            headshot
          </p>
        </div>
      )}
    </div>
  );
};

export const TatergangsFeedComponent = ({ model }: FeedComponentProps) => {
  const { eyes, potato, spudName, arms, legs, mouth, nose } = model.data;
  return (
    <DisplaySpud
      mouth={mouth}
      nose={nose}
      eyes={eyes}
      potato={potato}
      spudName={spudName}
      arms={arms}
      legs={legs}
    />
  );
};

export const TatergangsComposerComponent = ({
  model,
  done,
}: ComposerComponentProps) => {
  return (
    <div className="h-full">
      <UpdateSpud done={done} model={model} />
    </div>
  );
};
