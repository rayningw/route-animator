/*global google*/

var _ = require("lodash");

// Maximum number of waypoints, including origin and destination supported per
// directions service route request
var MAX_ROUTE_WAYPOINTS = 10;

function getRoute(directionsService, waypoints, callback) {
  if (waypoints.length < 2) {
    callback("Cannot get route for less than 2 waypoints");
    return;
  }

  var numRequests = 0;
  var responses = [];  // [{result, status}*]
  var numResponsesReceived = 0;

  // Waypoints queued for the next request
  var pendingRequestWaypoints = [];

  // Calls the directions service route finder with the pending waypoints
  function doPendingRequest() {
    var request = getRouteRequest(pendingRequestWaypoints);
    var requestIndex = numRequests++;
    responses.push();  // Placeholder for response

    directionsService.route(request, (result, status) => {
      // Record the response for processing later
      responses.splice(requestIndex, 0, { result: result, status: status });
      numResponsesReceived++;

      // Process the responses if we have received them all
      if (numResponsesReceived == numRequests) {
        processRouteResponses(responses, callback);
      }
    });
  }

  // Get routes from batches of waypoints
  waypoints.forEach(waypoint => {
    pendingRequestWaypoints.push(waypoint);

    // Do the request if we have queued up enough waypoints
    if (pendingRequestWaypoints.length == MAX_ROUTE_WAYPOINTS) {
      doPendingRequest();

      // Prep the next request's origin as the current route's destination
      pendingRequestWaypoints = [ _.last(pendingRequestWaypoints) ];
    }
  });

  // Do one more request with the remaining waypoints
  if (pendingRequestWaypoints.length > 1) {
    doPendingRequest();
  }
}

// Processes all directions service route responses
function processRouteResponses(responses, callback) {
  var errs = responses
    .filter(response => response.status != google.maps.DirectionsStatus.OK)
    .map(response => "Received status: " + response.status);

  if (errs.length > 0) {
    callback("Received errors: " + errs);
    return;
  }

  var responseCoords = responses.map(response => calcCoords(response.result.routes[0]));
  callback(null, _.flatten(responseCoords));
}

function getRouteRequest(waypoints) {
  var stopovers = waypoints.slice(1, waypoints.length-1).map(function(waypoint) {
    return {
      location: waypoint
    };
  });

  return {
    origin: waypoints[0],
    destination: waypoints[waypoints.length-1],
    // Waypoints in the request message are actually the stopovers in the middle
    waypoints: stopovers,
    travelMode: google.maps.TravelMode.DRIVING
  };
}

function calcCoords(route) {
  var routeCoords = [];

  // Flatten all leg steps into co-ordinates to animate
  route.legs.forEach(function(leg) {
    leg.steps.forEach(function(step) {
      var path = google.maps.geometry.encoding.decodePath(step.polyline.points);
      path.forEach(function(coord) {
        routeCoords.push(coord);
      });
    });
  });

  return routeCoords;
}

module.exports = {
  getRoute: getRoute
};
