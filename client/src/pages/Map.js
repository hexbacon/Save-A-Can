import React, { useMemo, useRef } from 'react'
import { useState, useCallback, memo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px'
};


const Map = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY
  })
  const center = useMemo(() =>({lat: 40.7678,lng: -73.9645}), []);
  const options = useMemo(() => ({
    disableDefaultUI: true,
    clickableIcons: false,
    mapId: "a15b2059c20005a5",
  }), 
  []);
  const [office, setOffice] = useState({});
  const mapRef = useRef();
  const [map, setMap] = useState(null)

  const onLoad = useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    mapRef.current = map;
    getCurrentLocation();
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  const getCurrentLocation = () => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setOffice(pos);
      })
    }
  }
  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      defaultCenter={center}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={options}
    >
      {office &&
      <Marker position={office} icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png" />}
      <></>
    </GoogleMap>
  ) : <div>Loading...</div>;
  
}

export default memo(Map)