import { Select } from "antd";
import React from "react";

import { useState } from "react";


const { Option } = Select;
// import querystring from "querystring";


type Nation = {
    id: number;
    name: string;
    flag: string;
    lat: number;
    lng: number;
  }
  
//   type NationDict = Record<number, Nation>;
  const nations = [
    {
      id: 1,
      name: "China",
      flag: "🇨🇳",
      lat: 0,
      lng: 0,
    },
    {
      id: 2,
      name: "United States",
      flag: "🇺🇸",
      lat: 0,
      lng: 0,
    },
    {
      id: 3,
      name: "India",
      flag: "🇮🇳",
      lat: 0,
      lng: 0,
    },
    {
      id: 4,
      name: "Japan",
      flag: "🇯🇵",
      lat: 0,
      lng: 0,
    },
    {
      id: 5,
      name: "Germany",
      flag: "🇩🇪",
      lat: 0,
      lng: 0,
    },
    {
        id: 6,
        name: "More Germany",
        flag: "🇩🇪",
        lat: 0,
        lng: 0,
      },
]





////////////////////////////////////////////////////////////////////////////////////
/////////////////////   THIS ABOVE THIS LINE IS ALL FROM THE MAIN APP FILE
////////////////////////////////////////////////////////////////////////////////////




const searchNations = (typedInput: string, callback: Function) => {
  // Maybe this would benefit from a timeout?
  const filteredNations = nations.filter(nation => 
      nation.name.toLowerCase().includes(typedInput.toLowerCase())
    );
  callback(filteredNations);
  console.log("searchNations completed with:", typedInput, callback)
}


export const NationDropdown = () => {
    const [ guess, setGuess ] = useState<Nation>(nations[0])
    const [ remainingNations, setRemainingNations] = useState<Nation[]>(nations)

    const inputHandler = (inputText: string) => {
      console.log("inputHandler called")
      searchNations(inputText, setRemainingNations)
      console.log(inputText)
    }

    const selectionHandler = (id: number) => {
      console.log("selectionHandler called")
      let selectedNation = nations.find(nation => nation.id === id)
      selectedNation = (selectedNation) ? selectedNation: nations[0]
      setGuess(selectedNation)
      console.log("Selection made:", selectedNation.name)
        /// Trigger action that seeks result of Guess here
    }
    const options = remainingNations.map(
      (nation) => {
        const optionLabel = nation.flag + " " + nation.name
        return(
          <Option key = {nation.id} value = {nation.id}> {optionLabel}  </Option>
        )
      }
    )

    return(
      <div>
        <Select 
          showSearch
          onSearch={inputText => inputHandler(inputText)}
          onChange={selectionHandler}
          style={{ width: 570 }}
          placeholder = "Guess where?"
          filterOption = {false}
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
