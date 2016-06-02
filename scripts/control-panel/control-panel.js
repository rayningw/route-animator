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

  insertWaypoint: function(beforeIndex) {
    var toBe = this.props.waypoints.slice();
    toBe.splice(beforeIndex, 0, {
      name: ""
    });
    this.props.onWaypointsChange(toBe);
  },

  render: function() {
    var waypoints = this.props.waypoints.map((waypoint, i) => {
      return (
        // TODO(ray): Generate a unique key upon creation
        <div key={waypoint.name + "-" + i}>
          <div className="insert-waypoint" onClick={() => this.insertWaypoint(i)}>+</div>
          <WaypointEditor waypoint={waypoint}
                          onChange={changed => this.handleWaypointChange(changed, i)} />
        </div>
      );
    });

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
