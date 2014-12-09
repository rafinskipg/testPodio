/**
 *
 * SpaceSwitcher sample app
 */
var app = require('./app.jsx');

$(document).ready(function(){
  console.log('Welcome to the demo');
  app.start($('.switcher')[0]);
});