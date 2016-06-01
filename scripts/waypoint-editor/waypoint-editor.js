/*global google*/
var React = require("react"),
  T = React.PropTypes;

var waypoint = require("../model/waypoint.js");

var WaypointEditor = React.createClass({

  propTypes: {
    waypoint: waypoint.shape.isRequired,
    onChange: T.func.isRequired
  },

  initSearchBox: function(ref) {
    var searchBox = new google.maps.places.SearchBox(ref);
    searchBox.addListener("places_changed", function() {
      this.handlePlacesChanged(searchBox, ref);
    }.bind(this));
  },

  // Handle user selection of a place
  // searchBox is the Google Maps SearchBox object
  // inputElem is the DOM element object
  handlePlacesChanged: function(searchBox, inputElem) {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    // Not sure how it is possible to have multiple places selected
    if (places.length > 1) {
      console.log("WARN: User selected more than 1 place");
    }
    var waypoint = this.getWaypointFromPlace(places[0], inputElem.value);
    this.props.onChange(waypoint);
  },

  // Construct a waypoint object from a place object and the text that existed
  // on the search input element. NOTE: The place object does not contain the
  // search text.
  getWaypointFromPlace: function(place, searchText) {
    return {
      name: searchText,
      location: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
    };
  },

  render: function() {
    return (
      <div className="waypoint-editor">
        <input type="text" ref={this.initSearchBox} defaultValue={this.props.waypoint.name} />
        <div className="waypoint-lat-lng">
          ({this.props.waypoint.location.lat}, {this.props.waypoint.location.lng})
        </div>
      </div>
    );
  }

});

module.exports = WaypointEditor;
