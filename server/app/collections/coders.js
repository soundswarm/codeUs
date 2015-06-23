var db = require('../config');
var CoderBrief = require('../models/abbrProfile');

var Coders = new db.Collection();

Coders.model = CoderBrief;

module.exports = Coders;