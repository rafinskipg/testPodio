var events = require('../events');
var React = require('react');
var api = require('../api');

var SpaceRow = React.createClass({
  getInitialState: function() {
    return this.props.space;
  },
  render: function() {
    return (
      <div className="space">
        {this.state.name}
      </div>
    );
  }
});


var SpaceSwitcher = React.createClass({
  getInitialState: function() {
    //Could be considered to use promises instead event communication,
    //But this would be reusable for other components
    events.suscribe('spaces', 'SpaceSwitcher', function(spaces){
      if(this.isMounted()){
        this.setState({ 
          spaces: spaces
        });
      }
    }.bind(this));

    api.fetch({
      name: 'spaces',
      path: 'spaces.json'
    });

    return {
      spaces: []
    };
  },
  handleChange: function(field, event){
    var nextState = {}
    nextState[field] = event.target.value;
    this.setState(nextState)
  },
  render: function() {
    var self = this;
    var rows = [];
    
    this.state.spaces.forEach(function(space) {
      rows.push(<SpaceRow space={space} />);
    });

    return (
      <div>
        <div className="title">Spaces</div>
        {rows}
      </div>
    );
  }
});


module.exports = SpaceSwitcher