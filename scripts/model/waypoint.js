var React = require("react"),
  T = React.PropTypes;

var lngLng = require("./lat-lng.js");

var shape = T.shape({
  name: T.string.isRequired,
  location: lngLng.shape
});

module.exports.shape = shape;
