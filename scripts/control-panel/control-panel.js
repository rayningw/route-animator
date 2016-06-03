var React = require("react"),
  T = React.PropTypes;

var WaypointEditor = require("../waypoint-editor/waypoint-editor.js");

var waypoint = require("../model/waypoint.js");

var ControlPanel = React.createClass({

  propTypes: {
    waypoints: T.arrayOf(waypoint.shape.isRequired).isRequired,
    onWaypointsChange: T.func.isRequired,
    animationSpeed: T.number.isRequired,
    onAnimationSpeedChange: T.func.isRequired
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

  deleteWaypoint: function(index) {
    var toBe = this.props.waypoints.slice();
    toBe.splice(index, 1);
    this.props.onWaypointsChange(toBe);
  },

  render: function() {
    var waypoints = this.props.waypoints.map((waypoint, i) => {
      return (
        // TODO(ray): Generate a unique key upon creation
        <div className="waypoint-row" key={waypoint.name + "-" + i}>
          <div className="bubble-btn bubble-btn-plus-icon" onClick={() => this.insertWaypoint(i)}>+</div>
          <div className="bubble-btn bubble-btn-minus-icon delete-waypoint" onClick={() => this.deleteWaypoint(i)}>-</div>
          <WaypointEditor waypoint={waypoint}
                          onChange={changed => this.handleWaypointChange(changed, i)} />
        </div>
      );
    });

    return (
      <div id="control-panel">
        <h1>Route Animator</h1>
        <div className="divider" />
        <h3>Animation Speed (km/s)</h3>
        <input type="number"
               defaultValue={this.props.animationSpeed}
               onChange={(e) => this.props.onAnimationSpeedChange(e.target.value ? parseInt(e.target.value) : null)} />
        <div className="divider" />
        <h2>Waypoints</h2>
        {waypoints}
        <div className="waypoint-row">
          <div className="bubble-btn bubble-btn-plus-icon"
               onClick={() => this.insertWaypoint(this.props.waypoints.length)}>+</div>
        </div>
      </div>
    );
  }

});

module.exports = ControlPanel;
