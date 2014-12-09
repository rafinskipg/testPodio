var events = require('../events');
var React = require('react');
var api = require('../api');
var _ = require('lodash');
var MAX_NUMBER_SPACES = 7;

/**
* Each space result on the list
**/
var SpaceRow = React.createClass({
  render: function() {
    return (
      <div className="space">
        {this.props.space.name}
      </div>
    );
  }
});

/*
* Each organization row on the results.
*/
var OrganizationBlock = React.createClass({
  render: function() {
    var rows = [];
    
    this.props.org.spaces.forEach(function(space) {
      rows.push(<SpaceRow space={space} />);
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
* Searcher
**/
var SearcherSpaces = React.createClass({
  getInitialState: function() {
    //Reset on esc
    events.suscribe('escape', 'SpaceSwitcherSearcher', function(){
      this.componentDidMount = function(){
        console.log('op')
        this.setState({
          text: ''
        })
      }.bind(this);

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

    this.filter();
  },
  handleKeyDown: function(e){
    if(e.which === 8){
      this.resetResults = true;
    }else{
      this.resetResults = false;
    }
  },
  filter: function(){
    if(this.resetResults){
      events.trigger('filterspaces', '');
    }else{
      events.trigger('filterspaces', this.state.text);
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
  filterOrganizations: function(textToFilter){

    function filterSpaces(filter){
      return function(organization){
        var spacesFiltered = _.compact(
          organization.spaces
          .map(function(space){
            if(space.name.toLowerCase().indexOf(filter.toLowerCase()) != -1){
              return space;
            }
          })
        );

        organization.spaces = spacesFiltered;

        return organization;
      }
    }

    function hasElementsMatching(filter){
      return function(organization){
        if(organization.spaces.length > 0 || organization.name.toLowerCase().indexOf(filter.toLowerCase()) != -1){
          console.log('espaces', organization.spaces)
          return organization;
        }
        
      }
    }

    function filter(organizations){
      return _.compact(
        _.cloneDeep(organizations)
        .map(filterSpaces(textToFilter))
        .map(hasElementsMatching(textToFilter))
      );
    }

    var orgsFiltered = textToFilter ? filter(this.props.originalObj) : this.props.originalObj;

    this.setState({
      organizations: orgsFiltered
    });
  },
  render: function() {
    var rows = [];
    this.state.organizations.forEach(function(org) {
      rows.push(<OrganizationBlock org={org} />);
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