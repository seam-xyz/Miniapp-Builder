import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import { NationDropdown } from './temp_locale_components/NationDropdown';
import React, { useEffect, useRef } from "react";
import { GoogleMap, StreetViewPanorama } from "@react-google-maps/api";
import { LoadScript } from "@react-google-maps/api";
// import {APIProvider, Map, MapCameraChangedEvent} from '@vis.gl/react-google-maps';
import Streetview from 'react-google-streetview';
import {APIProvider, Map} from '@vis.gl/react-google-maps';

const api_Key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY!

console.log(api_Key)

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


const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 37.7749, // Default latitude
  lng: -122.4194, // Default longitude
};

const StreetView: React.FC = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const streetViewRef = useRef<google.maps.StreetViewPanorama | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      streetViewRef.current = new google.maps.StreetViewPanorama(
        document.getElementById('street-view') as HTMLElement,
        {
          position: center,
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
        }
      );
      mapRef.current.setStreetView(streetViewRef.current);
    }
  }, []);

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        <div id="street-view" style={containerStyle}></div>
      </GoogleMap>
    </LoadScript>
  );
};






 


const lib = ["places"];



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

        <div>{calcDist(38.9072, 77.0369, 40.712, 74.0060)}</div>
        <div>
      <h1>Google Street View Example</h1>
      <StreetView />
    </div>

        

        
     
      </div>)}
    
  

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}

