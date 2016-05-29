// Oakland to Baltimore
var rockridge = {lat: 37.844542, lng: -122.251411};
var jhu = {lat: 39.329910, lng: -76.620502};
var kansasCity = {lat: 39.114445, lng: -94.627061};
var pittsburgh = {lat: 40.439247, lng: -80.009310};
var sparks = {lat: 39.533575, lng: -119.757114};
var denver = {lat: 39.768034, lng: -104.903520};
var spaceMuseum = {lat: 41.018012, lng: -96.319971};
var stLouis = {lat: 38.624138, lng: -90.184582};
var louisville = {lat: 38.252620, lng: -85.757743};
var charlestownPark = {lat: 38.429801, lng: -85.628119};
var waypoints = [ rockridge, sparks, denver, spaceMuseum, kansasCity, stLouis, louisville, charlestownPark, pittsburgh, jhu ];

// Center of the US
var initialLocation = {lat: 37.6, lng: -95.665};
var initialZoom = 4;

exports.initialZoom = initialZoom;
exports.initialLocation = initialLocation;
exports.waypoints = waypoints;
