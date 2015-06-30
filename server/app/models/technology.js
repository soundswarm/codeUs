var bookshelf = require('../config');
var Coder = require('./coder');

var Technology = bookshelf.Model.extend({
  tableName: 'technologies',
  hasTimestamps: true,

  coders: function() {
    return this.belongsToMany(Coder, 'coder_id');
  }
});

module.exports = Technology;