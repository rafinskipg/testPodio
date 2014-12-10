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

    return (
      <div className="space">
        {name}
      </div>
    );
  }
});

/*
* Each organization row on the results.
*/
var OrganizationBlock = React.createClass({
  render: function() {
    var filter = this.props.filterBy;
    var rows = this.props.org.spaces.map(function(space) {
      return(<SpaceRow space={space} filterBy={filter}/>);
    });

    return (
      <div className="organization row">
        <div className="col-xs-3 column-image">
          <img src={this.props.org.image.thumbnail_link}></img>
        </div>
        <div className="col-xs-9 column-results">
          <div className="organization-name">{this.props.org.name}</div>
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
    events.suscribe('filterspaces', 'SpaceSwitcherList', this.filterOrganizations.bind(this));

    var amountOfSpaces = this.props.originalObj
      .reduce(function(prev, next){ 
        return prev.spaces.length + next.spaces.length 
      });

    return {
      organizations: this.props.organizations,
      amountOfSpaces: amountOfSpaces
    }
  },
  filterOrganizations: function(textToFilterBy){

    function nameMeetsFilter(name){
      return name.toLowerCase().indexOf(textToFilterBy.toLowerCase()) != -1;
    }

    //Filters the spaces of the organization
    function spacesMeetsCriteria(organization){
      organization.spaces = _.compact(
        organization.spaces
        .map(function(space){
          if(nameMeetsFilter(space.name)){
            return space;
          }
        })
      );

      return organization;
    }

    //Returns the organizations that have more than 0 spaces matching or it's name matches
    function organizationMeetsCriteria(organization){
      if(organization.spaces.length > 0 || nameMeetsFilter(organization.name)){
        return organization;
      }
    }

    //Function that applies the above filters to the data
    function filter(organizations){
      return _.compact(
        _.cloneDeep(organizations)
        .map(spacesMeetsCriteria)
        .map(organizationMeetsCriteria)
      );
    }

    //If textToFilterBy == '' avoid filtering.
    var orgsFiltered = textToFilterBy ? filter(this.props.originalObj) : this.props.originalObj;

    this.setState({
      organizations: orgsFiltered,
      filterBy: textToFilterBy
    });
  },
  render: function() {
    var filterBy = this.state.filterBy;

    var rows = this.state.organizations.map(function(org) {
      return(<OrganizationBlock org={org} filterBy={filterBy}/>);
    });

    var searcher = null;
    if(this.state.amountOfSpaces > MAX_NUMBER_SPACES){
      searcher = <SearcherSpaces />
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