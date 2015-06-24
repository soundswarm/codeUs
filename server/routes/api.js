// add this to server.js:
// app.use('/api', apiRouter);

// var apiRouter = express.Router();
var helper = require('../app/helpers/helpers');
var api = require('request-promise');
var Coder = require('../app/models/coder');
var Coders = require('../app/collections/coders');
var router = require('express').Router();

module.exports = function () {

	router.get('/populate', function() {
		// ***** PSEUDOCODE *******
		// ((this endpoint should be hit using some sort of cron))
		// some sort of setInterval with looping across the helper functions (using 'since' parameter)
		setInterval(function() {
			helper.apicalls();
		}, 1000);
	});

	// should be called with the following endpoint syntax: GET /api/realtime?u={username}
	router.get('/realtime', function(req, res, next) {
		console.log('/realtime route hit');
		var token = "fb06bcad775c4e3fc9b99fa7271b56ba3a8e6425"; // do not upload to GitHub with this token assigned explicitly!
		var options = {
			url: 'https://api.github.com/users/',
			headers: {
				'User-Agent': 'CodeUs-App'
			}
		};
		options.url += req.query.u + '?access_token=' + token;
		// fetch real-time user attr from API, assign to new Coder instance
		api(options)
		.then(function(response) {
			var parsed = JSON.parse(response);
			var coder = new Coder({
				followers: parsed.followers,
				updated_at: parsed.updated_at,
				repo_count: parsed.public_repos
			});
		})
		// fetch rest of the data from the database
		.then(function() {
			new Coder({'gh_username': req.query.u}).fetch();
		})
		// assign DB attr to the current Coder model instance object
		.then(function(userModel) {
			if (!userModel) {
				console.log('User model ' + req.query.u + 'not found');
			} else {
				coder.gh_username = req.query.u;
				coder.name = userModel.name;
				coder.location = userModel.location;
				coder.email = userModel.email;
				coder.gh_site_url = userModel.blog;
				coder.photo_url = userModel.avatar_url;
				coder.gh_member_since = userModel.created_at;
			}
		});
		console.log(coder);
		res.status(200).send(coder);
	});

	return router;
};
