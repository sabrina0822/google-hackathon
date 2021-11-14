import React, { useEffect, useState } from "react";
import {
  DirectionsService,
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import google from "google";
import Directions from "./Directions";
import axios from "axios";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// axios.defaults.baseURL = "https://backend-n7zgf2z4qq-nn.a.run.app";
axios.defaults.baseURL = "https://backend-n7zgf2z4qq-nn.a.run.app";
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
  const [requested, setRequested] = useState(false);
  const [map, setMap] = React.useState(null);
  const [stops, setStops] = useState([]);
  const [stopData, setStopData] = useState([]);
  const [startMarkerPos, setStartMarkerPos] = useState({
    lat: 45.214312,
    lng: -73.533951,
  });

  const placeMarker = async (position) => {
    console.log(position);
    setStartMarkerPos(position);

    await getUser({ latitude: position.lat(), longitude: position.lng() });
    setRequested(false);
  };

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
    map.addListener("click", function (e) {
      if (!requested) {
        setRequested(true);
        placeMarker(e.latLng);
        getUser(e.latLng);
      }
    });
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);
  async function getUser(location) {
    console.log(requested);
    if (requested) {
      return;
    }
    try {
      console.log("getting things", location);

      const response = await axios.post("route", location);
      console.log(response);
      setStops([]);
      setStops(
        response.data.map((loc) => {
          return { lng: loc.longitude, lat: loc.latitude };
        })
      );

      setStopData(response.data);
      // console.log(response);
    } catch (error) {
      console.error("bad", error);
    }
  }
  useEffect(() => {
    getUser(null);
  }, []);

  return isLoaded ? (
    <div
      style={{
        width: "100%",
        display: "flex",
      }}
    >
      <div
        style={{
          paddingRight: "20px",
          paddingLeft: "20px",
        }}
      >
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
          <Marker position={startMarkerPos}></Marker>
          {stops.length > 0 && <Directions stops={stops} />}
        </GoogleMap>
      </div>
      <div>
        {stopData.map((stop, i) => {
          if (i == 0) {
            return (
              <div style={{ display: "flex", padding: 0, margin: 0 }}>
                <p style={{ paddingRight: "5px", margin: 0 }}>A: Start</p>
              </div>
            );
          }
          if (stop.Nom_francais) {
            return (
              <div style={{ display: "flex", padding: 0, margin: 0 }}>
                <p style={{ paddingRight: "5px", margin: 0 }}>
                  {`${alphabet.charAt(i)}: ${stop.Nom_francais}`}
                </p>
                <p style={{ margin: 0 }}>-{stop.Type}</p>
              </div>
            );
          } else {
            return (
              <div style={{ display: "flex", padding: 0, margin: 0 }}>
                <p style={{ paddingRight: "5px", margin: 0 }}>
                  {`${alphabet.charAt(i)}: ${stop.name}`}
                </p>
                <p style={{ margin: 0 }}>-{stop.type}</p>
              </div>
            );
          }
        })}
      </div>
    </div>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
