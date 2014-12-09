var SpaceSwitcher = require('./spaceSwitcher');
var React = require('react');

function start (element) {
  var App = React.createClass({
    render: function () {
      return (
        <SpaceSwitcher endpoint="spaces.json" />
      );
    }
  });

  React.render(<App/>, element);
}

module.exports = {
  start: start
}