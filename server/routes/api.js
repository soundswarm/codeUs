// add this to server.js:
// app.use('/api', apiRouter);

// C: /#/user
	// C: initialize function does GET to server for (/realtime) realtime GH info, database info 
	// 	and(/addsodata) stack overflow

		// S: determine GH username in req.user.username.  get realtime GH info and send back to client
		// S: if user in db:
			// get db info and send back to client
			// else calc scores via GH api calls
				// send scores to client
				// put scores in db
var _ = require('underscore');
var bb = require('bluebird');
var authController = require('../users/authController.js');
var helpers = require('../app/helpers/helpers');
var rp = require('request-promise');
var Coder = require('../app/models/coder');
var Coders = require('../app/collections/coders');
var Language = require('../app/models/language');
var Languages = require('../app/collections/languages');
var Technology = require('../app/models/technology');
var Technologies = require('../app/collections/technologies');
var CoderLanguage = require('../app/models/coderlanguage');
var CodersLanguages = require('../app/collections/coderslanguages');
var CoderTechnology = require('../app/models/codertechnology');
var CodersTechnologies = require('../app/collections/coderstechnologies');

var token = '1ce7e4e705d292beda12fb0a2ef4c39ef780c2e7'; // do not upload to GitHub with this token assigned explicitly!

var stackOptions = {
	url: 'https://api.stackexchange.com/2.2/users?key=TKQV9fx1oXQhozGO*SGQNA((&access_token=saN8CDoS7M8lbHLZj(mC2w))&pagesize=100&order=desc&sort=reputation&site=stackoverflow&filter=!Ln4IB)_.hsRjrBGzKe*i*W&page=',
	gzip: true
};

var passedUsername; 

