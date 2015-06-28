var bookshelf = require('../config');
var Coder = require('./language');

var Language = bookshelf.Model.extend({
  tableName: 'languages',
  hasTimestamps: true,

  initialize: function(){
    this.on('creating', function(model, attrs, options) {
      this.populateJoins;
    }, this);
  },
  coders: function() {
    return this.belongsToMany(Coder, 'coder_id')
  },
  populateJoins: function(){
    var userLanguages = {};
    var userTechs = {};
  }
});

module.exports = Language;