var bookshelf = require('../config');
var Language = require('../models/language');

var Languages = new bookshelf.Collection();

Languages.model = Language;

module.exports = Languages;