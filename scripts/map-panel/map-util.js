/*global google*/

function getRoute(directionsService, waypoints, callback) {
  var stopovers = waypoints.slice(1, waypoints.length-1).map(function(waypoint) {
    return {
      location: waypoint
    };
  });

  var request = {
    origin: waypoints[0],
    destination: waypoints[waypoints.length-1],
    // Waypoints in the request message are actually the stopovers in the middle
    waypoints: stopovers,
    travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      var coords = calcCoords(result.routes[0]);
      callback(null, coords);
    }
    else {
      callback("Received status: " + status);
    }
  });
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
