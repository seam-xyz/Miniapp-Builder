// Declare global namespace and export types
export {};

declare global {
  namespace google.maps {
    export interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    export class Map {
      constructor(element: HTMLElement, options: any);
      setCenter(center: LatLngLiteral): void;
      getBounds(): LatLngBounds;
      addListener(eventName: string, handler: Function): void;
    }

    export class Marker {
      constructor(options: any);
    }

    export class LatLngBounds {
      extend(point: LatLngLiteral): void;
    }

    export namespace places {
      export class SearchBox {
        constructor(input: HTMLInputElement);
        getPlaces(): Array<{ geometry: { location: LatLng } }>;
        setBounds(bounds: LatLngBounds): void;
        addListener(eventName: string, handler: Function): void;
      }

      export class LatLng {
        lat(): number;
        lng(): number;
      }
    }
  }
}

// Explicitly export the types
export type LatLngLiteral = google.maps.LatLngLiteral;
export type GoogleMap = google.maps.Map;
export type Marker = google.maps.Marker;
export type LatLngBounds = google.maps.LatLngBounds;
export type SearchBox = google.maps.places.SearchBox;