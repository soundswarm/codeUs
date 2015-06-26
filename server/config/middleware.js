var morgan      = require('morgan'); // used for logging incoming request
var bodyParser  = require('body-parser');
var partials    = require('express-partials');
// var helpers     = require('./helpers.js'); // our custom middleware
var db          = require('../app/config');
var api         = require('../app/helpers/helpers');
var session     = require('express-session');
var passport    = require('passport');
var util        = require('util');
var cookieParser = require('cookie-parser');
var cors        = require('cors')
    
    

module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var authRouter = express.Router();
  var apiRouter = express.Router();
  app.use(partials());

  // app.options('*', cors()); // include before other routes
  app.use( cors() );
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));


  app.use(authRouter); // use user router for all user request
  app.use('/api', apiRouter);

  // app.use(helpers.errorLogger);
  // app.use(helpers.errorHandler)

  app.use(cookieParser());
  // app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());


//   app.use(function(req, res, next) {

// //     headers = {
// //   "access-control-allow-origin": "*",
// //   "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
// //   "access-control-allow-headers": "content-type, accept",
// //   "access-control-max-age": 10, // Seconds.
// //   'Content-Type': "application/json"
// // };
//     res.setHeader("access-control-allow-origin","*");
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,accept,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     console.log('response-----------------',res.header);
//     next();
//   });

  // inject our routers into their respective route file
  require('../users/authRoutes.js')(authRouter);
  require('../routes/api.js')(apiRouter);


};
