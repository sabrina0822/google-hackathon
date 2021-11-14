import React from "react";
import { DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

export default function Directions({ start, end, stopovers }) {
  const [directions, setDirections] = React.useState(null);
  return (
    <div>
      <DirectionsService
        options={{
          destination: end,
          origin: start,
          travelMode: "WALKING",
          waypoints: stopovers.map((stop) => {
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
