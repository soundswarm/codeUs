var api = require('request-promise');
var Coder = require('../app/models/coder');
var RateLimiter = require('limiter').RateLimiter;

var token = '4cd0bc7f1143a5dcf1f165596b4cbac1ef640bc7';
var limiter = new RateLimiter(1, 1000);

var queries = ['followers:>=430', 'followers:260..429', 'followers:190..259', 'followers:155..189', 'followers:131..154', 'followers:115..130', 'followers:103..114', 'followers:93..102', 'followers:85..92', 'followers:78..84', 'followers:72..77', 'followers:67..71', 'followers:63..66', 'followers:60..62', 'followers:57..59', 'followers:54..56', 'followers:52..53', 'followers:50..51', 'followers:48..49', 'followers:46..47', 'followers:45', 'followers:44', 'followers:43', 'followers:42', 'followers:41', 'followers:40', 'followers:39', 'followers:38', 'followers:37', 'followers:36', 'followers:35', 'followers:34', 'followers:33', 'followers:<33+repos:>=300', 'followers:<33+repos:194..299', 'followers:<33+repos:155..193', 'followers:<33+repos:132..154', 'followers:<33+repos:118..131', 'followers:<33+repos:108..117', 'followers:<33+repos:101..107', 'followers:<33+repos:95..100', 'followers:<33+repos:90..94', 'followers:<33+repos:86..89', 'followers:<33+repos:82..85', 'followers:<33+repos:79..81', 'followers:<33+repos:76..78', 'followers:<33+repos:74..75', 'followers:<33+repos:72..73', 'followers:<33+repos:70..71'];

var options = {
	url: 'https://api.github.com/search/users?type=Users&per_page=100&q=',
	headers: {
		'User-Agent': 'CodeUs-App',
		'Authorization': 'token '+ token 
	},
	transform: function(body, response) {  
	      return JSON.parse(body);
  }
};
var userOptions = {
	url: 'https://api.github.com/users/',
	headers: {
		'User-Agent': 'CodeUs-App',
		'Authorization': 'token '+ token 
	},
	transform: function(body, response) {  
	      return JSON.parse(body);
  }
};

module.exports = function populate() {

	var addCoderToDB = function(coderapi) {
		new Coder({login: coderapi.login}).fetch()
				.then(function(dbcoder) {
					if (dbcoder) {
						// console.log('existing coder: ', dbcoder.login);
		      	dbcoder.save({
		      		login: coderapi.login,
							name: coderapi.name,
							location: coderapi.location,
							public_repos: coderapi.public_repos,
							followers: coderapi.followers,
							email: coderapi.email,
							gh_site_url: coderapi.blog,
							photo_url: coderapi.avatar_url,
							gh_member_since: coderapi.created_at
		      	});
					} else {
						// console.log(coderapi);
						var newCoder = new Coder({
		      		login: coderapi.login,
							name: coderapi.name,
							location: coderapi.location,
							public_repos: coderapi.public_repos,
							followers: coderapi.followers,
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

	var getFullCoderObj = function(login) {
		userOptions.url = 'https://api.github.com/users/' + login;
		return api(userOptions);
	};

	// fetch users from GET /search/users query, fetch indiv records, save to db
	var getFullCoderThenSave = function(i, items, callback) {
	  if (i >= items.length) {
	    callback();
	    return;
	  }
	  limiter.removeTokens(1, function() {
	      getFullCoderObj(items[i].login).then(function(coderObj) {
	          addCoderToDB(coderObj);
	          getFullCoderThenSave(i+1, items, callback);
	      });
	  });
	};

	var pagePopulate = function(pg, qIndex) {
	  options.url = 'https://api.github.com/search/users?type=Users&per_page=100&q=' + queries[qIndex] + '&page=' + pg;
	  api(options)
	  .then(function(response) {
	      var pages = Math.min(Math.ceil(response.total_count / 100), 10);
	      var items = response.items;
	      getFullCoderThenSave(0, items, function() {
	        pg++;
	        if (pg > pages) {
	            pg = 1;
	            qIndex++;
	            if (qIndex === queries.length) {
	                return;
	            }
	        }
	        pagePopulate(pg, qIndex);
	      });
	  })
	  .catch(console.error);
	};

	pagePopulate(1, 0);

};
