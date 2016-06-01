var React = require("react");
var ReactDOM = require("react-dom");

var App = require("./app/app.js");

/*global navigator*/
function isTouchScreen() {
  // https://ctrlq.org/code/19616-detect-touch-screen-javascript
  return (("ontouchstart" in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}

ReactDOM.render(
  <App isTouchScreen={isTouchScreen} />,
  document.getElementById("content")
);
