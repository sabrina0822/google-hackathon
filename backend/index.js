var express = require("express");
var cors = require("cors");
const { BigQuery } = require("@google-cloud/bigquery");
const mysql = require("mysql");

const searchRange = 0.01;
const foodTable = "`itinerary-hackathon.itinerary_dataset.food_locations`";

var app = express();
app.use(cors());
app.get("/", async function (req, res) {
  result = await query(
    `SELECT * FROM \`itinerary-hackathon.itinerary_dataset.food_locations\` LIMIT 100`
  );
  res.send(result);
});

app.post("/route", async function (req, res) {
  const data = {
    location: {
      latitude: 45.50058,
      longitude: -73.57821,
    },
    categories: ["", ""],
  };
  const breakfast = await getBreakfast(data.location);
  console.log("breakfast", breakfast);
  const lunch = await getLunch(breakfast[0]);
  console.log("lunch", lunch);
  const dinner = await getDinner(lunch[0]);
  const dessert = await getDessert(dinner[0]);
  const bar = await getBar(dessert[0]);

  res.send([breakfast[0], lunch[0], dinner[0], dessert[0], bar[0]]);
});

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

const getFoodLocation = async (location, types) => {
  return await query(
    `SELECT * FROM ${foodTable} WHERE ${getWithinRangeString(
      location
    )} AND Type IN (${types}) ORDER BY RAND() LIMIT 1`
  );
};

const getWithinRangeString = (location) => {
  return `longitude > ${
    parseFloat(location.longitude) - searchRange
  } AND longitude < ${
    parseFloat(location.longitude) + searchRange
  } AND latitude > ${
    parseFloat(location.latitude) - searchRange
  } AND latitude < ${parseFloat(location.latitude) + searchRange}`;
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
