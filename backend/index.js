var express = require("express");
const { BigQuery } = require("@google-cloud/bigquery");
const mysql = require("mysql");
var app = express();
app.get("/", async function (req, res) {
  result = await query(
    `SELECT * FROM \`itinerary-hackathon.itinerary_dataset.food_locations\` LIMIT 100`
  );
  res.send(result);
});
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
