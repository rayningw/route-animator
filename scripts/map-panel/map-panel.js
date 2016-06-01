/*global google*/
var React = require("react"),
  T = React.PropTypes;
var ReactDOM = require("react-dom");

var mapStyles = require("./map-styles.js");
var mapUtil = require("./map-util.js");

var notifierShape = T.shape({
  subscribe: T.func.isRequired
});

var latLngShape = T.shape({
  lat: T.number.isRequired,
  lng: T.number.isRequired
});

var MapPanel = React.createClass({

  propTypes: {
    animationControl: T.element.isRequired,
    onAnimateNotifier: notifierShape.isRequired,
    onClearNotifier: notifierShape.isRequired,
    waypoints: T.arrayOf(latLngShape.isRequired).isRequired,
    initialLocation: latLngShape.isRequired,
    initialZoom: T.number.isRequired
  },

  componentDidMount: function() {
    this.initializeMap();
    this.props.onAnimateNotifier.subscribe(this.handleAnimate);
    this.props.onClearNotifier.subscribe(this.handleClear);
  },

  render: function() {
    // NOTE: Somehow React knows not to touch the child elements created by Google Maps JS
    return (
      <div id="map-canvas"></div>
    );
  },

  // Transient state used by Google Maps
  mapState: {
    map: undefined,
    directionsService: undefined
  },

  // Transient state for animation
  animationState: {
    routeCoords: undefined,
    animatedLine: undefined,
    animatedMarker: undefined,
    timeoutId: undefined,
    curCoordIdx: undefined,
    curTick: undefined,
    prevRenderedTick: undefined
  },

  handleAnimate: function() {
    console.log("Animating");
    mapUtil.getRoute(this.mapState.directionsService, this.props.waypoints, function(err, coords) {
      if (err) {
        console.log("An error occurred getting the route: " + err);
        return;
      }
      this.animate(coords);
    }.bind(this));
  },

  // TODO(ray): Factor out animation code to self-contained animation object
  // that can be kicked off, paused, cleared, etc.
  animate: function(coords) {
    console.log("Animating number of coords: " + coords.length);

    this.resetAnimation(coords);
    this.nextTick();
  },

  resetAnimation: function(routeCoords) {
    this.clearAnimation();

    // TODO(ray): Factor this out into a newAnimationState(map, coords) func
    this.animationState.routeCoords = routeCoords;

    this.animationState.animatedLine = new google.maps.Polyline({
      path: [],
      geodesic: true,
      strokeColor: "#FF6961",
      strokeOpacity: 0.8,
      strokeWeight: 5,
      editable: false,
      map: this.mapState.map
    });

    this.animationState.animatedMarker = new google.maps.Marker({
      map: this.mapState.map,
      icon: "images/car.png"
    });

    this.animationState.curCoordIdx = 0;
    this.animationState.curTick = 0;
    this.animationState.prevRenderedTick = 0;
  },

  nextTick: function() {
    // TODO(ray): Factor out into configuration
    var speed = 100;
    var fps = 60;

    var prevCoord = this.animationState.routeCoords[this.animationState.curCoordIdx];
    var coord = this.animationState.routeCoords[++this.animationState.curCoordIdx];

    // End of animation
    if (this.animationState.curCoordIdx >= this.animationState.routeCoords.length - 1) {
      this.renderTick(coord);
      return;
    }

    var distance = google.maps.geometry.spherical.computeDistanceBetween(prevCoord, coord);
    var tickIncrement = distance / speed;
    this.animationState.curTick += tickIncrement;

    var ticksPerRender = 1000 / fps;
    if (this.animationState.curTick > this.animationState.prevRenderedTick + ticksPerRender) {
      this.animationState.timeoutId = setTimeout(function() {
        this.renderTick(coord);
        this.nextTick();
      }.bind(this), tickIncrement);
    }
    else {
      this.nextTick();
    }
  },

  renderTick: function(coord) {
    this.animationState.animatedLine.getPath().push(coord);
    this.animationState.animatedMarker.setPosition(coord);
    this.animationState.prevRenderedTick = this.animationState.curTick;
  },

  handleClear: function() {
    console.log("Clearing");
    this.clearAnimation();
  },

  clearAnimation: function() {
    if (this.animationState.animatedLine) {
      this.animationState.animatedLine.setMap(null);
    }
    if (this.animationState.animatedMarker) {
      this.animationState.animatedMarker.setMap(null);
    }
    if (this.animationState.timeoutId) {
      clearTimeout(this.animationState.timeoutId);
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
