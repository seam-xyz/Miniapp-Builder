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


    
  const citiesArray = [
    {
      city: "Tokyo",
      country: "Japan",
      lat: 35.6895,
      long: 139.6917
    },
    {
      city: "Delhi",
      country: "India",
      lat: 28.7041,
      long: 77.1025
    },
    {
      city: "Shanghai",
      country: "China",
      lat: 31.2304,
      long: 121.4737
    },
    {
      city: "São Paulo",
      country: "Brazil",
      lat: -23.5505,
      long: -46.6333
    },
    {
      city: "Mexico City",
      country: "Mexico",
      lat: 19.4326,
      long: -99.1332
    },
    {
      city: "Cairo",
      country: "Egypt",
      lat: 30.0444,
      long: 31.2357
    },
    {
      city: "Mumbai",
      country: "India",
      lat: 19.076,
      long: 72.8777
    },
    {
      city: "Beijing",
      country: "China",
      lat: 39.9042,
      long: 116.4074
    },
    {
      city: "Osaka",
      country: "Japan",
      lat: 34.6937,
      long: 135.5022
    },
    {
      city: "New York City",
      country: "USA",
      lat: 40.7128,
      long: -74.006
    },
    {
      city: "Karachi",
      country: "Pakistan",
      lat: 24.8607,
      long: 67.0011
    },
    {
      city: "Buenos Aires",
      country: "Argentina",
      lat: -34.6037,
      long: -58.3816
    },
    {
      city: "Istanbul",
      country: "Turkey",
      lat: 41.0082,
      long: 28.9784
    },
    {
      city: "Kolkata",
      country: "India",
      lat: 22.5726,
      long: 88.3639
    },
    {
      city: "Lagos",
      country: "Nigeria",
      lat: 6.5244,
      long: 3.3792
    },
    {
      city: "Manila",
      country: "Philippines",
      lat: 14.5995,
      long: 120.9842
    },
    {
      city: "Moscow",
      country: "Russia",
      lat: 55.7558,
      long: 37.6176
    },
    {
      city: "Dhaka",
      country: "Bangladesh",
      lat: 23.8103,
      long: 90.4125
    },
    {
      city: "Rio de Janeiro",
      country: "Brazil",
      lat: -22.9068,
      long: -43.1729
    },
    {
      city: "Lahore",
      country: "Pakistan",
      lat: 31.5497,
      long: 74.3436
    },
    {
      city: "Jakarta",
      country: "Indonesia",
      lat: -6.2088,
      long: 106.8456
    },
    {
      city: "Seoul",
      country: "South Korea",
      lat: 37.5665,
      long: 126.978
    },
    {
      city: "Cairo",
      country: "Egypt",
      lat: 30.0444,
      long: 31.2357
    },
    {
      city: "Dhaka",
      country: "Bangladesh",
      lat: 23.8103,
      long: 90.4125
    },
    {
      city: "Karachi",
      country: "Pakistan",
      lat: 24.8607,
      long: 67.0011
    },
    {
      city: "Kinshasa",
      country: "Democratic Republic of the Congo",
      lat: -4.4419,
      long: 15.2663
    },
    {
      city: "Mumbai",
      country: "India",
      lat: 19.076,
      long: 72.8777
    },
    {
      city: "Mexico City",
      country: "Mexico",
      lat: 19.4326,
      long: -99.1332
    },
    {
      city: "São Paulo",
      country: "Brazil",
      lat: -23.5505,
      long: -46.6333
    },
    {
      city: "Guangzhou",
      country: "China",
      lat: 23.1291,
      long: 113.2644
    },
    {
      city: "Shenzhen",
      country: "China",
      lat: 22.5431,
      long: 114.0579
    },
    {
      city: "Lahore",
      country: "Pakistan",
      lat: 31.5497,
      long: 74.3436
    },
    {
      city: "Istanbul",
      country: "Turkey",
      lat: 41.0082,
      long: 28.9784
    },
    {
      city: "Tianjin",
      country: "China",
      lat: 39.0842,
      long: 117.2007
    },
    {
      city: "Lima",
      country: "Peru",
      lat: -12.0464,
      long: -77.0428
    },
    {
      city: "Bangkok",
      country: "Thailand",
      lat: 13.7563,
      long: 100.5018
    },
    {
      city: "Nairobi",
      country: "Kenya",
      lat: -1.2921,
      long: 36.8219
    },
    {
      city: "Bogotá",
      country: "Colombia",
      lat: 4.7109,
      long: -74.0721
    },
    {
      city: "Singapore",
      country: "Singapore",
      lat: 1.3521,
      long: 103.8198
    },
    {
      city: "London",
      country: "United Kingdom",
      lat: 51.5074,
      long: -0.1278
    },
    {
      city: "Riyadh",
      country: "Saudi Arabia",
      lat: 24.7136,
      long: 46.6753
    },
    {
      city: "Tehran",
      country: "Iran",
      lat: 35.6892,
      long: 51.389
    },
    {
      city: "Baghdad",
      country: "Iraq",
      lat: 33.3152,
      long: 44.3661
    },
    {
      city: "Ho Chi Minh City",
      country: "Vietnam",
      lat: 10.8231,
      long: 106.6297
    },
    {
      city: "Sydney",
      country: "Australia",
      lat: -33.8688,
      long: 151.2093
    },
    {
      city: "Los Angeles",
      country: "USA",
      lat: 34.0522,
      long: -118.2437
    },
    {
      city: "Chicago",
      country: "USA",
      lat: 41.8781,
      long: -87.6298
    },
    {
      city: "Toronto",
      country: "Canada",
      lat: 43.6511,
      long: -79.347
    },
    {
      city: "Paris",
      country: "France",
      lat: 48.8566,
      long: 2.3522
    },
    {
      city: "Berlin",
      country: "Germany",
      lat: 52.52,
      long: 13.405
    },
    {
      city: "Madrid",
      country: "Spain",
      lat: 40.4168,
      long: -3.7038
    },
    {
      city: "Barcelona",
      country: "Spain",
      lat: 41.3851,
      long: 2.1734
    },
    {
      city: "Rome",
      country: "Italy",
      lat: 41.9028,
      long: 12.4964
    },
    {
      city: "Milan",
      country: "Italy",
      lat: 45.4642,
      long: 9.19
    },
    {
      city: "Sydney",
      country: "Australia",
      lat: -33.8688,
      long: 151.2093
    },
    {
      city: "Melbourne",
      country: "Australia",
      lat: -37.8136,
      long: 144.9631
    },
    {
      city: "Brisbane",
      country: "Australia",
      lat: -27.4698,
      long: 153.0251
    },
    {
      city: "Perth",
      country: "Australia",
      lat: -31.9505,
      long: 115.8605
    },
    {
      city: "Adelaide",
      country: "Australia",
      lat: -34.9285,
      long: 138.6007
    },
    {
      city: "Auckland",
      country: "New Zealand",
      lat: -36.8485,
      long: 174.7633
    },
    {
      city: "Wellington",
      country: "New Zealand",
      lat: -41.2865,
      long: 174.7762
    },
    {
      city: "Vancouver",
      country: "Canada",
      lat: 49.2827,
      long: -123.1207
    },
    {
      city: "Montreal",
      country: "Canada",
      lat: 45.5017,
      long: -73.5673
    },
    {
      city: "Ottawa",
      country: "Canada",
      lat: 45.4215,
      long: -75.6972
    },
    {
      city: "Calgary",
      country: "Canada",
      lat: 51.0447,
      long: -114.0719
    },
    {
      city: "Edmonton",
      country: "Canada",
      lat: 53.5444,
      long: -113.4909
    },
    {
      city: "Havana",
      country: "Cuba",
      lat: 23.1136,
      long: -82.3666
    },
    {
      city: "Santiago",
      country: "Chile",
      lat: -33.4489,
      long: -70.6693
    },
    {
      city: "Buenos Aires",
      country: "Argentina",
      lat: -34.6037,
      long: -58.3816
    },
    {
      city: "Lima",
      country: "Peru",
      lat: -12.0464,
      long: -77.0428
    },
    {
      city: "Brasília",
      country: "Brazil",
      lat: -15.7942,
      long: -47.8825
    },
    {
      city: "Santiago",
      country: "Chile",
      lat: -33.4489,
      long: -70.6693
    },
    {
      city: "Caracas",
      country: "Venezuela",
      lat: 10.4806,
      long: -66.9036
    },
    {
      city: "Quito",
      country: "Ecuador",
      lat: -0.1807,
      long: -78.4678
    },
    {
      city: "Guatemala City",
      country: "Guatemala",
      lat: 14.6349,
      long: -90.5069
    },
    {
      city: "San Salvador",
      country: "El Salvador",
      lat: 13.6929,
      long: -89.2182
    },
    {
      city: "Tegucigalpa",
      country: "Honduras",
      lat: 14.0723,
      long: -87.1921
    },
    {
      city: "San José",
      country: "Costa Rica",
      lat: 9.9281,
      long: -84.0907
    },
    {
      city: "Panama City",
      country: "Panama",
      lat: 8.9824,
      long: -79.5199
    },
    {
      city: "San Juan",
      country: "Puerto Rico",
      lat: 18.4655,
      long: -66.1057
    },
    {
      city: "Santo Domingo",
      country: "Dominican Republic",
      lat: 18.4861,
      long: -69.9312
    },
    {
      city: "Kingston",
      country: "Jamaica",
      lat: 17.9712,
      long: -76.7928
    },
    {
      city: "Port-au-Prince",
      country: "Haiti",
      lat: 18.5944,
      long: -72.3074
    },
    {
      city: "Nassau",
      country: "Bahamas",
      lat: 25.0343,
      long: -77.3963
    },
    {
      city: "San José",
      country: "Costa Rica",
      lat: 9.9281,
      long: -84.0907
    },
    {
      city: "Belmopan",
      country: "Belize",
      lat: 17.251,
      long: -88.759
    },
    {
      city: "Managua",
      country: "Nicaragua",
      lat: 12.114,
      long: -86.2362
    },
    {
      city: "Tegucigalpa",
      country: "Honduras",
      lat: 14.0723,
      long: -87.1921
    },
    {
      city: "Guatemala City",
      country: "Guatemala",
      lat: 14.6349,
      long: -90.5069
    },
    {
      city: "San Salvador",
      country: "El Salvador",
      lat: 13.6929,
      long: -89.2182
    },
    {
      city: "San Pedro Sula",
      country: "Honduras",
      lat: 15.5007,
      long: -88.033
    },
    {
      city: "León",
      country: "Nicaragua",
      lat: 12.4316,
      long: -86.892
    },
    {
      city: "Malabo",
      country: "Equatorial Guinea",
      lat: 3.7504,
      long: 8.7371
    },
    {
      city: "Bata",
      country: "Equatorial Guinea",
      lat: 1.8643,
      long: 9.7658
    },
    {
      city: "Accra",
      country: "Ghana",
      lat: 5.6037,
      long: -0.187
    },
    {
      city: "Lagos",
      country: "Nigeria",
      lat: 6.5244,
      long: 3.3792
    },
    {
      city: "Johannesburg",
      country: "South Africa",
      lat: -26.2041,
      long: 28.0473
    },
    {
      city: "Cape Town",
      country: "South Africa",
      lat: -33.9249,
      long: 18.4241
    },
    {
      city: "Durban",
      country: "South Africa",
      lat: -29.8587,
      long: 31.0218
    },
    {
      city: "Pretoria",
      country: "South Africa",
      lat: -25.7479,
      long: 28.2293
    },
  ];
  
  


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


//on page load get the street address info
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

function getRandomCity(cities: any[]): any {
  const randomIndex = Math.floor(Math.random() * cities.length);
  return cities[randomIndex];
}
const randomCity = getRandomCity(citiesArray);

const center = {
  lat: randomCity.lat, 
  lng: randomCity.long, // Default longitude
};

//const geocodeAPI = "https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=" + api_Key

const geocodeAPI = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + center.lat + "," + center.lng + "&key=" + api_Key

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

