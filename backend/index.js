var express = require("express");
const { BigQuery } = require("@google-cloud/bigquery");
const mysql = require("mysql");
var app = express();
app.get("/", async function (req, res) {
  result = await query();
  res.send(result);
});
const port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log("Example app listening on port 3000!");
});

const bigquery = new BigQuery();
async function query() {
  // Queries the U.S. given names dataset for the state of Texas.

  const query = `SELECT *
    FROM \`itinerary-hackathon.itinerary_dataset.food_locations\`
    LIMIT 100`;

  // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
  const options = {
    query: query,
    // Location must match that of the dataset(s) referenced in the query.
    location: "northamerica-northeast1",
  };

  // Run the query as a job
  const [job] = await bigquery.createQueryJob(options);
  console.log(`Job ${job.id} started.`);

  // Wait for the query to finish
  const [rows] = await job.getQueryResults();

  // Print the results
  console.log("Rows:");
  rows.forEach((row) => console.log(row));
  return rows;
}
