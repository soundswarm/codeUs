// populate a single Coder's profile 
var Coder = require('../models/coder');
var Coders = require('../collections/coders');
var Language = require('../models/language');
var Languages = require('../collections/languages');
var Technology = require('../models/technology');
var Technologies = require('../collections/technologies');
var CoderLanguage = require('../models/coderlanguage');
var CodersLanguages = require('../collections/coderslanguages');
var CoderTechnology = require('../models/codertechnology');
var CodersTechnologies = require('../collections/coderstechnologies');

var rp = require('request-promise');
var bb = require('bluebird');
var _ = require('underscore');
var token = '1ce7e4e705d292beda12fb0a2ef4c39ef780c2e7';// add one of our tokens 
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
  getReposTechnologies: function(username, repos, technology, languageName) {
    // this.options.url = 'https://api.github.com/search/code?q=jquery.min js+in:path+language:js+repo:soundswarm/CodeUsMVP';
    // language = 'js';
    technology = technology || {};
    // technology.name = 'jquery';
    languageName = 'JavaScript';
    this.options.url = 'https://api.github.com/search/code?q='+technology.name+'+filename:'+technology.name+'+language:js+user:'+username;
    console.log(this.options.url)
    return rp(this.options)
    .then(function(searchResult) {
      _.each(searchResult.items, function(item) {
        repoResult = item.repository.name;
        _.each(repos, function(repo) {
          if(repo.name === repoResult) {
            repo.technologies = repo.technologies || {};
            repo.technologies[technology.name] = repo.languages[languageName];
          }
        })
      })
      return repos;
    })
  },
  reposScores: function(repos) {
    var scores = {};
    var langs = {};
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

      //calculate technologies
      _.each(repo.technologies, function(kilobytes, technology) {
        if(scores.technologies[technology]) {
          scores.technologies[technology] += Math.round(kilobytes/1000);
        } else {
          scores.technologies[technology] = Math.round(kilobytes/1000);
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
  },
  saveToCodersTable: function(username, scores) {
    var coder =  new Coder({
      login: username,
      stargazers_count: scores.cred.stargazers_count,
      watchers_count: scores.cred.watchers_count,
      forks: scores.cred.forks,
      primary_lang: scores.primaryLang
    })
    return coder.save()
      .then(function(coder) {
        Coders.add(coder)
        // console.log('new coder added to db', coder);
        return coder;
      })
  },
  saveToLanguagesTable: function(languages) {
    //takes in object of languages
    // loop through languages
    _.each(languages, function(bytes, language) { //add way to add bytes to join table
      var languageInst = new Language({
        name: language
      })
      languageInst.fetch()
        .then(function(langModel) {
        // if language not in database
          if (!langModel) {
            return languageInst.save()
              .then(function(language) {
                // add to database
                Languages.add(language);
                // console.log('new language to db', language);
                return language;
              })
          } 
        })
    })
  },
  saveToTechnologiesTable: function(technologies) {
    //takes in object of languages
    // loop through languages
    _.each(technologies, function(bytes, technology) { //add way to add bytes to join table
      var technologyInst = new Technology({
        name: technology
      })
      technologyInst.fetch()
        .then(function(techModel) {
        // if language not in database
          if (!techModel) {
            return technologyInst.save()
              .then(function(technology) {
                // add to database
                Languages.add(technology);
                // console.log('new language to db', language);
                return technology;
              })
          } 
        })
    })
  },
  savetoCodersLanguagesTable: function(username, languages) {
    console.log('in savetocoderslanguagestablefunction');
    new Coder({login: username}).fetch()
    .then(function(coder) {
      // console.log('coder, ', coder);
      if(coder) {
        _.each(languages, function(bytes, language) { //add way to add bytes to join table
          //update coder languages.  be careful to not keep appending languages to the list.
          new Language({name: language}).fetch()
          .then(function(language) {
            // console.log('language: ', language);
            if(language) {
              
              // destroy all coder language records in CodersLanguages
              // collectionbefore adding updated languages to the database.
              // needs testing
              new CoderLanguage({
                coder_id: coder.get('id')
              })
              .fetchAll()
              .then(function(coderLanguages) {
                _.each(coderLanguages, function(coderLanguage) {
                  coderLanguage.destroy;
                });
              })

              //save updated coder languages to CodersLanguages
              .then(function() {
                var coderLanguageInst = new CoderLanguage({
                  coder_id: coder.get('id'),
                  language_id: language.get('id'),
                  bytes_across_repos: bytes
                })
                coderLanguageInst.save()
                .then(function(coderLanguageInst) {
                  CodersLanguages.add(coderLanguageInst);
                })
              })
            }
          })
        })
      }
    })
  },
  savetoCodersTechnologiesTable: function(username, technologies) {
    console.log('in savetocoderstechnologiestablefunction');
    new Coder({login: username}).fetch()
    .then(function(coder) {
      if(coder) {
        console.log(technologies);
        _.each(technologies, function(bytes, technology) { 
          new Technology({name: technology}).fetch()
          .then(function(technology) {
            // console.log('technology: ', technology);
            if(technology) {
              
              // destroy all coder language records in CodersTechnologies
              // collectionbefore adding updated languages to the database.
              // needs testing
              new CoderTechnology({
                coder_id: coder.get('id')
              })
              .fetchAll()
              .then(function(coderTechnologies) {
                _.each(coderTechnologies, function(coderTechnology) {
                  coderTechnology.destroy;
                });
              })

              //save updated coder technologies to CodersTechnologies
              .then(function() {
                var coderTechnologyInst = new CoderTechnology({
                  coder_id: coder.get('id'),
                  technology_id: technology.get('id'),
                  bytes_across_repos: bytes
                })

                coderTechnologyInst.save()
                .then(function(coderTechnologyInst) {
                  CodersTechnologies.add(coderTechnologyInst);
                })
              })
            }
          })
        })
      }
    })
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