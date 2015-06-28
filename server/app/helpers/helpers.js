// populate a single Coder's profile 
var Coder = require('../models/coder');
var Coders = require('../collections/coders');
var rp = require('request-promise');
var bb = require('bluebird');
var _ = require('underscore');
var token = 'd30257ae0090811432ece3d7565ba088edb74d7b';// add one of our tokens 
                                                       // do not push this file with token
                                                       // to GitHub!
module.exports = api = {
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
  getReposTechnologies: function(repos) {

  },
  reposScores: function(repos) {
    var scores = {};
    scores.cred = {};
    scores.languages = {};
    scores.technologies = {};
    _.each(repos, function(repo) {
      
      //calculate languages
      _.each(repo.languages, function(kilobytes, language) {
        if(scores.languages[language]) {
          scores.languages[language] += Math.round(kilobytes/1000);
        } else {
          scores.languages[language] = Math.round(kilobytes/1000);
        }
      })

      //calculate stargazers
      if(scores.cred.stargazers_count) {
        scores.cred.stargazers_count += repo.stargazers_count
      } else {
        scores.cred.stargazers_count = repo.stargazers_count
      }

      //calculate watchers
      if(scores.cred.watchers_count) {
        scores.cred.watchers_count += repo.watchers_count
      } else {
        scores.cred.watchers_count = repo.watchers_count
      }
      //calculate forks
      if(scores.cred.forks) {
        scores.cred.forks += repo.forks
      } else {
        scores.cred.forks = repo.forks
      }
    })
    return scores;
  },
  saveToCodersTable: function(username, scores) {
    var coder =  new Coder({
      login: username,
      stargazers_count: scores.cred.stargazers_count,
      watchers_count: scores.cred.watchers_count,
      forks: scores.cred.forks
    })
    return coder.save()
      .then(function(coder) {
        Coders.add(coder)
        console.log('new coder added to db', coder);
        return coder;
      })
  },
  saveToLanguagesTable: function(languages) {
    //takes in object of languages
    // loop through languages
    // if language not in database
    // add to database
  }
  // getScoresAddCoderToDb: function(username) {
  //   return this.getUser(username).promise().bind(this)
  //     .then(this.getRepos)
  //     .then(this.getReposLanguages)
  //     .then(this.reposScores)
  //     .then(function(scores) {
  //       //send response
  //       //saveToCodersTable
  //       // saveToLanguagesTable
  //       return this.saveToCodersTable(username, scores);
  //     })
  //     .catch(console.error)
  // }
};


//get repos scores then add them to database
// var username ='soundswarm';
// api.getUser(username).promise().bind(api)
//   .then(api.getRepos)
//   .then(api.getReposLanguages)
//   .then(api.reposScores)
//   .then(function(scores) {
//     api.saveTodB(username, scores);
//   })
//   .then(function() {
//     console.log('SCORES ADDED');
//   })
//   .catch(console.error)