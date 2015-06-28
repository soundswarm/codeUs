var bookshelf = require('../config');
var CoderLanguage = require('../models/coderlanguage');

var CodersLanguages = new bookshelf.Collection();

CodersLanguages.model = CoderLanguage;

module.exports = CodersLanguages;