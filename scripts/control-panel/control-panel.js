var React = require("react");

var ControlPanel = React.createClass({

  propTypes: {
    onAnimate: React.PropTypes.func.isRequired,
    onClear: React.PropTypes.func.isRequired
  },

  handleAnimate: function() {
    this.props.onAnimate();
  },

  handleClear: function() {
    this.props.onClear();
  },

  render: function() {
    return (
      <div id="control-panel">
        <div id="control-panel-title">Route Animator</div>
        <button onClick={this.handleAnimate}>Animate</button>
        <button onClick={this.handleClear}>Clear</button>
      </div>
    );
  }

});

module.exports = ControlPanel;
