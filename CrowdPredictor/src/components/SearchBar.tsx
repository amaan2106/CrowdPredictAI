import React, { useState, useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<google.maps.places.PlaceResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.formatted_address) {
        setQuery(place.formatted_address);
        onSearch(place.formatted_address);
      }
    }
  };

  return (
    <div>
      <Autocomplete
        onLoad={(autocomplete) => {
          autocompleteRef.current = autocomplete;
          autocomplete.setOptions({
            types: ['establishment'],
            componentRestrictions: { country: 'us' },
            fields: ['place_id', 'name', 'formatted_address', 'geometry'],
          });
        }}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a restaurant..."
        />
      </Autocomplete>
      <button onClick={() => onSearch(query)}>Search</button>

      {/* Display search results */}
      {searchResults.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>
                <strong>{result.name}</strong> - {result.formatted_address} (Rating: {result.rating})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display error message if there's any */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default SearchBar;