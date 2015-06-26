// var authController = require('./authController.js');
// var passport = require('passport');

var passport = require('passport')
  , util = require('util')
  , GitHubStrategy = require('passport-github').Strategy;
 
module.exports = function(app) {


var githubOAuth = {
  client: 'd6eb2ec366cc31185c1e',
  clientSecret: '2576bc4f18e7e98e7a2c820f80a249a9e0a4a153',
  callbackURI: 'http://127.0.0.1:8000/auth/github/callback',
};

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});;

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
    clientID: githubOAuth.client,
    clientSecret: githubOAuth.clientSecret,
    callbackURL: githubOAuth.callbackURI
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('access token', accessToken)
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.


// module.exports = {
  var ensureAuthenticated =  function(req, res, next) {
    console.log('ensureauth'); 
    if (req.isAuthenticated()) {
      return next(); 
    }
    res.redirect('/#/signin')
  }
// };



// module.exports = function(app) {
  app.get('/#/user', ensureAuthenticated, function(req, res){
    console.log(req)
    res.redirect('/#/signin')
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
  app.get('/auth/github',
    passport.authenticate('github'),
    function(req, res){
    //   console.log('in auth')

    //   // The request will be redirected to GitHub for authentication, so this
    //   // function will not be called.
    });

  // GET /auth/github/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/#/signin' }),
    function(req, res) {
      console.log('authenticated!')
          // res.setHeader('Access-Control-Allow-Origin', '*');
      res.redirect('/#/user');
    });

  // app.get('/logout', function(req, res){
  //   req.logout();
  //   res.redirect('/');
  // });
}
// };
