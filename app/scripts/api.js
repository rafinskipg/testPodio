var settings = require('./settings');
var events = require('./events');

function fetch(opts){
  $.ajax(settings.basePath + '/' +opts.path)
    .then(function(response){
      console.log('Response with length %s', response.length);
      events.trigger(opts.name, response);
    })
    .fail(function(err){
      events.error(opts.name, err);
    });
}

function create(opts){
  $.post(settings.basePath + '/' +opts.path, opts.data)
    .then(function(response){
      console.log('Response with id %s', response.id);
      events.trigger(opts.name, response.data);
    })
    .fail(function(err){
      events.error(opts.name, err);
    });
}

function update(opts){
  $.ajax({
    type: 'PUT',
    url: settings.basePath + '/' +opts.path,
    data: opts.data
  })
  .then(function(response){
    console.log('Response with id %s', response.id);
    events.trigger(opts.name, response.data);
  })
  .fail(function(err){
    events.error(opts.name, err);
  });
}

function kill(opts){
  $.ajax({
    type: 'DELETE',
    url: settings.basePath + '/' +opts.path
  })
  .then(function(response){
    console.log('Response with id %s', response.id);
    events.trigger(opts.name, response.data);
  })
  .fail(function(err){
    events.error(opts.name, err);
  });
}

module.exports = {
  fetch: fetch,
  create: create,
  update: update,
  kill: kill
}