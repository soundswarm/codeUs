var authController = require('./authController.js');
var passport = require('passport');
module.exports = function(app) {
  app.get('/#/user', authController.ensureAuthenticated, function(req, res){
    res.redirect('/#/user')
  });
  // app.get('/auth', authController.ensureAuthenticated, function(req, res){
  //   console.log('/auth--------' );
  //   res.send('{true}');
  // });


  // GET /auth/github
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  The first step in GitHub authentication will involve redirecting
  //   the user to github.com.  After authorization, GitHubwill redirect the user
  //   back to this application at /auth/github/callback
  app.get('/auth',
    passport.authenticate('github', { scope: [ '' ], failureRedirect: '/#/signin' }),
    function(req, res){
      // The request will be redirected to GitHub for authentication, so this
      // function will not be called.
    });

  // GET /auth/github/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  app.get('/success', 
    // passport.authenticate('github', { failureRedirect: '/signin' }),
    
    function(req, res) {
          res.setHeader('Access-Control-Allow-Origin', '*');

      res.redirect('/#/user');
    });

  // app.get('/logout', function(req, res){
  //   req.logout();
  //   res.redirect('/');
  // });

};
