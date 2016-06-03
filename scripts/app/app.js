var React = require("react"),
  T = React.PropTypes;
var Slideout = require("../vendor/slideout/slideout-0.1.12-modified.js");

var defaultConfig = require("./default-config.js");
var ControlPanel = require("../control-panel/control-panel.js");
var MapPanel = require("../map-panel/map-panel.js");

var Notifier = require("../model/notifier.js").Notifier;

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

  handleAnimate: function() {
    this.onAnimateNotifier.notify();
  },

  handleClear: function() {
    this.onClearNotifier.notify();
  },

  handleFitWaypoints: function() {
    this.onFitWaypointsNotifier.notify();
  },

  handleWaypointsChange: function(changed) {
    this.setState({
      waypoints: changed
    });
    this.onFitWaypointsNotifier.notify();
  },

  // Slideout handle object constructed after component mount
  slideout: undefined,

  toggleSlideout: function() {
    this.slideout.toggle();
  },

  handleAnimationSpeedChange: function(speed) {
    speed = speed || 0;
    this.setState({
      animationSpeed: speed
    });
  },

  componentDidMount: function() {
    var slideout = this.slideout = new Slideout({
      panel: document.getElementById("content-panel"),
      menu: document.getElementById("menu"),
      // Size of slideout panel
      padding: 256,
      // How much flick to start toggle
      tolerance: 70,
      // How much off the edge to start slideout
      grabWidth: 50
    });

    // Render as we might need to extend/contract grab area
    slideout.on("open", this.forceUpdate.bind(this));
    slideout.on("close", this.forceUpdate.bind(this));
  },

  render: function() {
    // Extend grab area while slideout is open to prevent map movement when the
    // user swipes the slideout to contract it again.
    var grabAreaClass;
    if (this.props.isTouchScreen() && this.slideout && this.slideout.isOpen()) {
      grabAreaClass = "grab-area-wide";
    } else {
      grabAreaClass = "";
    }

    var animationControl = (
      <div id="animation-control" className="map-control">
        <button onClick={this.handleAnimate}>Animate</button>
        <span className="divider"></span>
        <button onClick={this.handleClear}>Clear</button>
      </div>
    );

    return (
      <div id="app">
        <nav id="menu">
          <ControlPanel waypoints={this.state.waypoints}
                        onWaypointsChange={this.handleWaypointsChange}
                        animationSpeed={this.state.animationSpeed}
                        onAnimationSpeedChange={this.handleAnimationSpeedChange} />
        </nav>
        <main id="content-panel">
          <div id="grab-area" className={grabAreaClass}>
            <button id="toggle-slide-btn" className="map-control" onClick={this.toggleSlideout}>☰</button>
          </div>
          <MapPanel animationControl={animationControl}
                    onAnimateNotifier={this.onAnimateNotifier}
                    onClearNotifier={this.onClearNotifier}
                    onFitWaypointsNotifier={this.onFitWaypointsNotifier}
                    initialLocation={this.state.initialLocation}
                    initialZoom={this.state.initialZoom}
                    waypoints={this.state.waypoints}
                    animationSpeed={this.state.animationSpeed} />
        </main>
      </div>
    );
  }

});

module.exports = App;
