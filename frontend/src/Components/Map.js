import React, { useEffect, useState } from "react";
import {
  DirectionsService,
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import Directions from "./Directions";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

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
  const [stops, setStops] = useState([]);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    async function getUser() {
      try {
        console.log("getting things");
        const response = await axios.post("route");
        setStops(
          response.data.map((loc) => {
            return { lng: loc.longitude, lat: loc.latitude };
          })
        );
        console.log(response);
      } catch (error) {
        console.error("bad", error);
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    console.log(stops);
  }, [stops]);

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
      {/* <Marker position={center}></Marker> */}
      {stops.length > 0 && <Directions stops={stops} />}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
