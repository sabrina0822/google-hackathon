var express = require("express");
const mysql = require("mysql");
var app = express();
app.get("/", function (req, res) {
  res.send("Hello World!");
});
const port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log("Example app listening on port 3000!");
});
