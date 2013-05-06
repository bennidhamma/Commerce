require ('../vendor/main')

var Friend = DS.Model.extend({

  id: DS.attr('string'),

  image: DS.attr('string'),

  name: DS.attr('string')

});

module.exports = Friend;

