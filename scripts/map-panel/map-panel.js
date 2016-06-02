/*global google*/
var React = require("react"),
  T = React.PropTypes;
var ReactDOM = require("react-dom");

var latLng = require("../model/lat-lng.js");
var waypoint = require("../model/waypoint.js");

var Animator = require("../animator/animator.js");
var mapStyles = require("./map-styles.js");
var mapUtil = require("./map-util.js");

// TODO(ray): Move this to the model package
var notifierShape = T.shape({
  subscribe: T.func.isRequired
});

var MapPanel = React.createClass({

  propTypes: {
    animationControl: T.element.isRequired,
    onAnimateNotifier: notifierShape.isRequired,
    onClearNotifier: notifierShape.isRequired,
    waypoints: T.arrayOf(waypoint.shape.isRequired).isRequired,
    initialLocation: latLng.shape.isRequired,
    initialZoom: T.number.isRequired,
    // Animation speed as km/s
    animationSpeed: T.number.isRequired
  },

  componentDidMount: function() {
    this.initializeMap();
    this.props.onAnimateNotifier.subscribe(this.handleAnimate);
    this.props.onClearNotifier.subscribe(this.handleClear);

    this.animator = new Animator(this.renderRouteForward, 120 /* frames per second */);

    this.renderUnmanaged();
  },

  render: function() {
    this.renderUnmanaged();

    // NOTE: React does not touch the child elements created by Google Maps
    return (
      <div id="map-canvas" ref={this.handleMapMount}></div>
    );
  },

  // Render things that are not managed by React, e.g. Google Maps.
  // Call this after mounting and on each render.
  renderUnmanaged: function() {
    if (!this.mapState.map) {
      return;
    }
    // We want each tick to represent a meter
    this.animator.setSpeed(this.props.animationSpeed);
    this.renderWaypoints();
  },

  // Clears out the old waypoint markers and renders the current ones
  renderWaypoints: function() {
    this.mapState.waypointMarkers.forEach(marker => marker.setMap(null));
    this.mapState.waypointMarkers = this.props.waypoints
      .filter(waypoint => waypoint.location)
      .map(waypoint => {
        return new google.maps.Marker({
          map: this.mapState.map,
          title: waypoint.name,
          position: waypoint.location
        });
      });
  },

  // Transient state used by Google Maps
  mapState: {
    map: undefined,
    directionsService: undefined,
    waypointMarkers: []
  },

  // Transient state for animation
  // TODO(ray): Wrap all of the functions that touch the animation state into
  // its own managed object
  animationState: {
    routeCoords: undefined,
    animatedLine: undefined,
    animatedMarker: undefined,
    curCoordIdx: undefined,
    unusedTicks: undefined
  },

  // Animator for the route
  animator: undefined,

  handleAnimate: function() {
    var latLngs = this.props.waypoints.filter(waypoint => waypoint.location).map(waypoint => waypoint.location);
    mapUtil.getRoute(this.mapState.directionsService, latLngs, function(err, coords) {
      if (err) {
        console.log("ERROR: An error occurred getting the route: " + err);
        return;
      }
      this.animate(coords);
    }.bind(this));
  },

  animate: function(coords) {
    this.clearAnimation(this.animationState);
    this.animationState = this.newAnimationState(coords);
    this.animator.start(this.animationState);
  },

  newAnimationState: function(routeCoords) {
    return {
      routeCoords: routeCoords,
      animatedLine: new google.maps.Polyline({
        path: [],
        geodesic: true,
        strokeColor: "#FF6961",
        strokeOpacity: 0.8,
        strokeWeight: 5,
        editable: false,
        map: this.mapState.map
      }),
      animatedMarker: new google.maps.Marker({
        map: this.mapState.map,
        icon: "images/car.png"
      }),
      curCoordIdx: 0,
      unusedTicks: 0
    };
  },

  renderRouteForward: function(ticks) {
    this.animationState.unusedTicks += ticks;

    // Consume as many ticks as we can to render paths between co-ords
    for (;;) {
      // End of animation
      if (this.animationState.curCoordIdx >= this.animationState.routeCoords.length-1) {
        return true;  // Indicate end
      }

      // Calculate the distance in meters between the current and next co-ord
      var curCoord = this.animationState.routeCoords[this.animationState.curCoordIdx];
      var nextCoord = this.animationState.routeCoords[this.animationState.curCoordIdx+1];
      var distance = google.maps.geometry.spherical.computeDistanceBetween(curCoord, nextCoord);

      // Break if we do not have enough ticks
      if (this.animationState.unusedTicks < distance) {
        break;
      }

      // Render co-ordinate and consume ticks
      this.animationState.animatedLine.getPath().push(nextCoord);
      this.animationState.animatedMarker.setPosition(nextCoord);
      this.animationState.unusedTicks -= distance;

      // Prepare for next co-ordinate
      this.animationState.curCoordIdx++;
    }
  },

  handleClear: function() {
    this.clearAnimation(this.animationState);
  },

  clearAnimation: function(animationState) {
    this.animator.stop();
    if (animationState.animatedLine) {
      animationState.animatedLine.setMap(null);
    }
    if (animationState.animatedMarker) {
      animationState.animatedMarker.setMap(null);
    }
  },

  initializeMap: function() {
    var initialLatLng = new google.maps.LatLng(
        this.props.initialLocation.lat,
        this.props.initialLocation.lng);

    var map = this.mapState.map = new google.maps.Map(document.getElementById("map-canvas"), {
      center: initialLatLng,
      zoom: this.props.initialZoom,
      styles: mapStyles.defaultMapStyles,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      streetViewControl: false,
      mapTypeControl: false
    });

    var animationControlContainer = document.createElement("div");
    animationControlContainer.id = "animation-control-container";
    ReactDOM.render(this.props.animationControl, animationControlContainer);
    map.controls[google.maps.ControlPosition.TOP].push(animationControlContainer);

    this.mapState.directionsService = new google.maps.DirectionsService();
  }

});

module.exports = MapPanel;
