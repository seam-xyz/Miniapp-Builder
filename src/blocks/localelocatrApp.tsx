import Block from './Block'
import { BlockModel } from './types'
import './BlockStyles.css'
import React, { useEffect, useRef, useState } from "react";
import { GoogleMap } from "@react-google-maps/api";
import { LoadScript } from "@react-google-maps/api";
import { OutputFormat, setDefaults } from 'react-geocode';
import { Select } from "antd";
import { Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { CardActionArea } from '@mui/material';

const { Option } = Select;

const try_api_Key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
if (!try_api_Key) {
  throw new Error("API Key Missing");
}
const api_Key: string = try_api_Key ? try_api_Key : "API_KEY_MISSING"

type Nation = {
  iso2: string;
  iso3: string;
  name: string;
  capital: string;
  flag: string;
  lat: number;
  lng: number;
}

setDefaults({
  key: api_Key,
  language: "en",
  outputFormat: OutputFormat.XML
});

const nationDataUrl = 'https://raw.githubusercontent.com/yablochko8/country-lists/main/world.json';
// Seam team - feel free to replace this with a long-term home for this object

const initialWorldDictionary: { [key: string]: Nation } = {
  us: {
    "iso2": "us",
    "iso3": "usa",
    "name": "United States",
    "capital": "Washington, D.C.",
    "flag": "🇺🇸",
    "lat": 38.9072,
    "lng": -77.0369
  },
  ca: {
    "iso2": "ca",
    "iso3": "can",
    "name": "Canada",
    "capital": "Ottawa",
    "flag": "🇨🇦",
    "lat": 45.4215,
    "lng": -75.6972
  },
  mx: {
    "iso2": "mx",
    "iso3": "mex",
    "name": "Mexico",
    "capital": "Mexico City",
    "flag": "🇲🇽",
    "lat": 19.4326,
    "lng": -99.1332
  },
  gb: {
    "iso2": "gb",
    "iso3": "gbr",
    "name": "United Kingdom",
    "capital": "London",
    "flag": "🇬🇧",
    "lat": 51.5074,
    "lng": -0.1278
  },
  fr: {
    "iso2": "fr",
    "iso3": "fra",
    "name": "France",
    "capital": "Paris",
    "flag": "🇫🇷",
    "lat": 48.8566,
    "lng": 2.3522
  },
  it: {
    "iso2": "it",
    "iso3": "ita",
    "name": "Italy",
    "capital": "Rome",
    "flag": "🇮🇹",
    "lat": 41.9028,
    "lng": 12.4964
  },
  nl: {
    "iso2": "nl",
    "iso3": "nld",
    "name": "Netherlands",
    "capital": "Amsterdam",
    "flag": "🇳🇱",
    "lat": 52.3676,
    "lng": 4.9041
  },
  be: {
    "iso2": "be",
    "iso3": "bel",
    "name": "Belgium",
    "capital": "Brussels",
    "flag": "🇧🇪",
    "lat": 50.8503,
    "lng": 4.3517
  },
  pl: {
    "iso2": "pl",
    "iso3": "pol",
    "name": "Poland",
    "capital": "Warsaw",
    "flag": "🇵🇱",
    "lat": 52.2297,
    "lng": 21.0122
  },
  se: {
    "iso2": "se",
    "iso3": "swe",
    "name": "Sweden",
    "capital": "Stockholm",
    "flag": "🇸🇪",
    "lat": 59.3293,
    "lng": 18.0686
  },
  no: {
    "iso2": "no",
    "iso3": "nor",
    "name": "Norway",
    "capital": "Oslo",
    "flag": "🇳🇴",
    "lat": 59.9139,
    "lng": 10.7522
  },
  dk: {
    "iso2": "dk",
    "iso3": "dnk",
    "name": "Denmark",
    "capital": "Copenhagen",
    "flag": "🇩🇰",
    "lat": 55.6761,
    "lng": 12.5683
  },
  fi: {
    "iso2": "fi",
    "iso3": "fin",
    "name": "Finland",
    "capital": "Helsinki",
    "flag": "🇫🇮",
    "lat": 60.1695,
    "lng": 24.9355
  },
  ie: {
    "iso2": "ie",
    "iso3": "irl",
    "name": "Ireland",
    "capital": "Dublin",
    "flag": "🇮🇪",
    "lat": 53.3498,
    "lng": -6.2603
  },
  pt: {
    "iso2": "pt",
    "iso3": "prt",
    "name": "Portugal",
    "capital": "Lisbon",
    "flag": "🇵🇹",
    "lat": 38.7223,
    "lng": -9.1393
  },
  gr: {
    "iso2": "gr",
    "iso3": "grc",
    "name": "Greece",
    "capital": "Athens",
    "flag": "🇬🇷",
    "lat": 37.9838,
    "lng": 23.7275
  },
  jp: {
    "iso2": "jp",
    "iso3": "jpn",
    "name": "Japan",
    "capital": "Tokyo",
    "flag": "🇯🇵",
    "lat": 35.6895,
    "lng": 139.6917
  },
  kr: {
    "iso2": "kr",
    "iso3": "kor",
    "name": "South Korea",
    "capital": "Seoul",
    "flag": "🇰🇷",
    "lat": 37.5665,
    "lng": 126.9780
  },
  tw: {
    "iso2": "tw",
    "iso3": "twn",
    "name": "Taiwan",
    "capital": "Taipei",
    "flag": "🇹🇼",
    "lat": 25.0330,
    "lng": 121.5654
  },
  hk: {
    "iso2": "hk",
    "iso3": "hkg",
    "name": "Hong Kong",
    "capital": "Hong Kong",
    "flag": "🇭🇰",
    "lat": 22.3193,
    "lng": 114.1694
  },
  th: {
    "iso2": "th",
    "iso3": "tha",
    "name": "Thailand",
    "capital": "Bangkok",
    "flag": "🇹🇭",
    "lat": 13.7563,
    "lng": 100.5018
  },
  id: {
    "iso2": "id",
    "iso3": "idn",
    "name": "Indonesia",
    "capital": "Jakarta",
    "flag": "🇮🇩",
    "lat": -6.2088,
    "lng": 106.8456
  },
  my: {
    "iso2": "my",
    "iso3": "mys",
    "name": "Malaysia",
    "capital": "Kuala Lumpur",
    "flag": "🇲🇾",
    "lat": 3.1390,
    "lng": 101.6869
  },
  sg: {
    "iso2": "sg",
    "iso3": "sgp",
    "name": "Singapore",
    "capital": "Singapore",
    "flag": "🇸🇬",
    "lat": 1.3521,
    "lng": 103.8198
  },
  au: {
    "iso2": "au",
    "iso3": "aus",
    "name": "Australia",
    "capital": "Canberra",
    "flag": "🇦🇺",
    "lat": -35.2809,
    "lng": 149.1300
  },
  nz: {
    "iso2": "nz",
    "iso3": "nzl",
    "name": "New Zealand",
    "capital": "Wellington",
    "flag": "🇳🇿",
    "lat": -41.2865,
    "lng": 174.7762
  },
  cl: {
    "iso2": "cl",
    "iso3": "chl",
    "name": "Chile",
    "capital": "Santiago",
    "flag": "🇨🇱",
    "lat": -33.4489,
    "lng": -70.6693
  },
  co: {
    "iso2": "co",
    "iso3": "col",
    "name": "Colombia",
    "capital": "Bogotá",
    "flag": "🇨🇴",
    "lat": 4.7110,
    "lng": -74.0721
  },
  pe: {
    "iso2": "pe",
    "iso3": "per",
    "name": "Peru",
    "capital": "Lima",
    "flag": "🇵🇪",
    "lat": -12.0464,
    "lng": -77.0428
  },
  za: {
    "iso2": "za",
    "iso3": "zaf",
    "name": "South Africa",
    "capital": "Pretoria",
    "flag": "🇿🇦",
    "lat": -25.7479,
    "lng": 28.2293
  },
  il: {
    "iso2": "il",
    "iso3": "isr",
    "name": "Israel",
    "capital": "Jerusalem",
    "flag": "🇮🇱",
    "lat": 31.7683,
    "lng": 35.2137
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
  ad: {
    "iso2": "ad",
    "iso3": "and",
    "name": "Andorra",
    "capital": "Andorra la Vella",
    "flag": "🇦🇩",
    "lat": 42.5078,
    "lng": 1.5211
  },
};


async function fetchNationData(sourceUrl: string): Promise<{ [key: string]: Nation }> {
  try {
    // Fetch the JSON data
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error('Error during fetchNationData: Response not ok.');
    }
    // Turn JSON data into a ts dictionary
    const dictionary: { [key: string]: Nation } = await response.json();
    return dictionary
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
    throw error;
  }
}

// Convert a Dictionary of Nation objects into an Array of Nation objects
function createNationArray(dictionary: { [key: string]: Nation }): Nation[] {
  const nationArray: Nation[] = Object.values(dictionary);
  nationArray.sort((a, b) => a.name.localeCompare(b.name));
  return nationArray;
}

// Starting data to set state before async function returns full response
// This also has a second function - the initial set of countries only 
// includes countries that have Streetview. Lots of countries do NOT have
// Streetview, so we don't want them selected as trueLocation.
const initialWorldArray = createNationArray(initialWorldDictionary)

// Search function for checking if user's typed text input matches a nation
const searchNations = (nations: Nation[], typedInput: string, callback: Function) => {
  const cleanedInput = typedInput.toLowerCase()
  const filteredNations = nations.filter(nation =>
    nation.name.toLowerCase().includes(cleanedInput) ||
    nation.iso2.toLowerCase().includes(cleanedInput) ||
    nation.iso3.toLowerCase().includes(cleanedInput) ||
    nation.capital.toLowerCase().includes(cleanedInput)
  );
  callback(filteredNations);
  console.log(`searchNations completed with: ${cleanedInput ? cleanedInput : "(blank query)"}. ${filteredNations.length} "values returned.`)
}

function NationDropdown({ onSelect }: { onSelect: Function }) {
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
      onSelect(selectedNation)
    }
  }

  // at first render we pull in a full list of nation data
  useEffect(() => {
    const init = async () => {
      const fullNationList = createNationArray(await fetchNationData(nationDataUrl))
      setAllNations(fullNationList)
      setFilteredNations(fullNationList)
    }
    init()
  },
    [])

  // "filtered" here means these are nations returned in search results
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
        placeholder="Where are you?"
        filterOption={false}
      >
        {displayFilteredNations}
      </Select>
    </div>
  )
}


