var React = require("react"),
  T = React.PropTypes;

var WaypointEditor = require("../waypoint-editor/waypoint-editor.js");

var waypoint = require("../model/waypoint.js");

var ControlPanel = React.createClass({

  propTypes: {
    waypoints: T.arrayOf(waypoint.shape.isRequired).isRequired,
    onWaypointsChange: T.func.isRequired
  },

  handleWaypointChange: function(changed, index) {
    var toBe = this.props.waypoints.slice();
    toBe[index] = changed;
    this.props.onWaypointsChange(toBe);
  },

  render: function() {
    var waypoints = this.props.waypoints.map(function(waypoint, i) {
      return (
        <WaypointEditor key={i}
                        waypoint={waypoint}
                        onChange={changed => this.handleWaypointChange(changed, i)} />
      );
    }.bind(this));

    return (
      <div id="control-panel">
        <h1>Route Animator</h1>
        <div className="divider" />
        <h2>Waypoints</h2>
        {waypoints}
      </div>
    );
  }

});

module.exports = ControlPanel;
