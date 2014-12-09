var SpaceSwitcher = require('./spaceSwitcher');
var React = require('react');

var App = React.createClass({
  render: function () {
    return (
      <RouteHandler/>
    );
  }
});

function start (element) {
  var App = React.createClass({
    render: function () {
      return (
        <SpaceSwitcher/>
      );
    }
  });

  React.render(<App/>, element);
}

module.exports = {
  start: start
}