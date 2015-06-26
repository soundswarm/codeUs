var oauthController = require('./oauthController.js');

module.exports = function(app) {
  app.get(/signin/, oauthController.signin);
  app.get(/success/, oauthController.success);
};