const randomNation = (nations: Nation[]): Nation => {
  const randomIndex = Math.floor(Math.random() * nations.length)
  return nations[randomIndex]
}

//props -  latitude and longitude of two locations(in degrees)
//return - distance in km between the two given locations (straight line from point a to point b)
function calcDist(nation1: Nation, nation2: Nation) {

  function toRad(value: number) {
    // Converts numeric degrees to radians
    return value * Math.PI / 180
  }
  const lat1 = toRad(nation1.lat)
  const lat2 = toRad(nation2.lat)
  const lng1 = toRad(nation1.lng)
  const lng2 = toRad(nation2.lng)
  let R = 6371; // km
  let dLat = lat2 - lat1
  let dLng = lng2 - lng1

  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  return d;
}


//converts KM to miles
function convertKmToMiles(km: number) {
  return km * 0.621371;
}

const containerStyle = {
  width: '90%',
  height: '700px',
};

const trueLocation: Nation = randomNation(initialWorldArray)


async function getGeocodeResponse() {
  const geocodeAPI = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + trueLocation.lat + "," + trueLocation.lng + "&key=" + api_Key
  try {
    const response = await fetch(geocodeAPI);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}


const StreetView: React.FC = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const streetViewRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    if (isMapLoaded && mapRef.current) {
      // Create a StreetViewPanorama instance and link it to the map
      streetViewRef.current = new google.maps.StreetViewPanorama(
        document.getElementById('street-view') as HTMLElement,
        {
          position: trueLocation,
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
          addressControl: false,
        }
      );
      mapRef.current.setStreetView(streetViewRef.current);

      // Hide the map after initializing Street View
      setShowMap(false);

      getGeocodeResponse()
        .then(response => {
          const data = response.results
          console.log(data)
          const streetAddress = data[0].formatted_address
          console.log(streetAddress);
          // Process the response here
        })
        .catch(error => {
          console.error('Error fetching the geocode data:', error);
        });
    }
  }, [isMapLoaded]);

  return (
    <LoadScript googleMapsApiKey={api_Key}>
      <div id="street-view" style={containerStyle} className='flex flex-col justify-center'></div>


      {showMap && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={trueLocation}
          zoom={14}
          onLoad={(map) => {
            mapRef.current = map;
            setIsMapLoaded(true);  // Set the map as loaded
          }}
          options={{
            streetViewControl: false,
          }}
        />
      )}
    </LoadScript>
  );
};


