var Slideout = require("../slideout/slideout.js");
var ControlPanel = require("../control-panel/control-panel.js");
var MapPanel = require("../map-panel/map-panel.js");

var Notifier = require("../model/notifier.js").Notifier;

var defaultConfig = require("./default-config.js");

var React = require("react"),
  T = React.PropTypes;

var App = React.createClass({

  propTypes: {
    isTouchScreen: T.func.isRequired
  },

  getInitialState: function() {
    return {
      initialLocation: defaultConfig.initialLocation,
      initialZoom: defaultConfig.initialZoom,
      waypoints: defaultConfig.waypoints,
      animationSpeed: defaultConfig.animationSpeed
    };
  },

  onAnimateNotifier: new Notifier(),
  onClearNotifier: new Notifier(),
  onFitWaypointsNotifier: new Notifier(),
  onToggleNotifier: new Notifier(),

  handleAnimate: function() {
    this.onAnimateNotifier.notify();
  },

  handleClear: function() {
    this.onClearNotifier.notify();
  },

  handleFitWaypoints: function() {
    this.onFitWaypointsNotifier.notify();
  },

  handleToggleSlideout: function() {
    this.onToggleNotifier.notify();
  },

  handleWaypointsChange: function(changed) {
    this.setState({
      waypoints: changed
    });
    this.onFitWaypointsNotifier.notify();
  },

  handleAnimationSpeedChange: function(speed) {
    speed = speed || 0;
    this.setState({
      animationSpeed: speed
    });
  },

  render: function() {
    var animationControl = (
      <div id="animation-control" className="map-control">
        <button onClick={this.handleAnimate}>Animate</button>
        <span className="divider"></span>
        <button onClick={this.handleClear}>Clear</button>
      </div>
    );

    var menu = (
      <ControlPanel waypoints={this.state.waypoints}
                    onWaypointsChange={this.handleWaypointsChange}
                    animationSpeed={this.state.animationSpeed}
                    onAnimationSpeedChange={this.handleAnimationSpeedChange} />
    );

    var content = (
      <div>
        <button id="toggle-slide-btn" className="map-control" onClick={this.handleToggleSlideout}>☰</button>
        <MapPanel animationControl={animationControl}
                  onAnimateNotifier={this.onAnimateNotifier}
                  onClearNotifier={this.onClearNotifier}
                  onFitWaypointsNotifier={this.onFitWaypointsNotifier}
                  initialLocation={this.state.initialLocation}
                  initialZoom={this.state.initialZoom}
                  waypoints={this.state.waypoints}
                  animationSpeed={this.state.animationSpeed} />
      </div>
    );

    return (
      <div id="app">
        <Slideout isTouchScreen={this.props.isTouchScreen}
                  content={content}
                  menu={menu}
                  subscribeToToggle={this.onToggleNotifier.subscribe.bind(this.onToggleNotifier)} />
      </div>
    );
  }

});

module.exports = App;
