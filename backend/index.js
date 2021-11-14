var express = require("express");
var cors = require("cors");
const { BigQuery } = require("@google-cloud/bigquery");
const mysql = require("mysql");

const searchRange = 0.007;
const passThroughRange = 0.001;
const attractionSearchRange = 0.06;

const foodTable = "`itinerary-hackathon.itinerary_dataset.food_locations`";
const attractionTable =
  "`itinerary-hackathon.itinerary_dataset.tourist_attractions`";

var app = express();
app.use(cors());
app.use(express.json());
app.get("/", async function (req, res) {
  result = await query(
    `SELECT * FROM \`itinerary-hackathon.itinerary_dataset.food_locations\` LIMIT 100`
  );
  res.send(result);
});

app.post("/route", async function (req, res, body) {
  const data = {
    location: typeof req.body === "string" ? JSON.parse(req.body) : req.body,
    // location: {
    //   latitude: 45.50058,
    //   longitude: -73.57821,
    // },
    categories: ["", ""],
  };
  const allStops = [data.location];

  console.log(data.location, body, Object.keys(req));
  const locationA = await getAttraction(data.location);
  allStops.push(locationA);
  console.log("got loca");
  const locationB = await getSecondaryAttraction(data.location);
  allStops.push(locationB);
  console.log("got locb");

  const breakfast = await getBreakfast(
    getAverageLocation(data.location, locationA)
  );
  allStops.push(breakfast);
  console.log("breakfast");
  const lunch = await getLunch(getAverageLocation(locationB, locationA));
  allStops.push(lunch);
  console.log("lunch");
  const dinner = await getDinner(getAverageLocation(data.location, locationB));
  allStops.push(dinner);
  console.log("dinner");
  const dessert = await getDessert(dinner);
  allStops.push(dessert);
  console.log("dessert");
  const bar = await getBar(dessert);
  allStops.push(bar);
  console.log("bar");
  allStops.push(data.location);

  const finalList = [];
  for (let i = 0; i < allStops.length - 1; i++) {
    finalList.push(allStops[i]);
    if (i % 4 == 0) {
      finalList.push(
        await getPassThrough(getAverageLocation(allStops[i], allStops[i + 1]))
      );
    }
  }

  res.send(finalList);
});

const getAverageLocation = (loca, locb) => {
  if (!loca) {
    return locb;
  }
  if (!locb) {
    return loca;
  }
  // console.log(loca, locb);
  let newLoc = {
    latitude: (loca.latitude + locb.latitude) / 2,
    longitude: (loca.longitude + locb.longitude) / 2,
  };
  // console.log(newLoc);
  return newLoc;
};

const getSecondaryAttraction = async (location) => {
  return await getAttractionLocation(
    location,
    "'Art Gallery', 'Museum', 'Theatres', 'Casino', 'Cinema'",
    attractionSearchRange
  );
};

const getPassThrough = async (location) => {
  return await getAttractionLocation(
    location,
    "'Shopping Centers', 'Park', 'Public Areas', 'Streets', 'Public Market', 'Historical Buildings', 'Art public', 'Marina', 'Tourism Info'",
    passThroughRange
  );
};

const getAttraction = async (location) => {
  return await getAttractionLocation(
    location,
    "'Cultural Attraction', 'Recreational Attraction'",
    attractionSearchRange
  );
};

const getAttractionLocation = async (location, types, range) => {
  const val = await query(
    `SELECT * FROM ${attractionTable} WHERE ${getWithinRangeString(
      location,
      range
    )} AND Type IN (${types}) ORDER BY RAND() LIMIT 1`
  );
  if (val.length == 0) {
    return getAttractionLocation(location, types, range * 2);
  } else {
    return {
      ...val[0],
      latitude: val[0].Latitude,
      longitude: val[0].Longitude,
    };
  }
};

const getBreakfast = async (location) => {
  return await getFoodLocation(
    location,
    "'Bakery','Pastry shop','Pastry shop-depot'"
  );
};

const getLunch = async (location) => {
  return await getFoodLocation(
    location,
    "'Light Meal','Local Food','Food Truck','Deli','Public Market'"
  );
};
const getDinner = async (location) => {
  return await getFoodLocation(location, "'Restaurant','Local Food'");
};
const getDessert = async (location) => {
  return await getFoodLocation(location, "'Chocolate Factory', 'Ice Cream'");
};
const getBar = async (location) => {
  return await getFoodLocation(location, "'Bar'");
};

const getFoodLocation = async (location, types, multiplier = 1) => {
  console.log(location);
  let queryString = `SELECT * FROM ${foodTable} WHERE ${getWithinRangeString(
    location,
    searchRange * multiplier
  )} AND Type IN (${types}) ORDER BY RAND() LIMIT 1`;
  console.log(queryString);
  let val = await query(queryString);

  if (val.length == 0) {
    return getFoodLocation(location, types, 2 * multiplier);
  } else {
    return val[0];
  }
};

const getWithinRangeString = (location, range) => {
  return `longitude > ${
    parseFloat(location.longitude) - range
  } AND longitude < ${parseFloat(location.longitude) + range} AND latitude > ${
    parseFloat(location.latitude) - range
  } AND latitude < ${parseFloat(location.latitude) + range}`;
};

const port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log("Example app listening on port 3000!");
});

const bigquery = new BigQuery();
async function query(query) {
  // const query = `SELECT *
  //   FROM \`itinerary-hackathon.itinerary_dataset.food_locations\`
  //   LIMIT 100`;
  const options = {
    query: query,
    location: "northamerica-northeast1",
  };

  const [job] = await bigquery.createQueryJob(options);

  const [rows] = await job.getQueryResults();
  return rows;
}
