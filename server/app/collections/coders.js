var bookshelf = require('../config');
var Coder = require('../models/coder');

var Coders = new bookshelf.Collection();

Coders.model = Coder;

module.exports = Coders;