// populate a single Coder's profile 
var Coder = require('../models/coder');
var Coders = require('../collections/coders');

var coder = new Coder({
	gh_username: 'dummytesting',
	name: 'Testing Dummy'
});

coder.save().then(function(newCoder){
	Coders.add(newCoder);
	console.log('new coder added to collection', newCoder);
});

module.exports = {








};

