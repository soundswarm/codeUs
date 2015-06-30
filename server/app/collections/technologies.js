var bookshelf = require('../config');
var Technology = require('../models/technology');

var Technologies = new bookshelf.Collection();

Technologies.model = Technology;

module.exports = Technologies;