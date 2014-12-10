'use strict';

var errors = [];

function add(fnName, args){
  errors.push({
    date : new Date(),
    name: fnName,
    data: args
  });

  console.log('Added one more error to your fails story, duh. \n Use errLog4js.list(); for seing them');
}

function list(){
  return errors;
}

window.errLog4js = module.exports = {
  add: add,
  list : list
}