/**
 *
 * SpaceSwitcher sample app
 */
var app = require('./app.jsx');
var events = require('./events.js');

function initEvents(){
  $(window).on('click', function(event){
    events.trigger('windowClicked', event);
  });

  $(window).keyup(function(event) {
    if (event.keyCode == 27) { 
      events.trigger('escape', event);
    }
  });
}

$(document).ready(function(){
  console.log('Welcome to the demo');
  initEvents();
  app.start($('.switcher')[0]);
});