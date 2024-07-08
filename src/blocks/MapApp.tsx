import React, { useState, useEffect, useRef } from 'react';
import Block from './Block';
import { BlockModel } from './types';
import './BlockStyles.css';
import { GoogleMap, LoadScript, Autocomplete } from "@react-google-maps/api";
import { Search } from 'react-feather';
import { Button, TextField, Typography } from '@mui/material';
import Iframely from './utils/Iframely';

const api_Key = process.env.REACT_APP_GOOGLE_MAPS_KEY!;

export default class MapBlock extends Block {
  render() {
    const locationUrl = this.model.data['url'];

    if (!locationUrl) {
      return this.renderEmptyState();
    }

    return (
      <div className="relative w-full h-full">
        <Iframely url={locationUrl} style={{ height: '100%', width: '100%' }} />
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <div className="relative flex flex-col items-center rounded-lg bg-gray-100 h-full">
        <MapEditor
          onSelect={(locationUrl: string) => {
            this.model.data['url'] = locationUrl; // Store as URL string
            done(this.model);
          }}
        />
      </div>
    );
  }

  renderEmptyState() {
    return <h1>Please select a location</h1>;
  }

  renderErrorState() {
    return <h1>Error: Invalid location data!</h1>; 
  }
}

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface MapEditorProps {
  onSelect: (locationUrl: string) => void;
}

const MapEditor: React.FC<MapEditorProps> = ({ onSelect }) => {
  const [location, setLocation] = useState<any>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<GoogleMap>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ lat: latitude, lng: longitude });
    });
  }, []);

  const onLoadAutocomplete = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setLocation(newLocation);

        const locationUrl = place.formatted_address
          ? `https://www.google.com/maps/place/${encodeURIComponent(place.formatted_address)}/@${newLocation.lat},${newLocation.lng},14z`
          : `https://www.google.com/maps/search/?api=1&query=${newLocation.lat},${newLocation.lng}`;
        onSelect(locationUrl);

        if (mapRef.current !== null) {
          mapRef.current.panTo(newLocation);
        }
      } else {
        console.error('Place has no geometry or location: ', place);
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey={api_Key} libraries={['places']}>
      <div className="relative w-full h-full mt-[72px] mb-[72px]">
        <GoogleMap
          ref={mapRef}
          center={location}
          zoom={14}
          mapContainerStyle={{ height: '100%', width: 'auto', marginLeft: '16px', marginRight: '16px', borderRadius: '24px', }}
        >
          <div className="w-full h-full mx-4">
            {location && (
              <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                <input
                  type="text"
                  placeholder="Search for a place"
                  className="rounded-full py-2 pl-4 pr-4 mt-[64px] border border-gray-300 placeholder:ml-1 focus:outline-none focus:ring-2 focus:ring-seam-blue mb-2 bg-white shadow-lg"
                  style={{
                    width: 'calc(100% - 64px)', // Adjust the width of the input to fit within the map container
                    maxWidth: '600px',
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1,
                  }}
                />
              </Autocomplete>
            )}
          </div>
        </GoogleMap>
      </div>
    </LoadScript>
  );
};