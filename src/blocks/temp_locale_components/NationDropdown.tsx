import { Select } from "antd";
import { useState } from "react";

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

const idArray = Object.keys(nations)

export const NationDropdown = () => {
    const [ guess, setGuess ] = useState<Nation>(nations[0])

    const selectionHandler = (nation: Nation) => {
        console.log(nation.name)
        setGuess(nation)

    }


    
    return(
        <div>

            This is the NationDropDown:

            <Select 
                style={{ width: 200 }}
                // Set the default value to no country
                onChange = { (id) => selectionHandler(nations[id]) }
                >
                {nations.map( (nation) => {
                    const optionValue = nation.flag + " " + nation.name
                    return(
                        <Select.Option key = {nation.id} value = {nation.id}> {optionValue}  </Select.Option>
                    )
                })}
            </Select>

                
            
        </div>
    )
}