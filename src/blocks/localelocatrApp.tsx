import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'

type Nation = {
  id: number;
  name: string;
  flag: string;
  lat: number;
  lng: number;
}

type NationDict = Record<number, Nation>;
const nations: NationDict = {
  1: {
    id: 1,
    name: "China",
    flag: "🇨🇳",
    lat: 0,
    lng: 0,
  },
  2: {
    id: 2,
    name: "United States",
    flag: "🇺🇸",
    lat: 0,
    lng: 0,
  },
  3: {
    id: 3,
    name: "India",
    flag: "🇮🇳",
    lat: 0,
    lng: 0,
  },
  4: {
    id: 4,
    name: "Japan",
    flag: "🇯🇵",
    lat: 0,
    lng: 0,
  },
  5: {
    id: 5,
    name: "Germany",
    flag: "🇩🇪",
    lat: 0,
    lng: 0,
  },
}

const randomNation = (): Nation => {
  const randomSeed = Math.random() * Object.keys(nations).length
  const index = Math.floor(randomSeed) + 1
  return nations[index]
}
















export default class localelocatrBlock extends Block {
  render() {
    return (
      <h1>localelocatr Block!</h1>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <div>
        <h1>Edit localelocatr Block!</h1>
        <div> and again again  </div>
        <p> jfieoaCJEWOIFNEIA HELLO</p>
        {randomNation().flag}

      </div>
    )
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}