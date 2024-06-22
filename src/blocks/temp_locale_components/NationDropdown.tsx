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
  al: {
    "iso2": "al",
    "iso3": "alb",
    "name": "Albania",
    "capital": "Tirana",
    "flag": "🇦🇱",
    "lat": 41.3275,
    "lng": 19.8189
  },
  dz: {
    "iso2": "dz",
    "iso3": "dza",
    "name": "Algeria",
    "capital": "Algiers",
    "flag": "🇩🇿",
    "lat": 36.7529,
    "lng": 3.042
  },
  ad: {
    "iso2": "ad",
    "iso3": "and",
    "name": "Andorra",
    "capital": "Andorra la Vella",
    "flag": "🇦🇩",
    "lat": 42.5078,
    "lng": 1.5211
  },
  ao: {
    "iso2": "ao",
    "iso3": "ago",
    "name": "Angola",
    "capital": "Luanda",
    "flag": "🇦🇴",
    "lat": -8.839,
    "lng": 13.2894
  },
}

async function fetchNationData(sourceUrl: string): Promise<{ [key: string]: Nation }> {
  try {
    // Fetch the JSON data
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error('Error during fetchNationData: Response not ok.');
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
  nationArray.sort((a, b) => a.name.localeCompare(b.name));
  return nationArray;
}

const initialWorldArray = createNationArray(initialWorldDictionary)


const searchNations = (nations: Nation[], typedInput: string, callback: Function) => {
  const cleanedInput = typedInput.toLowerCase()
  const filteredNations = nations.filter(nation =>
    nation.name.toLowerCase().includes(cleanedInput) ||
    nation.iso2.toLowerCase().includes(cleanedInput) ||
    nation.iso3.toLowerCase().includes(cleanedInput)
  );
  callback(filteredNations);
  console.log(`searchNations completed with: ${cleanedInput ? cleanedInput : "(blank query)"}. ${filteredNations.length} "values returned.`)
}

export const NationDropdown = () => {
  const [allNations, setAllNations] = useState<Nation[]>(initialWorldArray)
  const [filteredNations, setFilteredNations] = useState<Nation[]>(allNations)

  // "input" here means user typing text into the search bar
  const inputHandler = (inputText: string) => {
    searchNations(allNations, inputText, setFilteredNations)
  }

  // "selection" here means user clicking a country as their guess, or highlighting it and pressing Enter
  const selectionHandler = (id: string) => {
    let selectedNation = allNations.find(nation => nation.iso2 === id)
    if (!selectedNation) throw new Error("selectionHandler called with invalid ISO2 code");
    else {
      console.log("Selection made! Selected country is:", selectedNation.name)
      /// REPLACE THIS CONSOLE.LOG WITH SOME KIND OF CHECK GUESS FUNCTION
    }
  }

  useEffect(() => {
    const init = async () => {
      const fullNationList = createNationArray(await fetchNationData(nationDataUrl))
      setAllNations(fullNationList)
      setFilteredNations(fullNationList)
    }
    init()
  },
    [])


  const displayFilteredNations = filteredNations.map(
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
        {displayFilteredNations}
      </Select>
    </div>
  )
}

