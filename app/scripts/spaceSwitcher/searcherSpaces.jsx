var events = require('../events');
var React = require('react');

/**
* Searcher
**/
var SearcherSpaces = React.createClass({
  getInitialState: function() {
    return {
      text: ''
    }
  },
  handleChange: function(event){
    var filter = event.target.value;
    this.setState({
      text: filter
    });

    this.filter(filter);
  },
  handleKeyDown: function(e){
    if(e.which === 8){
      this.resetResults = true;
    }else{
      this.resetResults = false;
    }
  },
  filter: function(value){
    if(this.resetResults){
      events.trigger('filterspaces', '');
    }else{
      events.trigger('filterspaces', value);
    }
  },
  render: function() {
    return (
      <div className="space-switcher-searcher-wrapper">
        <span className="glyphicon glyphicon-search"></span>
        <input type="text" value={this.state.text} onChange={this.handleChange} onKeyDown={this.handleKeyDown}></input>
      </div>
    );
  }
});

module.exports = SearcherSpaces;