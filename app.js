/*global process __dirname*/
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.set("port", (process.env.PORT || 3000));

app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

var server = app.listen(app.get("port"), function() {
  console.log("Listening on port %d", server.address().port);
});
