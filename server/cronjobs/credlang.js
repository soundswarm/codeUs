var api = require('request-promise');
var bb = require('bluebird');
var _ = require('underscore');
var RateLimiter = require('limiter').RateLimiter;

var Coder = require('../app/models/coder');
var Coders = require('../app/collections/coders');
var Language = require('../app/models/language');
var Languages = require('../app/collections/languages');
var CoderLanguage = require('../app/models/coderlanguage');
var CodersLanguages = require('../app/collections/coderslanguages');

var token = 'd37c94450a7ace1e305d896aa7c5b248fbe355d6';

var options = {
	url: 'https://api.github.com/users/',
	headers: {
		'User-Agent': 'CodeUs-App',
		'Authorization': 'token '+ token 
	},
	transform: function(body, response) {  
	      return JSON.parse(body);
  }
};

var username;
var scores = {};

module.exports = function credlang() {

	// pass in coder_id, returns repos object as promise
	var getRepos = function(coder_id) {
    return new Coder({id: coder_id}).fetch()
    	.then(function(coder) {
    		username = coder.attributes.login;
    		options.url = 'https://api.github.com/users/' + username + '/repos';
    		return api(options);
    	});
    };

  var reposScores = function(repos) {
  	var langs = {};
    scores.primaryLang;
    scores.stars = 0;
    scores.watchers_count = 0;
    scores.forks = 0;

    _.each(repos, function(repo) {

      //calculate "cred" scores
      scores.stars += repo.stargazers_count;
      scores.watchers_count += repo.watchers_count;
      scores.forks += repo.forks_count;

      // calculate primary language
      if (langs[repo.language]) {
      	langs[repo.language]++;
      } else {
      	langs[repo.language] = 1;
      }

    });
    var max = Object.keys(langs)[0];
    for (var key in langs) {
    	max = langs[key] > langs[max] ? key : max;
    }
    scores.primaryLang = max;
    return scores;
  };

  var saveToCodersTable = function() {
    new Coder({login: username}).fetch()
    	.then(function(coder) {
    		coder.save({
		      stargazers_count: scores.stars,
		      watchers_count: scores.watchers_count,
		      forks: scores.forks,
		      primary_lang: scores.primaryLang
    		})
      .then(function(coder) {
        console.log('New coder cred added to db: ', coder.attributes.login);
      });
  	});
  };

  var getAndStoreScores = function(i) {
  	getRepos(i)
	  .then(function(repos) {
	  	reposScores(repos)
	  })
	  .then(function(scores) {
	    saveToCodersTable(scores);
	    getAndStoreScores(i+1);
	  })
	  .catch(console.error)
	};

	getAndStoreScores(405);

};