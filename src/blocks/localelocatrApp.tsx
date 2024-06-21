import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import { NationDropdown } from './temp_locale_components/NationDropdown';
import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, StreetViewPanorama } from "@react-google-maps/api";
import { LoadScript } from "@react-google-maps/api";
// import {APIProvider, Map, MapCameraChangedEvent} from '@vis.gl/react-google-maps';
import { OutputFormat, setDefaults } from 'react-geocode';
import { geocode, RequestType } from "react-geocode";

const api_Key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY!

type Nation = {
  id: number;
  name: string;
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

//props -  latitude and longitude of two locations(in degrees)
//return - distance in km between the two given locations (straight line from point a to point b)
function calcDist(lat1:number, lon1:number, lat2:number, lon2:number) 
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value:number) 
{
    return Value * Math.PI / 180;
}

//converts KM to miles
function convertKmToMiles(km:number) {
  return km * 0.621371;
}

//gets random latitude in degrees
function getRandomLatitude(): number {
  // Latitude ranges from -90 to 90
  return Math.random() * 180 - 90;
}

//gets random longitude in degress
function getRandomLongitude(): number {
  // Longitude ranges from -180 to 180
  return Math.random() * 360 - 180;
}

//returns random latitude and longtude
function getRandomLatLng(): { latitude: number; longitude: number } {
  return {
      latitude: getRandomLatitude(),
      longitude: getRandomLongitude(),
  };
}

const geocodeAPI = "https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=" + api_Key

async function getGeocodeResponse() {
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
let data;
// document.addEventListener('DOMContentLoaded', (event) => {
//   getGeocodeResponse()
//     .then(response => {
//       data = response.results
//       console.log(data);
//       // Process the response here
//     })
//     .catch(error => {
//       console.error('Error fetching the geocode data:', error);
//     });
// });



const containerStyle = {
  width: '100%',
  height: '700px',
};

const center = {
  lat: 40.650002, 
  lng: -73.949997, // Default longitude
};

let streetAddress;


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
          position: center,
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
      data = response.results
      console.log(data)
      streetAddress = data[0].formatted_address
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
          center={center}
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
        {randomNation().flag}
        <NationDropdown />
        <div></div>
        <div>
          <StreetView />
        </div>

        

        
     
      </div>)}
    

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}

