var db = require('../config');
var Promise = require('bluebird');

var CoderBrief = db.Model.extend({
  tableName: 'coders',
  hasTimestamps: true
});

module.exports = CoderBrief;