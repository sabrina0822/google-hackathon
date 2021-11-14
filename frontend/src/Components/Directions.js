import React from "react";
import { DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

export default function Directions({ stops }) {
  const [directions, setDirections] = React.useState(null);
  return (
    <div>
      <DirectionsService
        options={{
          destination: stops[stops.length - 1],
          origin: stops[0],
          travelMode: "WALKING",
          waypoints: stops.slice(1, -1).map((stop) => {
            console.log("stop", stop, stops[0], stops[-1]);
            return {
              stopover: true,
              location: stop,
            };
          }),
        }}
        callback={(e) => {
          if (!directions) {
            console.log(e);
            setDirections(e);
          }
        }}
      ></DirectionsService>
      <DirectionsRenderer
        options={{
          directions: directions,
        }}
      />
    </div>
  );
}
