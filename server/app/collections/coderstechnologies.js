var bookshelf = require('../config');
var CoderTechnology = require('../models/codertechnology');

var CodersTechnologies = new bookshelf.Collection();

CodersTechnologies.model = CoderTechnology;

module.exports = CodersTechnologies;