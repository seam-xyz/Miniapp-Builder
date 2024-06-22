import { Select } from "antd";
import { useState, useEffect } from "react";
const { Option } = Select;

type Nation = {
  iso2: string;
  iso3: string;
  name: string;
  capital: string;
  flag: string;
  lat: number;
  lng: number;
}

const nationDataUrl = 'https://raw.githubusercontent.com/yablochko8/country-lists/main/world.json';

const initialWorldDictionary: { [key: string]: Nation } = {
  af: {
    "iso2": "af",
    "iso3": "afg",
    "name": "Afghanistan",
    "capital": "Kabul",
    "flag": "🇦🇫",
    "lat": 34.5281,
    "lng": 69.1723
  },
  am: {
    "iso2": "am",
    "iso3": "arm",
    "name": "Armenia",
    "capital": "Yerevan",
    "flag": "🇦🇲",
    "lat": 40.1792,
    "lng": 44.4991
  },
  az: {
    "iso2": "az",
    "iso3": "aze",
    "name": "Azerbaijan",
    "capital": "Baku",
    "flag": "🇦🇿",
    "lat": 40.4093,
    "lng": 49.8671
  },
  bh: {
    "iso2": "bh",
    "iso3": "bhr",
    "name": "Bahrain",
    "capital": "Manama",
    "flag": "🇧🇭",
    "lat": 26.2235,
    "lng": 50.5876
  },
  bd: {
    "iso2": "bd",
    "iso3": "bgd",
    "name": "Bangladesh",
    "capital": "Dhaka",
    "flag": "🇧🇩",
    "lat": 23.8103,
    "lng": 90.4125
  }
}

async function fetchNationData(sourceUrl: string): Promise<{ [key: string]: Nation }> {
  try {
    // Fetch the JSON data
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch world list.');
    }
    const dictionary: { [key: string]: Nation } = await response.json();
    return dictionary
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
    throw error;
  }
}

function createNationArray(dictionary: { [key: string]: Nation }): Nation[] {
    const nationArray: Nation[] = Object.values(dictionary);
    return nationArray;
}

const initialWorldArray = createNationArray(initialWorldDictionary)


const searchNations = (nations: Nation[], typedInput: string, callback: Function) => {
  // Maybe this would benefit from a timeout?
  const filteredNations = nations.filter(nation =>
    nation.name.toLowerCase().includes(typedInput.toLowerCase())
  );
  callback(filteredNations);
  console.log("searchNations completed with:", typedInput, callback)
}


export const NationDropdown = () => {
  const [allNations, setAllNations] = useState<Nation[]>(initialWorldArray)
  const [remainingNations, setRemainingNations] = useState<Nation[]>(allNations)
  const [guess, setGuess] = useState<Nation>(allNations[0])

  const inputHandler = (inputText: string) => {
    console.log("inputHandler called")
    searchNations(allNations, inputText, setRemainingNations)
    console.log(inputText)
  }


  useEffect(() => {
    const justDoThisNow = async () => {
      const fullNationList = createNationArray(await fetchNationData(nationDataUrl))
      console.log(fullNationList)
      setAllNations(fullNationList)
    }
    justDoThisNow()

  },

    [])

  const selectionHandler = (id: string) => {
    console.log("selectionHandler called")
    let selectedNation = allNations.find(nation => nation.iso2 === id)
    selectedNation = (selectedNation) ? selectedNation : allNations[0]
    setGuess(selectedNation)
    console.log("Selection made:", selectedNation.name)
    /// Trigger action that seeks result of Guess here
  }
  const options = remainingNations.map(
    (nation) => {
      const optionLabel = nation.flag + " " + nation.name
      return (
        <Option key={nation.iso2} value={nation.iso2}> {optionLabel}  </Option>
      )
    }
  )

  return (
    <div>
      <Select
        showSearch
        onSearch={inputText => inputHandler(inputText)}
        onChange={selectionHandler}
        style={{ width: 570 }}
        placeholder="Guess where?"
        filterOption={false}
      >
        {options}
      </Select>
    </div>
  )
}






// class SearchInput extends React.Component {
//   state = {
//     data: [],
//     value: undefined,
//   };

//   handleSearch = value => {
//     if (value) {
//       searchLocalData(value, data => this.setState({ data }));
//     } else {
//       this.setState({ data: [] });
//     }
//   };

//   handleChange = value => {
//     this.setState({ value });
//   };

//   render() {
//     const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
//     return (
//       <Select
//         showSearch
//         value={this.state.value}
//         placeholder={this.props.placeholder}
//         style={this.props.style}
//         defaultActiveFirstOption={false}
//         showArrow={false}
//         filterOption={false}
//         onSearch={this.handleSearch}
//         onChange={this.handleChange}
//         notFoundContent={null}
//       >
//         {options}
//       </Select>
//     );
//   }
// }

// ReactDOM.render(<SearchInput placeholder="input search text" style={{ width: 200 }} />, mountNode);
