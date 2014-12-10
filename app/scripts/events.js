'use strict';

var events = require('events');
var eventEmitter = new events.EventEmitter();
eventEmitter.setMaxListeners(100);

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
    }else if(suscribed[fnName][originModule]){
      eventEmitter.removeListener(fnName, suscribed[fnName][originModule].fn);
      eventEmitter.removeListener('error'+fnName, suscribed[fnName][originModule].errCb);
    }

    suscribed[fnName][originModule] = {
      fn: fn,
      errCb: errCb
    };

    eventEmitter.on(fnName, fn);
    eventEmitter.on('error'+fnName, errCb)
  });
}

function resetSuscriptions(){
  _.forIn(suscribed, function(itemValue, fnName){
    _.forIn(itemValue, function(opts){
      eventEmitter.removeListener(fnName,opts.fn);
      eventEmitter.removeListener(fnName,otps.errCb);
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