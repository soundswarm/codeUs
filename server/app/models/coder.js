var bookshelf = require('../config');
var Promise = require('bluebird');
var Language = require('./language');


var Coder = bookshelf.Model.extend({
  tableName: 'coders',
  hasTimestamps: true,

  initialize: function(){
    this.on('creating', function(model, attrs, options) {
      this.populateJoins;
    }, this);
  },
  languages: function() {
    return this.belongsToMany(Language, 'language_id');
  },

  populateJoins: function(){
  	var userLanguages = {};
  	var userTechs = {};

  	// ******** PSEUDOCODE ************
  	// fetch the user's repos object

  	// then: loop through each repo object:
  		// if (not already there) adding 'language':size to the userLanguages object (e.g. 'javascript':106000)
			// if (already there) adding the repo's size to the userLanguages.language value
  		// if (not already there) adding 'tech':size to the userTechs object (e.g. 'angular':106000)
			// if (already there) adding the repo's size to the userTechs.tech value
  	
  	// then: add records in the join_coders_languages table for every k:v in the userLanguages object:
  		// coder_id
  		// get language_id from languages using languages.name
  		// set: coder_id, language_id, bytes_across_repos

		// then: add records in the join_coders_technologies table for every k:v in the userTechs object:
  		// coder_id
  		// get technology_id from technologies using technologies.name
  		// set: coder_id, technology_id, bytes_across_repos

  	// ********************** SHORTLY EXAMPLE *************************
  	// var cipher = Promise.promisify(bcrypt.hash);
    // return a promise - bookshelf will wait for the promise
    // to resolve before completing the create action
    // return cipher(this.get('password'), null, null)
    //   .bind(this)
    //   .then(function(hash) {
    //     this.set('password', hash);
    //   });
  }
});

module.exports = Coder;