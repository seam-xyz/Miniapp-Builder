import { Select } from "antd";
import React, { useEffect } from "react";

import { useState } from "react";


const { Option } = Select;
// import querystring from "querystring";

const url = 'https://raw.githubusercontent.com/yablochko8/country-lists/main/world.json';

type Nation = {
  iso2: string;
  iso3: string;
  name: string;
  capital: string;
  flag: string;
  lat: number;
  lng: number;
}


async function fetchNationData(): Promise<{ [key: string]: Nation }> {
  try {
    // Fetch the JSON data
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch world list.');
    }
    const data: Nation[] = await response.json();

    // Create a dictionary object
    const nations: { [key: string]: Nation } = {};
    data.forEach((nation) => {
      nations[nation.iso2] = nation;
    });

    return nations;
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
    throw error;
  }
}


async function createNationArray(): Promise<Nation[]> {
  try {
    // Fetch the JSON data
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch world list.');
    }
    const data: { [key: string]: Nation } = await response.json();
    const nationArray: Nation[] = Object.values(data);
    return nationArray;
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
    throw error;
  }
}
const staticStarterWorldDictionary = {
  cn: {
    "iso2": "cn",
    "iso3": "chn",
    "name": "China",
    "capital": "Beijing",
    "flag": "🇨🇳",
    "lat": 39.9042,
    "lng": 116.4074
  },
  br:
  {
    "iso2": "br",
    "iso3": "bra",
    "name": "Brazil",
    "capital": "Brasília",
    "flag": "🇧🇷",
    "lat": -15.7942,
    "lng": -47.8825

  }
}


const staticStarterWorldArray = [

  {
    "iso2": "cn",
    "iso3": "chn",
    "name": "China",
    "capital": "Beijing",
    "flag": "🇨🇳",
    "lat": 39.9042,
    "lng": 116.4074
  },
  {
    "iso2": "br",
    "iso3": "bra",
    "name": "Brazil",
    "capital": "Brasília",
    "flag": "🇧🇷",
    "lat": -15.7942,
    "lng": -47.8825

  }
]



////////////////////////////////////////////////////////////////////////////////////
/////////////////////   THIS ABOVE THIS LINE IS ALL FROM THE MAIN APP FILE
////////////////////////////////////////////////////////////////////////////////////


const searchNations = (nations: Nation[], typedInput: string, callback: Function) => {
  // Maybe this would benefit from a timeout?
  const filteredNations = nations.filter(nation =>
    nation.name.toLowerCase().includes(typedInput.toLowerCase())
  );
  callback(filteredNations);
  console.log("searchNations completed with:", typedInput, callback)
}


export const NationDropdown = () => {
  const [allNations, setAllNations] = useState<Nation[]>(staticStarterWorldArray)
  const [remainingNations, setRemainingNations] = useState<Nation[]>(allNations)
  const [guess, setGuess] = useState<Nation>(allNations[0])

  const inputHandler = (inputText: string) => {
    console.log("inputHandler called")
    searchNations(allNations, inputText, setRemainingNations)
    console.log(inputText)
  }


  useEffect(() => {
    const justDoThisNow = async () => {
      const fullNationList = await createNationArray()
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
        style={{ width: 400 }}
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
