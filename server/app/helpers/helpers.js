// populate a single Coder's profile 
var Coder = require('../models/coder');
var Coders = require('../collections/coders');
var rp = require('request-promise');
var bb = require('bluebird');
var _ = require('underscore');
var token = 'ADD HERE';// add one of our tokens 
                                                       // do not push this file with token
                                                       // to GitHub!
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
    var scores = {};
    _.each(repos, function(repo) {
      
      //calculate languages
      _.each(repo.languages, function(kilobytes, language) {
        if(scores[language]) {
          scores[language] += Math.round(kilobytes/1000);
        } else {
          scores[language] = Math.round(kilobytes/1000);
        }
      })

      //calculate stargazers
      if(scores.stargazers_count) {
        scores.stargazers_count += repo.stargazers_count
      } else {
        scores.stargazers_count = repo.stargazers_count
      }

      //calculate watchers
      if(scores.watchers_count) {
        scores.watchers_count += repo.watchers_count
      } else {
        scores.watchers_count = repo.watchers_count
      }
      //calculate forks
      if(scores.forks) {
        scores.forks += repo.forks
      } else {
        scores.forks = repo.forks
      }
    })
    return scores;
  },
  saveTodB: function(username, scores) {
    new Coder({gh_username: username})
    .fetch()
    .then(function(coder) {
      coder.save({
        stargazers_count: scores.stargazers_count,
        watchers_count: scores.watchers_count,
        forks: scores.forks
      })
      .then(function(coder) {
        Coders.set(coder)
      })
    })
  }
  
};
var username = 'soundswarm';

// create a new coder. DELETE THIS. JUST HERE FOR TESTING
// var coder = new Coder({
//  gh_username: username,
// });
// coder.save().then(function(newCoder){
//  Coders.add(newCoder);
//  console.log('new coder added to collection', newCoder);
// });

//get repos scores then add them to database
// api.getUser(username).promise().bind(api)
//   .then(api.getRepos)
//   .then(api.getReposLanguages)
//   .then(api.reposScores)
//   .then(function(scores) {
//     api.saveTodB(username, scores);
//   })
//   .then(function() {

//   })
//   .catch(console.error)
