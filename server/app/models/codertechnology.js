var bookshelf = require('../config');
// var Coder = require('./language');

var CoderTechnology = bookshelf.Model.extend({
  tableName: 'coders_technologies',
  hasTimestamps: true,
  coders: function() {
    return this.belongsToMany(Coder, 'coder_id');
  },
 
});

module.exports = CoderTechnology;