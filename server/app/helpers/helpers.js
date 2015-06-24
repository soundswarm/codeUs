// populate a single Coder's profile 
var Coder = require('../models/coder');
var Coders = require('../collections/coders');
var rp = require('request-promise');
var bb = require('bluebird');
var _ = require('underscore');
var token =  "5fb3423cb05581ac762ecab2f9484d3d9f5c6be9";

var api = {
//get user
//get repos
// for each repos
  // extend languages
  // extend cred
  // extend technologies
// total repoScores
  root:'https://api.github.com',
  options: {
    headers: {
      'User-Agent': 'CodeUs-App',
      'Authorization': 'token '+token 
    },
    transform: function(body, response) {  
      return JSON.parse(body);
    }
  },
  authenticateUser: function(token) {
    return user;
  },
  getUser: function(username) {
    this.options.url = this.root+'/users/'+username;
    return rp(this.options);
    // returns user object
  },
  getRepos: function(user) {
    this.options.url  = user.repos_url;
    return rp(this.options);
    //returns array of repo objects
  },
  getReposLanguages: function(repos) {
    return bb.all(repos.map(function(repo) {
      this.options.url = repo.languages_url;
      return rp(this.options)
     }, this))
     .then(function(languages) {
      	for(var i=0;i<repos.length; i++) {
      		repos[i].languages= languages[i];
      	}
      	return repos;
      })
  },
  getReposCred: function(repos) {

  },
  getReposTechnologies: function(repos) {

  },
  reposScores: function(repos) {
  	var res = {};
  	_.each(repos, function(repo) {
  		
  		//calculate languages
  		_.each(repo.languages, function(kilobytes, language) {
  			if(res[language]) {
  				res[language] += kilobytes/1000;
  			} else {
  				res[language] = kilobytes/1000;
  			}
  		})

  		//calculate stargazers
  		if(res.stargazers_count) {
				res.stargazers_count += repo.stargazers_count
			} else {
				res.stargazers_count = repo.stargazers_count
			}

			//calculate watchers
  		if(res.watchers_count) {
				res.watchers_count += repo.watchers_count
			} else {
				res.watchers_count = repo.watchers_count
			}
			if(res.forks) {
				res.forks += repo.forks
			} else {
				res.forks = repo.forks
			}
  	})
  	return res;
  }
  
};
var username = 'soundswarm';
api.getUser(username).promise().bind(api)
  .then(api.getRepos)
  .then(api.getReposLanguages)
  .then(api.reposScores)
  .then(function(b){
    console.dir(b)
  })



// rp(options)
// 	.then(function(response) {
// 		var parsed = JSON.parse(response);
// 		var coder = new Coder({
// 			gh_username: parsed.login,
// 			name: parsed.name,
// 			location: parsed.location,
// 			email: parsed.email,
// 			gh_site_url: parsed.blog,
// 			photo_url: parsed.avatar_url,
// 			gh_member_since: parsed.created_at
// 		});
// 		coder.save().then(function(newCoder){
// 			Coders.add(newCoder);
// 			console.log('new coder added to collection', newCoder);
// 		});
// });

