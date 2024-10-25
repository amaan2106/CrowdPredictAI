// src/components/Map.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

// Initial center of the map (Toronto as an example)
const center = {
  lat: 43.65107,
  lng: -79.347015,
};

const Map = ({ searchResult }: { searchResult: google.maps.places.PlaceResult | null }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCiCkWkPsSdROJxggT-NtJ1Z9OeP75LuSo', // Replace with your API key
    libraries: ['places'], // Load Places library
  });

  const [restaurants, setRestaurants] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<google.maps.places.PlaceResult | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null); // Store a reference to the map

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    fetchRestaurants(map); // Fetch restaurants when the map loads
  }, []);

  const fetchRestaurants = (map: google.maps.Map) => {
    const service = new window.google.maps.places.PlacesService(map);

    const request = {
      location: center,
      radius: 5000, // Search within 5 km radius
      type: 'restaurant', // Filter by type 'restaurant'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        setRestaurants(results); // Store restaurant results in state
      } else {
        console.error('Error fetching restaurants:', status);
      }
    });
  };

  const onMapClick = useCallback(() => {
    setSelectedRestaurant(null); // Close InfoWindow when map is clicked
  }, []);

  useEffect(() => {
    if (searchResult && mapRef.current) {
      const { geometry } = searchResult;
      if (geometry && geometry.location) {
        mapRef.current.panTo(geometry.location);
        mapRef.current.setZoom(15);
        setSelectedRestaurant(searchResult);
      }
    }
  }, [searchResult]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={12}
      center={center}
      onLoad={onMapLoad}
      onClick={onMapClick}
    >
      {/* Render restaurant markers */}
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.place_id}
          position={{
            lat: restaurant.geometry?.location?.lat() ?? 0,
            lng: restaurant.geometry?.location?.lng() ?? 0,
          }}
          onClick={() => setSelectedRestaurant(restaurant)}
        />
      ))}

      {/* Show InfoWindow for selected restaurant */}
      {selectedRestaurant && (
        <InfoWindow
          position={{
            lat: selectedRestaurant.geometry?.location?.lat() ?? 0,
            lng: selectedRestaurant.geometry?.location?.lng() ?? 0,
          }}
          onCloseClick={() => setSelectedRestaurant(null)}
        >
          <div>
            <h2>{selectedRestaurant.name || 'Unnamed Restaurant'}</h2>
            <p>{selectedRestaurant.vicinity || 'Address not available'}</p>
            {selectedRestaurant.rating && (
              <p>Rating: {selectedRestaurant.rating} ⭐</p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default Map;