const findCenter = (nation1: Nation, nation2: Nation): { lat: number, lng: number } => {
  const centerLat = (nation1.lat + nation2.lat) / 2
  const centerLng = (nation1.lng + nation2.lng) / 2
  return { lat: centerLat, lng: centerLng }

}


async function imageToBase64(url: string): Promise<string> {
  // Fetch the image
  const response = await fetch(url);
  // Ensure the fetch was successful
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  // Read the image response as a Blob
  const blob = await response.blob();
  // Create a FileReader to convert the Blob to a base64 string
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

//Create a correct image URL
function getDistanceImageUrl(answer: Nation, guess: Nation) {



  const center = findCenter(answer, guess)
  const centerCoordString = `${center.lat},${center.lng}`
  const answerCoordString = `${answer.lat},${answer.lng}`
  const guessCoordString = `${guess.lat},${guess.lng}`

  if (answer === guess) {

    const imgUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${centerCoordString}&zoom=2&size=600x670&maptype=roadmap%20&markers=color:green%7C${answerCoordString}&key=${api_Key}`
    return imgUrl;

  }

  const imgUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${centerCoordString}&zoom=2&size=600x670&maptype=roadmap%20&markers=color:green%7C${answerCoordString}&markers=color:red%7C${guessCoordString}&path=color:red|weight:5|${answerCoordString}|${guessCoordString}&key=${api_Key}`
  return imgUrl
}

function ShowDistanceMap({ imageUrl }: { imageUrl: string }) {
  if (imageUrl === "") return (
    <div />
  )

  else return (
    <Button
      type="submit"
      variant="contained"
      className="save-modal-button"
      sx={{ mt: 3, mb: 2 }}
    >
      GUESS
    </Button>
  )
}


type LocaleLocatrProps = {
  onSave: (url: string, answer: Nation, guess: Nation) => void;
}

const LocaleLocatr = ({ onSave }: LocaleLocatrProps) => {
  // STILL TO DO - MOVE THE ANSWER INTO STATE HERE SO IT CAN BE CHOSEN FROM THE FULL LIST
  // const [answer, setAnswer] = useState
  const [guess, setGuess] = useState<Nation | null>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [image, setImage] = useState<string>("")

  // Stage one: make a guess
  useEffect(() => {
    if (guess) {
      const newImageUrl: string = getDistanceImageUrl(trueLocation, guess)
      setImageUrl(newImageUrl)

      const fetchImage = async (url: string) => {
        const base64Image = await imageToBase64(imageUrl)
        setImage(base64Image)
      }
      fetchImage(newImageUrl)


    }
  }, [guess])

  // Stage two: when image file is saved, process that guess
  useEffect(() => {
    if (guess) {
      console.log(image)
      // Things that happen go here
      // The "THing" being that all the necessary data needs to get saved to this.model
      // and then trigger the done
    }
  }, [image])

  return (
    <>
      <div className='flex flex-col'>

        <div className='flex flex-row justify-center'>
          <NationDropdown onSelect={setGuess} />
        </div>
        <div className='flex flex-row rounded-xl m-5 justify-center'>
          <StreetView />
        </div>
        <div className='flex flex-row justify-center px-5 mx-5'>
          <Button
            type="submit"
            variant="contained"
            className="save-modal-button"
            onClick={() => { if (imageUrl) { onSave(imageUrl, trueLocation, guess!) } }}
            sx={{ mt: 3, mb: 2 }}
          >
            GUESS
          </Button>
        </div>
      </div>

    </>

  )

}

//<img src={this.model.data["imgUrl"]} />
const PostInFeed = ({ image, distance, guessCountryName, correctCountryName }: { image: string, distance: number, guessCountryName: string, correctCountryName: string }) => {

  if (guessCountryName === correctCountryName) {

    return (<><div className='flex flex-row justify-items-center justify-center'>

      <Card sx={{ maxHeight: 725 }} variant="outlined">
        <CardActionArea>
          <CardMedia
            sx={{ maxHeight: 700 }}
            component="img"
            height="300"
            image={image}
            alt="distMap"
          />
          <CardContent sx={{ maxHeight: 300 }}>
            <Typography variant="h6" align='center' component="div" color="black">
              Correct
            </Typography>
            <Typography variant="subtitle1" align='center' color="black">
              Great Job! You picked the correct country,  <strong>{correctCountryName}!</strong>
            </Typography>

          </CardContent>
        </CardActionArea>
      </Card>
    </div>
    </>)

  }


  return (<>
    <Card sx={{ maxHeight: 725 }} variant="outlined">
      <CardActionArea >
        <CardMedia
          sx={{ maxHeight: 700 }}
          component="img"
          image={image}
          alt="distMap"
        />
        <CardContent sx={{ maxHeight: 200 }}>
          <Typography variant="h6" align='center' component="div" color="black">
            Incorrect
          </Typography>
          <Typography variant="subtitle1" align='center' color="black">
            The correct country was:  <strong>{correctCountryName}</strong>
          </Typography>
          <Typography variant="subtitle1" align='center' color="black">
            Total distance:  <strong>{distance} km ({Math.trunc(convertKmToMiles(distance))} miles)</strong>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>

  </>)
}
export default class localelocatrBlock extends Block {

  render() {
    return (
      <><div className='flex flex-row justify-center'>
        <PostInFeed image={this.model.data["imgUrl"]} distance={parseInt(this.model.data["distance"])} guessCountryName={this.model.data["guessCountryName"]} correctCountryName={this.model.data["correctCountryName"]} />
      </div>
      </>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {

    const handleSave = (imgUrl: string, answer: Nation, guess: Nation) => {
      const distance = calcDist(answer, guess);
      this.model.data["imgUrl"] = imgUrl
      this.model.data["guessCountryName"] = guess.name
      this.model.data["correctCountryName"] = answer.name
      this.model.data["distance"] = distance.toString()
      done(this.model)
    }

    return (
      <div>

        <LocaleLocatr onSave={handleSave} />


      </div>)
  }


  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}

