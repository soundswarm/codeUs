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
var authController = require('../users/authController.js');
var helpers = require('../app/helpers/helpers');
var rp = require('request-promise');
var Coder = require('../app/models/coder');
var Coders = require('../app/collections/coders');
var Language = require('../app/models/language');
var Languages = require('../app/collections/languages');
var CoderLanguage = require('../app/models/coderlanguage');
var CodersLanguages = require('../app/collections/coderslanguages');

var token = '431a18f6f7e3371a157019a522d320e939eac28c'; // do not upload to GitHub with this token assigned explicitly!

module.exports = function (app) {

	app.get('/*', authController.ensureAuthenticated, function(req, res, next) {
		console.log('hit route api/coder');
		console.log('req params[0]: ', req.params[0]);
		var username = req.params[0];
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
				      res.status(200).send(coder);
				    })
				  }(username)
			});
		});
	});



};
