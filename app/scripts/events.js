'use strict';

var events = require('events');
var eventEmitter = new events.EventEmitter();
var _ = require('lodash');
var errorLogger = require('./errorLogger');
var suscribed = {};

function suscribe (fnNames, originModule, fn, errCb){
  fnNames = !_.isArray(fnNames) ? [fnNames] : fnNames;

  errCb = errCb ? errCb : function(err){
    console.log('Error on module '+ originModule +', '+ fnNames.join(',') + err);
  };

  fnNames.forEach(function(fnName){
    //Avoid various suscriptions with the same origin
    if(!suscribed[fnName]){
      suscribed[fnName] = {};
      suscribed[fnName][originModule] = fn;
    }else{
      suscribed[fnName][originModule] = fn;
    }

    eventEmitter.on(fnName, fn);
    eventEmitter.on('error'+fn, errCb)
    
  });
}

function resetSuscriptions(){
  _.forIn(suscribed, function(itemValue, fnName){
    _.forIn(itemValue, function(suscribedFunction){
      eventEmitter.removeListener(fnName,suscribedFunction);
    });
  });
}


function trigger(fnName, args){
  eventEmitter.emit(fnName, args);
}

function error(fnName, args){ 
  errorLogger.add(fnName, args);
  eventEmitter.emit('error'+fnName, args);
}

module.exports = {
  suscribe : suscribe,
  trigger: trigger,
  error: error
}