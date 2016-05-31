var React = require('react');
var Slideout = require('../vendor/slideout/slideout-0.1.12-modified.js');

var defaultConfig = require('./default-config.js');
var ControlPanel = require('../control-panel/control-panel.js');
var MapPanel = require('../map-panel/map-panel.js');

var App = React.createClass({

  getInitialState: function() {
    return {
      initialLocation: defaultConfig.initialLocation,
      initialZoom: defaultConfig.initialZoom,
      waypoints: defaultConfig.waypoints
    };
  },

  handleAnimate: function() {
    this.onAnimateNotifier.listeners.forEach(function(listener) {
      listener();
    });
  },

  handleClear: function() {
    this.onClearNotifier.listeners.forEach(function(listener) {
      listener();
    });
  },

  onAnimateNotifier: {
    listeners: [],
    subscribe: function(listener) {
      this.listeners.push(listener);
    }
  },

  onClearNotifier: {
    listeners: [],
    subscribe: function(listener) {
      this.listeners.push(listener);
    }
  },

  // Slideout handle object constructed after component mount
  slideout: undefined,

  toggleSlideout: function() {
    this.slideout.toggle();
  },

  componentDidMount: function() {
    this.slideout = this.slideout = new Slideout({
      panel: document.getElementById('content-panel'),
      menu: document.getElementById('menu'),
      // Size of slideout panel
      padding: 256,
      // How much flick to start toggle
      tolerance: 70,
      // How much off the edge to start slideout
      grabWidth: 50
    });
  },

  render: function() {
    var toggleSlideoutControl = (
      <button id="toggle-slide-control" onClick={this.toggleSlideout}>☰</button>
    );

    return (
      <div id="app">
        <nav id="menu">
          <ControlPanel onAnimate={this.handleAnimate}
                        onClear={this.handleClear} />
        </nav>
        <main id="content-panel">
          <header>
            <MapPanel toggleSlideoutControl={toggleSlideoutControl}
                      onAnimateNotifier={this.onAnimateNotifier}
                      onClearNotifier={this.onClearNotifier}
                      initialLocation={this.state.initialLocation}
                      initialZoom={this.state.initialZoom}
                      waypoints={this.state.waypoints} />
          </header>
        </main>
      </div>
    );
  }

});

module.exports = App;
