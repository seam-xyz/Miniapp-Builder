import React, { useState, useEffect, useRef } from 'react';
import { ComposerComponentProps, FeedComponentProps } from './types';
import './BlockStyles.css';
import { GoogleMap, LoadScript, Autocomplete } from "@react-google-maps/api";
import Iframely from './utils/Iframely';
import TitleComponent from './utils/TitleComponent';

const api_Key = process.env.REACT_APP_GOOGLE_MAPS_KEY!;

export const MapFeedComponent = ({ model }: FeedComponentProps) => {
  const locationUrl = model.data.url;

  if (!locationUrl) {
    return renderEmptyState();
  }

  if (model.data.title) {
    return (
      <div style={{ backgroundColor: "white", width: "100%", height: "100%" }}>
        {TitleComponent(model.data.title)}
        <Iframely
          url={locationUrl}
          style={{
            display: "flex",
            height: `100%`,
            width: `100%`
          }} 
        />
      </div>
    );
  }

  // Default rendering for newer posts
  return (
    <div className="relative w-full h-full">
      <Iframely url={locationUrl} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}

export const MapComposerComponent = ({ model, done }: ComposerComponentProps) => {
  return (
    <div className="relative flex flex-col items-center rounded-lg h-full">
      <MapEditor
        onSelect={(locationUrl: string) => {
          model.data.url = locationUrl; // Store as URL string
          done(model);
        }}
      />
    </div>
  );
}

const renderEmptyState = () => {
  return <div className="relative w-auto h-full mx-4 flex items-center justify-center bg-gray-200 rounded-lg">
    <h3 className="text-[#86868A]">Map loading...</h3>
  </div>;
}

interface MapEditorProps {
  onSelect: (locationUrl: string) => void;
}

const MapEditor: React.FC<MapEditorProps> = ({ onSelect }) => {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [blocked, setBlocked] = useState(false); // Track blocked state
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<GoogleMap>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLoading(false); // Set loading to false once location is obtained
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setBlocked(true); // Set blocked state if location permissions are denied
        }
        setLoading(false); // Set loading to false if there's an error obtaining location
        console.error('Error getting location:', error);
      }
    );
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
        {loading ? (
          <div className="flex items-center mx-4 justify-center w-auto h-full bg-gray-200 rounded-lg">
            <h3 className="text-[#86868A]">Map Loading ...</h3>
          </div>
        ) : blocked ? (
          <div className="flex items-center mx-4 justify-center w-auto h-full bg-gray-200 rounded-lg">
            <h3 className="text-[#86868A]">Location permissions blocked</h3>
          </div>
        ) : (
          <GoogleMap
            ref={mapRef}
            center={location}
            zoom={14}
            options={{
              streetViewControl: false, // Disable Street View
              disableDefaultUI: true // Disable all default UI
            }}
            mapContainerStyle={{ height: '100%', width: 'auto', marginLeft: '16px', marginRight: '16px', borderRadius: '24px' }}
          >
            <div className="w-full h-full mx-4">
              {location && (
                <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                  <input
                    type="text"
                    placeholder="Search for a place"
                    className="rounded-full py-2 pl-4 pr-4 mt- border border-gray-300 placeholder:ml-1 focus:outline-none focus:ring-2 focus:ring-seam-blue mb-2 bg-white shadow-lg"
                    style={{
                      width: 'calc(100% - 64px)', // Adjust the width of the input to fit within the map container
                      maxWidth: '600px',
                      position: 'absolute',
                      top: '16px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 1,
                    }}
                  />
                </Autocomplete>
              )}
            </div>
          </GoogleMap>
        )}
      </div>
    </LoadScript>
  );
};