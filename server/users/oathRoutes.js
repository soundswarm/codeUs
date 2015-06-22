var oauthController = require('./oathController.js');

module.exports = function(app) {
  app.post('/signin', oathController.signin);
  app.post('')
  // app.post('/signup', oauthController.signup);
  // app.get('/signedin', oauthController.checkAuth);
};

