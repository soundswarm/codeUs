// populate a single Coder's profile 
var Coder = require('../models/coder');
var Coders = require('../collections/coders');
// var Promise = require('bluebird');
var apicalls = require('request-promise');

// var coder = new Coder({
// 	gh_username: 'dummytesting',
// 	name: 'Testing Dummy'
// });

// coder.save().then(function(newCoder){
// 	Coders.add(newCoder);
// 	console.log('new coder added to collection', newCoder);
// });

var options = {
	url: 'https://api.github.com/users?access_token=2045c650b980c19a21fba62b62b81f0cf8ef6853',
	headers: {
		'User-Agent': 'CodeUs-App'
	}
};

apicalls(options)
	.then(function(response) {
		var token = '2045c650b980c19a21fba62b62b81f0cf8ef6853';
		for (var i=0; i < 1; i++) {
			var parsed = (JSON.parse(response))[i];
			options.url = 'https://api.github.com/users/' + parsed.login + '?access_token=' + token;
			console.log(options.url);
			setInterval(addCoder(options), 500);
		}
	});

var addCoder = function(options) {
	apicalls(options)
	.then(function(response) {
		var parsed = JSON.parse(response);
		var coder = new Coder({
			gh_username: parsed.login,
			name: parsed.name,
			location: parsed.location,
			email: parsed.email,
			gh_site_url: parsed.blog,
			photo_url: parsed.avatar_url,
			gh_member_since: parsed.created_at
		});
		coder.save().then(function(newCoder){
			Coders.add(newCoder);
		});
	});
};

module.exports = {

	token: '2045c650b980c19a21fba62b62b81f0cf8ef6853',

	initUser: function(token) {
		return user;
	}









};

