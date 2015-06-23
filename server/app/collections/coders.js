var db = require('../config');
var Coder = require('../models/coder');

var Coders = new db.Collection();

Coders.model = Coder;

module.exports = Coders;