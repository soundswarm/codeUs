// add this to server.js:
// app.use('/api', populateRouter);

var populateRouter = express.Router();

populateRouter.route('/populate', function() {
	// ***** PSEUDOCODE *******
	// hit the Github API with a request for all users
	// with each fetched batch of users:
		// then: populate the coders table fields that don't require processing from the returned users object, save()
		// and: populate the coders table fields with calculated fields (cred, stars, forks, etc.), save()
		// and: run Coder.populateJoins
});

populateRouter.route('/update', function() {
	// logic for updating coders table with changes since the last time the table was updated??? 
});

