var events = require('../events');
var React = require('react');
var api = require('../api');
var _ = require('lodash');
var MAX_NUMBER_SPACES = 7;

/**
* Each space result on the list
**/
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

/*
* Each organization row on the results.
*/
var OrganizationBlock = React.createClass({
  getInitialState: function() {
    return this.props.org;
  },
  render: function() {
    var rows = [];
    
    this.state.spaces.forEach(function(space) {
      rows.push(<SpaceRow space={space} />);
    });

    return (
      <div className="organization row">
        <div className="col-xs-3 column-image">
          <img src={this.state.image.thumbnail_link}></img>
        </div>
        <div className="col-xs-9 column-results">
          <div className="organization-name">{this.state.name}</div>
          <div className="organization-spaces">
            {rows}
          </div>
        </div>
      </div>
    );
  }
});

/**
* Searcher
**/
var SearcherSpaces = React.createClass({
  getInitialState: function() {
    //Reset on esc
    events.suscribe('escape', 'SpaceSwitcherSearcher', function(){
      this.setState({
        text: ''
      });
    }.bind(this));

    return {
      text: ''
    }
  },
  handleChange: function(event){
    var filter = event.target.value;
    this.setState({
      text: filter
    });
    console.log(filter);
  },
  render: function() {
    return (
      <div className="space-switcher-searcher-wrapper">
        <span className="glyphicon glyphicon-search"></span>
        <input type="text" value={this.state.text} onChange={this.handleChange}></input>
      </div>
    );
  }
});


/**
* Space switcher filter and list
**/
var SpaceSwitcherList = React.createClass({
  getInitialState: function() {
    events.suscribe('filter', 'SpaceSwitcherList', function(opts){
      this.setState({
        organizations: opts.results
      });
    });

    var amountOfSpaces = this.props.originalObj
      .reduce(function(prev, next){ 
        return prev.spaces.length + next.spaces.length 
      });

    return {
      organizations: this.props.organizations,
      amountOfSpaces: amountOfSpaces
    }
  },
  render: function() {
    var rows = [];
    this.state.organizations.forEach(function(org) {
      rows.push(<OrganizationBlock org={org} />);
    });

    var searcher = null;
    if(this.state.amountOfSpaces > MAX_NUMBER_SPACES){
      searcher = <SearcherSpaces organizations={this.state.originalObj} />
    }

    return (
      <div className="space-switcher-results">
        {searcher}
        {rows}
      </div>
    );
  }
});

var SpaceSwitcher = React.createClass({
  getInitialState: function() {
    var defaultValue = this.props.data ? this.props.data : [];
    var originalObj = _.cloneDeep(defaultValue);

    if(this.props.endpoint){
      //Could be considered to use promises instead of event communication
      events.suscribe('spaces', 'SpaceSwitcher', function(organizations){
        if(this.isMounted()){
          originalObj = _.cloneDeep(organizations);

          this.setState({ 
            organizations: organizations,
            originalObj: originalObj
          });
        }
      }.bind(this));

      api.fetch({
        name: 'spaces',
        path: this.props.endpoint
      });
    }

    //Reset on esc
    events.suscribe('escape', 'SpaceSwitcher', function(){
      this.setState({
        opened: false,
        organizations: originalObj
      });
    }.bind(this));

    return {
      organizations: defaultValue,
      originalObj: originalObj,
      opened: false
    };
  },
  changeState: function(){
    this.setState({
      opened: !this.state.opened
    });
  },
  render: function() {
    var content = this.state.opened ? <SpaceSwitcherList organizations={this.state.organizations} originalObj={this.state.originalObj} /> : null;
    var iconClass = this.state.opened ? 'glyphicon glyphicon-chevron-up' : 'glyphicon glyphicon-chevron-down';
    var wrapperClass = this.state.opened ? 'space-switcher-title opened' : 'space-switcher-title closed';

    return (
      <div className="space-switcher">
        <div className={wrapperClass} onClick={this.changeState}>
          <div>Go to space <span className={iconClass}></span></div>
        </div>
        {content}
      </div>
    );
  }
});


module.exports = SpaceSwitcher