var React = require('react');
var ReactDOM = require('react-dom');

var mapStyles = require('./map-styles.js');
var MapPanel = React.createClass({

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

  mapState: {
    map: undefined,
  },

  handleAnimate: function() {
    // TODO(ray): Implement
    console.log("Animating");
  },

  handleClear: function() {
    // TODO(ray): Implement
    console.log("Clearing")
  },

  initializeMap: function() {
    var initialLatLng = new google.maps.LatLng(
        this.props.initialLocation.lat,
        this.props.initialLocation.lng);
    this.mapState.map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: initialLatLng,
      zoom: this.props.initialZoom,
      styles: mapStyles.defaultMapStyles,
      // Re-position controls normally on the bottom to the top as they are cut
      // off by the map panel overflow. See note on css.
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      }
    });
  },

});

module.exports = MapPanel;
