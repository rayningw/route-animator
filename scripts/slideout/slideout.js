var React = require("react"),
  T = React.PropTypes;

var Slideout = require("../vendor/slideout/slideout-0.1.12-modified.js");

var SlideoutClass = React.createClass({

  propTypes: {
    isTouchScreen: T.func.isRequired,
    content: T.element.isRequired,
    menu: T.element.isRequired,
    // Notified by the parent when it wants the slideout to toggle
    subscribeToToggle: T.func.isRequired
  },

  // Slideout handle object constructed after component mount
  slideout: undefined,

  toggleSlideout: function() {
    this.slideout.toggle();
  },

  componentDidMount: function() {
    var slideout = this.slideout = new Slideout({
      panel: this.refs.contentContainer,
      menu: this.refs.menuContainer,
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

    this.props.subscribeToToggle(this.toggleSlideout);
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

    return (
      <div>
        <nav ref="menuContainer">
          {this.props.menu}
        </nav>
        <main ref="contentContainer">
          <div id="grab-area" className={grabAreaClass} />
          {this.props.content}
        </main>
      </div>
    );
  }

});

module.exports = SlideoutClass;
