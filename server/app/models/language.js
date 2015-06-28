var bookshelf = require('../config');

var Language = bookshelf.Model.extend({
  tableName: 'languages',
  hasTimestamps: true,

  initialize: function(){
    this.on('creating', function(model, attrs, options) {
      this.populateJoins;
    }, this);
  },
  populateJoins: function(){
    var userLanguages = {};
    var userTechs = {};
  }
});

module.exports = Language;