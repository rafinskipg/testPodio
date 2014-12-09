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

var OrganizationBlock = React.createClass({
  getInitialState: function() {
    return this.props.org;
  },
  render: function() {
    return (
      <div className="organization row">
        <div className="col-xs-3 column-image">
          <img src={this.state.image.thumbnail_link}></img>
        </div>
        <div className="col-xs-9 column-results">
          <div className="organization-name">{this.state.name}</div>
        </div>
      </div>
    );
  }
});


var SpaceSwitcherList = React.createClass({
  getInitialState: function() {
    return {
      organizations: this.props.organizations
    }
  },
  render: function() {
    var rows = [];
    this.state.organizations.forEach(function(org) {
      rows.push(<OrganizationBlock org={org} />);
    });
    return (
      <div className="space-switcher-results">
        {rows}
      </div>
    );
  }
});


var SpaceSwitcher = React.createClass({
  getInitialState: function() {
    var defaultValue = this.props.data ? this.props.data : [];

    //For async load
    if(this.props.endpoint){
      //Could be considered to use promises instead event communication,
      //But this would be reusable for other components
      events.suscribe('spaces', 'SpaceSwitcher', function(organizations){
        if(this.isMounted()){
          this.setState({ 
            organizations: organizations
          });
        }
      }.bind(this));

      api.fetch({
        name: 'spaces',
        path: this.props.endpoint
      });
    }

    return {
      organizations: defaultValue,
      opened: false
    };
  },
  handleChange: function(field, event){
    var nextState = {}
    nextState[field] = event.target.value;
    this.setState(nextState)
  },
  handleClick: function(){
    this.setState({
      opened: !this.state.opened
    });
  },
  render: function() {
    var content = this.state.opened ? <SpaceSwitcherList organizations={this.state.organizations} /> : null;
    var iconClass = this.state.opened ? 'glyphicon glyphicon-chevron-up' : 'glyphicon glyphicon-chevron-down';
    var wrapperClass = this.state.opened ? 'space-switcher-title opened' : 'space-switcher-title closed';

    return (
      <div className="space-switcher">
        <div className={wrapperClass} onClick={this.handleClick}>
          <div>Go to space <span className={iconClass}></span></div>
        </div>
        {content}
      </div>
    );
  }
});


module.exports = SpaceSwitcher