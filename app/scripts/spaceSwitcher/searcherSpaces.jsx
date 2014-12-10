var events = require('../events');
var React = require('react');
var _ = require('lodash');
/**
* Searcher
**/
var SearcherSpaces = React.createClass({
  getInitialState: function() {
    this._organizations = this.props.originalObj;
    this._selectionIndex = 0;

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
    }else if(e.which === 40){
      this.select(1);
      e.preventDefault();
    }else if(e.which === 38){
      this.select(-1);
      e.preventDefault();
    }else if(e.which === 13){
      e.preventDefault();
      if(this.selection){
        this.goToPage(this.selection);
      }
    }else{
      this.resetResults = false;
    }
  },
  getItems : function(){
    var elems = [];
    this._organizations.forEach(function(org){
      elems.push(org);
      org.spaces.forEach(function(space){
        elems.push(space);
      });
    });
    return elems;
  },
  select: function(modifier){
    this._selectionIndex += modifier;

    if(this._selectionIndex  < 0){
      this._selectionIndex = this.getItems().length - 1;
    }else if(this._selectionIndex >= this.getItems().length){
      this._selectionIndex = 0;
    }

    this.selection = this.getItems()[this._selectionIndex];
    
    if(this.selection){
      events.trigger('selectItem', this.selection);  
    }
  },
  goToPage: function(){
    if(this.selection && this.selection.url){
      window.location.href = this.selection.url;
    }
  },
  filter: function(value){
    if(this.resetResults){
      this.filterOrganizations('');
    }else{
      this.filterOrganizations(value);
    }

    this._selectionIndex = 0;
    this.select(0);
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

    this._organizations = orgsFiltered;

    events.trigger('spacesFiltered', {
      organizations: orgsFiltered,
      filterBy: textToFilterBy
    });
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