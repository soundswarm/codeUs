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
	url: 'https://api.github.com/users/soundswarm',
	headers: {
		'User-Agent': 'CodeUs-App'
	}
};

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
			console.log('new coder added to collection', newCoder);
		});
});

module.exports = {

	token: '9166b8e167a0c49fe859f17601a7a33ea6b89e8a',

	initUser: function(token) {
		return user;
	}









};

