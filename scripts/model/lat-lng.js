var React = require("react"),
  T = React.PropTypes;

var shape = T.shape({
  lat: T.number.isRequired,
  lng: T.number.isRequired
});

module.exports.shape = shape;
