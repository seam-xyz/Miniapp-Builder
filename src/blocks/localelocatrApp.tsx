import Block from './Block'
import { BlockModel } from './types'
import './BlockStyles.css'
import React, { useEffect, useRef, useState } from "react";
import { GoogleMap } from "@react-google-maps/api";
import { LoadScript } from "@react-google-maps/api";
import { OutputFormat, setDefaults } from 'react-geocode';
import { Select } from "antd";
import { error } from 'console';
const { Option } = Select;

const api_Key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY!

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
  region: "es",
  outputFormat: OutputFormat.XML
});

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

function NationDropdown ({onSelect}: {onSelect: Function}) {
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



const randomNation = (nations:Nation[]): Nation => {
  const randomIndex = Math.floor(Math.random() * nations.length)
  return nations[randomIndex]
}

//props -  latitude and longitude of two locations(in degrees)
//return - distance in km between the two given locations (straight line from point a to point b)
function calcDist(nation1:Nation, nation2: Nation) 
{
  
  function toRad( value: number ){
    // Converts numeric degrees to radians
    return value * Math.PI / 180
  }
  const lat1 = toRad(nation1.lat)
  const lat2 = toRad(nation2.lat)
  const lng1 = toRad(nation1.lng)
  const lng2 = toRad(nation2.lng)
  var R = 6371; // km
  var dLat = lat2-lat1
  var dLon = lng2-lng1

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}


//converts KM to miles
function convertKmToMiles(km:number) {
  return km * 0.621371;
}

const containerStyle = {
  width: '100%',
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
      <div id="street-view" style={containerStyle}></div>


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


// //const to hold the user's guess input
// const userGuessLocation = {

//   lat: 48.8575,
//   long: 2.3514,

// }

// const center = {

//   lat: (userGuessLocation.lat + trueLocation.lat)/2, 
//   long: (userGuessLocation.long + trueLocation.lng)/2

// }

const findCenter = (nation1: Nation, nation2: Nation): {lat: number, lng: number}  => {
  const centerLat = (nation1.lat + nation2.lat) / 2
  const centerLng = (nation1.lng + nation2.lng) / 2
  return { lat: centerLat, lng:centerLng }

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


function getDistanceImageUrl(answer: Nation, guess: Nation){
  const center = findCenter(answer, guess)
  const centerCoordString = `${center.lat},${center.lng}`
  const answerCoordString = `${answer.lat},${answer.lng}`
  const guessCoordString = `${guess.lat},${guess.lng}`
  const imgUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${centerCoordString}&zoom=2&size=570x800&maptype=roadmap%20&markers=color:green%7C${answerCoordString}&markers=color:red%7C${guessCoordString}&path=color:red|weight:5|${answerCoordString}|${guessCoordString}&key=${api_Key}`
return imgUrl
}

function ShowDistanceMap({imageUrl}:{imageUrl: string}){
  if (imageUrl==="") return(
    <div />
  )

  else return(
    <img src={imageUrl} />
  )
}


const LocaleLocatr = () => {
  const [guess, setGuess] = useState<Nation | null>(null)
  const [image, setImage] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string>("")

  useEffect(()=>{
    // Update the imageUrl now
    if (guess){
      const imageUrl = getDistanceImageUrl(trueLocation, guess)
      setImageUrl(imageUrl)
    }
  },[guess])


  return(
    <>
      <div>
          <NationDropdown onSelect = {setGuess} />
      </div>
      <div>
        <StreetView />
      </div>
      <div>
        <ShowDistanceMap imageUrl = {imageUrl} />
      </div>
    </>

  )

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

  <LocaleLocatr />

        
     
      </div>)}
    

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}



// REMAINING WORK
// 
// Boolean in state to say whether user has guessed yet
// Boolean to change after guess - picture to stop showing when boolean true - map to start showing when boolean true - trigger preview mode
// Work out how final post page is handled
// Final post page
// Transform image to base64 string and store in data model
// Add to Final Post - overlay with details about distance etc
// <PostInFeed image= distance= /> component that shows in feed
// 
// 
