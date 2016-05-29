var React = require('react');

var ControlPanel = React.createClass({

  handleAnimate: function(event) {
    this.props.onAnimate();
  },

  handleClear: function(event) {
    this.props.onClear();
  },

  render: function() {
    return (
      <div id="panel">
        <div id="panel-title">Route Animator</div>
        <button onClick={this.handleAnimate}>Animate</button>
        <button onClick={this.handleClear}>Clear</button>
      </div>
    );
  }

});

module.exports = ControlPanel;
