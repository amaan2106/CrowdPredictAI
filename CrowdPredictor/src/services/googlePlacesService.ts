//AIzaSyCiCkWkPsSdROJxggT-NtJ1Z9OeP75LuSo
// src/services/googlePlacesService.ts

// src/services/googlePlacesService.ts

const API_KEY = 'AIzaSyCiCkWkPsSdROJxggT-NtJ1Z9OeP75LuSo';

export const textSearch = (query: string, options: { location: { lat: number, lng: number }, radius: number, type: string }): Promise<google.maps.places.PlaceResult[]> => {
  return new Promise((resolve, reject) => {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    const request = {
      query,
      location: new google.maps.LatLng(options.location.lat, options.location.lng),
      radius: options.radius,
      type: options.type,
    };

    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        resolve(results);
      } else {
        reject(`Error fetching places: ${status}`);
      }
    });
  });
};

export const getPlaceDetails = (placeId: string): Promise<google.maps.places.PlaceResult> => {
  return new Promise((resolve, reject) => {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    const request = {
      placeId,
      fields: ['name', 'formatted_address', 'geometry', 'rating', 'opening_hours', 'photos'],
    };

    service.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        resolve(place);
      } else {
        reject(`Error fetching place details: ${status}`);
      }
    });
  });
};