module.exports = function (app) {

	app.get('/user', authController.ensureAuthenticated, function(req, res, next) {
		console.log('hit route api/user', req.user.username);
		console.log('req params: ', req.params);
		var username = req.param('username') || req.user.username;
		var coder = {};
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
		options.url += username;
		// fetch real-time user attr from API, assign to empty coder object
		rp(options)
		.then(function(user) {
			coder = user;
		})
		// fetch rest of the data from the database
		.then(function() {
			new Coder({'login': username})
			.fetch()
			.then(function(userModel) {
				if (!userModel) {
					helpers.getUser(username).promise().bind(helpers)
			      .then(helpers.getRepos)
			      .then(helpers.getReposLanguages)
			      .then(function(repos) {
			      	var technologies = [
					      {
					        name: 'angular', 
					        file: 'angular', 
					      }, 
					      {
					        name: 'express', 
					        file: 'express', 
					      },
					      {
					        name: 'jquery', 
					        file: 'jquery', 
					      },
					      {
					      	name: 'mongodb',
					      	file: 'mongodb'
					    	}
					    ];
			      	var promises =[];
					    for(var i = 0; i<technologies.length; i++) {
					      var technology = technologies[i];
					      promises.push(helpers.getReposTechnologies(username, repos, technology))
					    }
					    return bb.all(promises).then(function() {
					      // console.log(repos);
					      return repos;
					    })
			      })
			      .then(helpers.reposScores)
			      .then(function(scores) {
			      	_.extend(coder, scores);
							res.status(200).send(coder);
							helpers.saveToCodersTable(username, scores);
							helpers.saveToLanguagesTable(scores.languages);
							helpers.saveToTechnologiesTable(scores.technologies);
							helpers.savetoCodersLanguagesTable(username, scores.languages)
							helpers.savetoCodersTechnologiesTable(username, scores.technologies)
						})

						// .then(function(userModel) {
						// 	coder.name = userModel.attributes.name;
						// 	coder.location = userModel.attributes.location;
						// 	coder.email = userModel.attributes.email;
						// 	coder.gh_site_url = userModel.attributes.blog;
						// 	coder.photo_url = userModel.attributes.avatar_url;
						// 	coder.gh_member_since = userModel.attributes.created_at;
						// 	coder.so_reputation = userModel.attributes.so_reputation;
						// 	coder.so_answer_count = userModel.attributes.so_answer_count;
						// 	coder.so_question_count = userModel.attributes.so_question_count;
						// 	coder.so_upvote_count = userModel.attributes.so_upvote_count;
						// 	res.status(200).send(coder);
						// })
				} else {				
					coder.cred = {};
					coder.cred.forks = userModel.attributes.forks;
					coder.cred.watchers_count = userModel.attributes.watchers_count;
					coder.cred.stargazers_count = userModel.attributes.stargazers_count;
					console.log(coder.cred);
					coder.name = userModel.attributes.name;
					coder.location = userModel.attributes.location;
					coder.email = userModel.attributes.email;
					coder.gh_site_url = userModel.attributes.blog;
					coder.photo_url = userModel.attributes.avatar_url;
					coder.gh_member_since = userModel.attributes.created_at;
					coder.so_reputation = userModel.attributes.so_reputation;
					coder.so_answer_count = userModel.attributes.so_answer_count;
					
					coder.so_question_count = userModel.attributes.so_question_count;
					coder.so_upvote_count = userModel.attributes.so_upvote_count;

					var getCoderLanguages = function(username) {
				    var languages = {};
				    return new Coder({login: username}).fetch()
				    .then(function(coder) {
				      return new CoderLanguage({
				        coder_id: coder.id
				      })
				      .fetchAll()
				      .then(function(coderLanguages) {
				        for(var i = 0; i<coderLanguages.models.length; i++) {
				          var language = coderLanguages.models[i];
				          var kilobytes = language.attributes.bytes_across_repos;

				          if(i===coderLanguages.models.length-1) {
				            return new Language({id: language.attributes.language_id}).fetch()
				            .then(function(languageName) {
				              var name = languageName.attributes.name;
				              languages[name] = language.attributes.bytes_across_repos;
				              return languages;
				            })
				          }
				          else {
				            var build = function(language, kilobytes) {
				              return new Language({id: language.attributes.language_id}).fetch()
				              .then(function(languageName) {
				                var name = languageName.attributes.name;
				                languages[name] = kilobytes;
				              })
				            }(language, kilobytes)
				          }
				        }
				      })
				    })
				    .then(function() {
				    	coder.languages = languages;
				    	var getCoderTechnologies = function(username) {
						    var technologies = {};
						    return new Coder({login: username}).fetch()
						    .then(function(coder) {
						      return new CoderTechnology({
						        coder_id: coder.id
						      })
						      .fetchAll()
						      .then(function(coderTechnologies) {
						        for(var i = 0; i<coderTechnologies.models.length; i++) {
						          var technology = coderTechnologies.models[i];
						          var kilobytes = technology.attributes.bytes_across_repos;

						          if(i===coderTechnologies.models.length-1) {
						            return new Technology({id: technology.attributes.technology_id}).fetch()
						            .then(function(technologyName) {
						              var name = technologyName.attributes.name;
						              technologies[name] = technology.attributes.bytes_across_repos;
						              return technologies;
						            })
						          }
						          else {
						            var build = function(technology, kilobytes) {
						            	console.log('technology', technology);
						              return new Technology({id: technology.attributes.technology_id}).fetch()
						              .then(function(technologyName) {
						                var name = technologyName.attributes.name;
						                technologies[name] = kilobytes;
						              })
						            }(technology, kilobytes)
						          }
						        }
						      })
						    })
						    .then(function() {
						    	coder.technologies = technologies;
						      res.status(200).send(coder);
						    })
						  }(username)
				    })
				  }(username)
				}
			});
		});
	});

	// takes in Stack Overflow coder object, stores relevant records in coder model with same name
	var addSODataToDB = function(socoder) {
		new Coder({login: socoder.display_name}).fetch()
				.then(function(coder) {
					if (coder) {
		      	coder.save({
							so_location: socoder.location,
							so_name: socoder.display_name,
    					so_member_since: socoder.creation_date,
    					so_reputation: socoder.reputation,
    					so_answer_count: socoder.answer_count,
    					so_question_count: socoder.question_count,
    					so_upvote_count: socoder.up_vote_count,
    					so_site_url: socoder.website_url
		      	});
		      	console.log('User ' + socoder.display_name + ' updated with SO stats.');
					}
			})
		};

	// iterates through list of up to 100 entries in items object, calling addSODataToDB for each
	var getSODataAndSave = function(i, items, callback) {
		if (i >= items.length) {
	    callback();
	    return;
	  }
    addSODataToDB(items[i]);
    getSODataAndSave(i+1, items, callback);
	};

	// endpoint for adding Stack Overflow attributes to existing coder models in DB
	app.get('/addsodata', function(req, res, next) {
		var addSO = function(pg) {
			stackOptions.url = 'https://api.stackexchange.com/2.2/users?key=TKQV9fx1oXQhozGO*SGQNA((&access_token=saN8CDoS7M8lbHLZj(mC2w))&pagesize=100&order=desc&sort=reputation&site=stackoverflow&filter=!Ln4IB)_.hsRjrBGzKe*i*W&page=' + pg;
			
			rp(stackOptions)
				.then(function(response) {
					var parsed = JSON.parse(response);
					hasMore = parsed.has_more;
					quotaRemain = parsed.quota_remaining;
					var items = parsed.items;
					var backoff = parsed.backoff || 0;
					console.log('backoff: ', backoff);
					getSODataAndSave(0, items, function() {
						pg++;
						if (hasMore === false || quotaRemain < 5) { return; }
						console.log('backoff within callback: ', backoff);
						setTimeout(function() {
							addSO(pg);
						}, backoff * 1000);
					});		
			})
			.catch(console.error);
		};
		addSO(1);
	});


	app.get('/related', authController.ensureAuthenticated, function(req, res, next) {
		var username = req.user.username;
		var locale = req.user._json.location;
		var primaryLang;
		new Coder({login: username}).fetch()
		.then(function(coder) {
			primaryLang = coder.attributes.primary_lang;
			coder.query({where: {location: locale}, andWhere: {primary_lang: primaryLang}}).fetchAll()
			.then(function(collection) {
			res.status(200).send(collection);
		})	
		});
	});

	app.get('/coder/:username', authController.ensureAuthenticated, function(req, res, next) {
		var username = req.params.username;
		console.log('/coder/username: ', username);
		// var coder = {};
		// var options = {
		// 	url: 'https://api.github.com/users/',
		// 	headers: {
		// 		'User-Agent': 'CodeUs-App',
		// 		'Authorization': 'token '+ token 
		// 	},
	 //    transform: function(body, response) {  
	 //      return JSON.parse(body);
	 //    }
		// };
		// options.url += username;
		// // fetch real-time user attr from API, assign to empty coder object
		// rp(options)
		// .then(function(user) {
		// 	coder = user;
		// })
		// // fetch rest of the data from the database
		// .then(function() {
		// 	new Coder({'login': username})
		// 	.fetch()
		// 	.then(function(userModel) {			
		// 			coder.cred = {};
		// 			coder.cred.forks = userModel.attributes.forks;
		// 			coder.cred.watchers_count = userModel.attributes.watchers_count;
		// 			coder.cred.stargazers_count = userModel.attributes.stargazers_count;
		// 			console.log(coder.cred);
		// 			coder.name = userModel.attributes.name;
		// 			coder.location = userModel.attributes.location;
		// 			coder.email = userModel.attributes.email;
		// 			coder.gh_site_url = userModel.attributes.blog;
		// 			coder.photo_url = userModel.attributes.avatar_url;
		// 			coder.gh_member_since = userModel.attributes.created_at;
		// 			coder.so_reputation = userModel.attributes.so_reputation;
		// 			coder.so_answer_count = userModel.attributes.so_answer_count;
					
		// 			coder.so_question_count = userModel.attributes.so_question_count;
		// 			coder.so_upvote_count = userModel.attributes.so_upvote_count;

		// 			var getCoderLanguages = function(username) {
		// 		    var languages = {};
		// 		    return new Coder({login: username}).fetch()
		// 		    .then(function(coder) {
		// 		      return new CoderLanguage({
		// 		        coder_id: coder.id
		// 		      })
		// 		      .fetchAll()
		// 		      .then(function(coderLanguages) {
		// 		        for(var i = 0; i<coderLanguages.models.length; i++) {
		// 		          var language = coderLanguages.models[i];
		// 		          var kilobytes = language.attributes.bytes_across_repos;

		// 		          if(i===coderLanguages.models.length-1) {
		// 		            return new Language({id: language.attributes.language_id}).fetch()
		// 		            .then(function(languageName) {
		// 		              var name = languageName.attributes.name;
		// 		              languages[name] = language.attributes.bytes_across_repos;
		// 		              return languages;
		// 		            })
		// 		          }
		// 		          else {
		// 		            var build = function(language, kilobytes) {
		// 		              return new Language({id: language.attributes.language_id}).fetch()
		// 		              .then(function(languageName) {
		// 		                var name = languageName.attributes.name;
		// 		                languages[name] = kilobytes;
		// 		              })
		// 		            }(language, kilobytes)
		// 		          }
		// 		        }
		// 		      })
		// 		    })
		// 		    .then(function() {
		// 		    	coder.languages = languages;
		// 		      res.status(200).send(coder);
		// 		    })
		// 		  }(username)
		// 	});
		// });
	});

};
