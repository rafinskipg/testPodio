var events = require('../events');
var React = require('react');
var api = require('../api');
var _ = require('lodash');
var SearcherSpaces = require('./searcherSpaces.jsx')
var MAX_NUMBER_SPACES = 7;

/**
* Each space result on the list
**/
var SpaceRow = React.createClass({
  getInitialState: function(){
    events.suscribe('selectItem', this.props.space.name, this.setItemSelected);
    return {
      space: this.props.space
    }
  },
  setItemSelected: function(item){
    if(this.isMounted()){
      this.setState({
        selected : item.id === this.props.space.id
      });
    }
  },
  render: function() {

    function addHighlightedSpan(str, filter){
      var start = str.toLowerCase().indexOf(filter.toLowerCase());
      var end = start + filter.length;
      var strBegin = str.slice(0, start);
      var strMid = str.slice(start, end);
      var strEnd = str.slice(end, str.length);

      return (<div>{strBegin}<span className="highlighted-str">{strMid}</span>{strEnd}</div>);
    }

    var name = this.props.filterBy ? addHighlightedSpan(this.props.space.name, this.props.filterBy) : this.props.space.name;
    var className = this.state.selected ? "space active" : "space";

    return (
      <div className={className}>
        {name}
      </div>
    );
  }
});

/*
* Each organization row on the results.
*/
var OrganizationBlock = React.createClass({
  getInitialState: function(){
    events.suscribe('selectItem', this.props.org.name, this.setItemSelected);
    return {
      org: this.props.org
    }
  },
  setItemSelected: function(item){
    if(this.isMounted()){
      this.setState({
        selected : item.id === this.props.org.id
      });
    }
  },
  render: function() {
    var filter = this.props.filterBy;
    var className = this.state.selected ? "organization-name active" : "organization-name";

    var rows = this.props.org.spaces.map(function(space) {
      return(<SpaceRow space={space} filterBy={filter}/>);
    });

    return (
      <div className="organization row">
        <div className="col-xs-3 column-image">
          <img src={this.props.org.image.thumbnail_link}></img>
        </div>
        <div className="col-xs-9 column-results">
          <div className={className}>{this.props.org.name}</div>
          <div className="organization-spaces">
            {rows}
          </div>
        </div>
      </div>
    );
  }
});


/**
* Space switcher filter and list
**/
var SpaceSwitcherList = React.createClass({
  getInitialState: function() {
    events.suscribe('spacesFiltered', 'SpaceSwitcherList', this.spacesFiltered.bind(this));

    var amountOfSpaces = this.props.originalObj
      .reduce(function(prev, next){ 
        return prev.spaces.length + next.spaces.length 
      });

    return {
      organizations: this.props.organizations,
      amountOfSpaces: amountOfSpaces
    }
  },
  spacesFiltered: function(opts){
     this.setState({
      organizations: opts.organizations,
      filterBy: opts.filterBy
    });
  },
  render: function() {
    var filterBy = this.state.filterBy;

    var rows = this.state.organizations.map(function(org) {
      return(<OrganizationBlock org={org} filterBy={filterBy}/>);
    });

    var searcher = null;
    if(this.state.amountOfSpaces > MAX_NUMBER_SPACES){
      searcher = <SearcherSpaces originalObj={this.props.originalObj}/>
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