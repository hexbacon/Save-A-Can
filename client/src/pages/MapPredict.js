import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: 40.7678,
  lng: -73.9645
};

const MapPredict = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBn9RFAgxJtKPzsNfhYIXzEYZDq7rgLdi4"
  });

  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const handleLoad = useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const handleMarkerClick = useCallback((marker) => {
    setSelectedMarker(marker);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const handleUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const getLocation = (className) => {
    const service = new window.google.maps.places.PlacesService(map);
    // Create Request
    const request = {
        location: center,
        radius: '10',
        query: `Recycling Center For ${className}`
      };
      // Make Request
    service.textSearch(request, (result, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < result.length; i++) {
            const name = result[i].name;
            const address = result[i].formatted_address;
  
            // Create content for the infowindow using template literals
            const contentString = `
              <div id="content">
                <div id="siteNotice"></div>
                <h1 id="firstHeading" class="firstHeading">${name}</h1>
                <div id="bodyContent">
                  <p><b>Located at: </b>${address}</p>
                  <p>Additional content goes here</p>
                </div>
              </div>
            `;
  
            const infowindow = new window.google.maps.InfoWindow({
              content: contentString,
              ariaLabel: result[i].name,
            });
            const place = {
              lat: result[i].geometry.location.lat(),
              lng: result[i].geometry.location.lng()
            };
            const marker = new window.google.maps.Marker({
              position: place,
              map: map,
            });
            marker.addListener("click", () => {
              infowindow.open({
                anchor: marker,
                map,
              });
            });
          }
        }
        map.setCenter(center);
        map.setZoom(10);
      });
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      onLoad={handleLoad}
      onUnmount={handleUnmount}
    >
      <Marker
        position={center}
        onClick={() => handleMarkerClick(center)}
      >
        {selectedMarker && selectedMarker.position.lat === center.lat && (
          <InfoWindow
            position={center}
            onCloseClick={handleInfoWindowClose}
          >
            <div>
              <h3>Center</h3>
              <p>Additional content goes here</p>
            </div>
          </InfoWindow>
        )}
      </Marker>
    </GoogleMap>
  ) : <></>;
};

export default React.memo(MapPredict);
