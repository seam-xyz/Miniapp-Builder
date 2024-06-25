import React, { useState, useEffect, useRef } from 'react';
import Block from './Block';
import { BlockModel } from './types';
import BlockFactory from './BlockFactory';
import { Geolocation } from '@capacitor/geolocation';
import './BlockStyles.css';
import { Search } from 'react-feather';

// Import Google Maps type declarations
/// <reference path="./types/google-maps.d.ts" />

interface LatLngLiteral {
  lat: number;
  lng: number;
}

const isSuperApp = process.env.REACT_APP_IS_SUPERAPP === 'true';

export default class MapBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!);
    }

    if (!isSuperApp) {
      return <h1>Google Maps API is disabled in this browser</h1>;
    }

    const location = JSON.parse(this.model.data['location']) as LatLngLiteral;

    return (
      <div className="relative w-full h-full">
        <Map location={location} />
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    if (!isSuperApp) {
      return <h1>Google Maps API is not available.</h1>;
    }

    return (
      <div className="relative flex flex-col items-center rounded-lg bg-gray-100 h-full">
        <MapEditor
          onSelect={(location: LatLngLiteral) => {
            this.model.data['location'] = JSON.stringify(location);
            done(this.model);
          }}
        />
      </div>
    );
  }

  renderErrorState() {
    return <h1>Error!</h1>;
  }
}

interface MapProps {
  location: LatLngLiteral;
}

const Map: React.FC<MapProps> = ({ location }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current && isSuperApp) {
      const map = new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 14,
      });

      new google.maps.Marker({
        position: location,
        map: map,
      });
    }
  }, [location]);

  if (!isSuperApp) {
    return <h1>Google Maps API is disabled in this browser</h1>;
  }

  return <div ref={mapRef} className="w-full h-full" style={{ height: '400px' }} />;
};

interface MapEditorProps {
  onSelect: (location: LatLngLiteral) => void;
}

const MapEditor: React.FC<MapEditorProps> = ({ onSelect }) => {
  const [location, setLocation] = useState<LatLngLiteral | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Geolocation.getCurrentPosition().then((position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ lat: latitude, lng: longitude });
    });
  }, []);

  useEffect(() => {
    if (mapRef.current && location && isSuperApp) {
      const map = new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 14,
      });

      const input = searchBoxRef.current!;
      const searchBox = new google.maps.places.SearchBox(input);

      map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
      });

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();

        if (places && places.length > 0) {
          const place = places[0];
          if (place.geometry) {
            const newLocation = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            setLocation(newLocation);
            onSelect(newLocation);
            map.setCenter(newLocation);
            new google.maps.Marker({
              position: newLocation,
              map: map,
            });
          } else {
            console.error('Place has no geometry: ', place);
          }
        }
      });

      // Add custom class to PAC container
      const pacContainer = document.querySelector('.pac-container');
      if (pacContainer) {
        pacContainer.classList.add('custom-pac-container');
      }
    }
  }, [location, onSelect]);

  if (!isSuperApp) {
    return <h1>Google Maps API is disabled in this browser</h1>;
  }

  return (
    <div className="relative w-full h-full mt-[72px]">
      <div ref={mapRef} className="w-auto h-full rounded-[24px]" style={{marginLeft:'16px', marginRight: '16px',}} />
      <div className="absolute top-0 w-full h-auto pt-16 flex items-start justify-center bg-transparent">
        <div className="relative flex items-center justify-center w-11/12 h-auto">
          <div className="absolute left-0 flex items-center pl-3 mb-2">
            <Search className="text-gray-500" />
          </div>
          <input
            ref={searchBoxRef}
            type="text"
            placeholder="Search for a place"
            className="rounded-full py-2 pl-10 pr-4 border border-gray-300 placeholder:ml-1 focus:outline-none focus:ring-2 focus:ring-seam-blue mb-2 bg-white shadow-lg w-full"
          />
        </div>
      </div>
    </div>
  );
};