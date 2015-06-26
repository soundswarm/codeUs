// var passport = require('passport')
//   , util = require('util')
//   , GitHubStrategy = require('passport-github').Strategy;


// var githubOAuth = {
//   client: 'd6eb2ec366cc31185c1e',
//   clientSecret: '2576bc4f18e7e98e7a2c820f80a249a9e0a4a153',
//   baseURL: 'http://127.0.0.1:8000',
//   callbackURI: '/auth/github/callback/success',
// };

// // Passport session setup.
// //   To support persistent login sessions, Passport needs to be able to
// //   serialize users into and deserialize users out of the session.  Typically,
// //   this will be as simple as storing the user ID when serializing, and finding
// //   the user by ID when deserializing.  However, since this example does not
// //   have a database of user records, the complete GitHub profile is serialized
// //   and deserialized.
// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(obj, done) {
//   done(null, obj);
// });

// // Use the GitHubStrategy within Passport.
// //   Strategies in Passport require a `verify` function, which accept
// //   credentials (in this case, an accessToken, refreshToken, and GitHub
// //   profile), and invoke a callback with a user object.
// passport.use(new GitHubStrategy({
//     clientID: githubOAuth.client,
//     clientSecret: githubOAuth.clientSecret,
//     callbackURL: githubOAuth.baseURL+githubOAuth.callbackURI
//   },
//   function(accessToken, refreshToken, profile, done) {
//     console.log('access token', accessToken)
//     // asynchronous verification, for effect...
//     process.nextTick(function () {
      
//       // To keep the example simple, the user's GitHub profile is returned to
//       // represent the logged-in user.  In a typical application, you would want
//       // to associate the GitHub account with a user record in your database,
//       // and return that user instead.
//       return done(null, profile);
//     });
//   }
// ));

// // Simple route middleware to ensure user is authenticated.
// //   Use this route middleware on any resource that needs to be protected.  If
// //   the request is authenticated (typically via a persistent login session),
// //   the request will proceed.  Otherwise, the user will be redirected to the
// //   login page.
// module.exports = {
//   ensureAuthenticated: function(req, res, next) {
//     console.log('ensureauth'); 
//     if (req.isAuthenticated()) {
//       return next(); 
//     }
//     res.redirect('/#/signin')
//   }
// };



// // var app = express.createServer();

// // // configure Express
// // app.configure(function() {
// //   app.set('views', __dirname + '/views');
// //   app.set('view engine', 'ejs');
// //   app.use(express.logger());
// //   app.use(express.cookieParser());
// //   app.use(express.bodyParser());
// //   app.use(express.methodOverride());
// //   app.use(express.session({ secret: 'keyboard cat' }));
// //   // Initialize Passport!  Also use passport.session() middleware, to support
// //   // persistent login sessions (recommended).
// //   app.use(passport.initialize());
// //   app.use(passport.session());
// //   app.use(app.router);
// //   app.use(express.static(__dirname + '/public'));
// // });





