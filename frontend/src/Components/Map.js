import React from "react";
import {
  DirectionsService,
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import Directions from "./Directions";

const containerStyle = {
  width: "800px",
  height: "500px",
};

const center = {
  lat: 45.514412,
  lng: -73.636951,
};
const center2 = {
  name: "some place",
  lat: 45.514312,
  lng: -73.533951,
};
const center3 = {
  lat: 45.514412,
  lng: -73.436951,
};
const center4 = {
  name: "some place",
  lat: 45.214312,
  lng: -73.533951,
};

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDs_OKXWDe5pnMZbqkXXpk6qd0j9z7CN0Q",
  });

  const [map, setMap] = React.useState(null);
  const [directions, setDirections] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{
        lat: 45.514412,
        lng: -73.636951,
      }}
      position={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker position={center}></Marker>
      <Directions start={center} end={center4} stopovers={[center2, center3]} />
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
