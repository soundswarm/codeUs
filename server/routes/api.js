// add this to server.js:
// app.use('/api', apiRouter);

// var apiRouter = express.Router();
var helper = require('../app/helpers/helpers');
var api = require('request-promise');
var Coder = require('../app/models/coder');
var Coders = require('../app/collections/coders');

module.exports = function (app) {

	// should be called with the following endpoint syntax: GET /api/realtime?u={username}
	app.get('/realtime', function(req, res, next) {
		console.log('/realtime route hit');
		var coder = {};
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
			coder.followers = parsed.followers;
			coder.updated_at = parsed.updated_at;
			coder.repo_count = parsed.public_repos;
			coder.gh_username = req.query.u;
		})
		// fetch rest of the data from the database
		.then(function() {
			new Coder({'gh_username': req.query.u})
			.fetch()
			.then(function(userModel) {
				if (!userModel) {
					console.log('User model ' + req.query.u + ' not found');
				} else {
					coder.name = userModel.attributes.name;
					coder.location = userModel.attributes.location;
					coder.email = userModel.attributes.email;
					coder.gh_site_url = userModel.attributes.blog;
					coder.photo_url = userModel.attributes.avatar_url;
					coder.gh_member_since = userModel.attributes.created_at;
					res.status(200).send(coder);
				}
			});
		})
	});
};
