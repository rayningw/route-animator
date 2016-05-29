var React = require('react');

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

  render: function() {
    return (
      <div id="app">
        <ControlPanel onAnimate={this.handleAnimate}
                      onClear={this.handleClear} />
        <MapPanel onAnimateNotifier={this.onAnimateNotifier}
                  onClearNotifier={this.onClearNotifier}
                  initialLocation={this.state.initialLocation}
                  initialZoom={this.state.initialZoom} />
      </div>
    );
  }

});

module.exports = App;
