var api = require('request-promise');
var Coder = require('../app/models/coder');

var token = 'TOKEN HERE';

var full = true;
var options = {
	url: 'https://api.github.com/users?per_page=100',
	headers: {
		'User-Agent': 'CodeUs-App',
		'Authorization': 'token '+ token 
	}
};
var userOptions = {
	url: 'https://api.github.com/users',
	headers: {
		'User-Agent': 'CodeUs-App',
		'Authorization': 'token '+ token 
	}
};

module.exports = function populate() {

	var addCoderToDB = function(coderapi) {
		new Coder({gh_username: coderapi.login}).fetch()
				.then(function(dbcoder) {
					if (dbcoder) {
						console.log('existing coder: ', dbcoder.gh_username);
		      	dbcoder.save({
		      		gh_username: coderapi.login,
							name: coderapi.name,
							location: coderapi.location,
							email: coderapi.email,
							gh_site_url: coderapi.blog,
							photo_url: coderapi.avatar_url,
							gh_member_since: coderapi.created_at
		      	});
					} else {
						console.log(coderapi);
						var newCoder = new Coder({
		      		gh_username: coderapi.login,
							name: coderapi.name,
							location: coderapi.location,
							email: coderapi.email,
							gh_site_url: coderapi.blog,
							photo_url: coderapi.avatar_url,
							gh_member_since: coderapi.created_at	    						
						});
						newCoder.save()
							.then(function(coder) {
	  						// console.log('Coder ' + coder.name + ' added to DB');
							});
				}
			});
		};

	var getFullCoderObj = function(gh_username) {
		userOptions.url = 'https://api.github.com/users/' + gh_username;
		return api(userOptions);
	};

	// fetch users from GET /users call, save to db
	api(options)
	.then(function(response) {
		var parsed = JSON.parse(response);
		if (parsed.length < 100) { full = false;}
		for (var i=0; i < parsed.length; i++) {
			since = parsed[i].id;
			getFullCoderObj(parsed[i].login).then(function(coder) {
				var parsedObj = JSON.parse(coder);
				addCoderToDB(parsedObj);
			})

		}
		options.url = 'https://api.github.com/users?per_page=100&since=' + since;
		console.log(options.url);
	})
	.catch(console.error);
};
