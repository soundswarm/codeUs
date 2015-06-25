var morgan      = require('morgan'), // used for logging incoming request
    bodyParser  = require('body-parser'),
    helpers     = require('./helpers.js'); // our custom middleware
    db          = require('../app/config');
    api         = require('../app/helpers/helpers');
    session     = require('express-session');
    passport    = require('passport');
    util        = require('util');
    cookieParser = require('cookie-parser');
    
    

module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var authRouter = express.Router();
  var apiRouter = express.Router();


  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));


  app.use(authRouter); // use user router for all user request
  app.use('/api', apiRouter);

  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler)

  app.use(cookieParser());
  app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());



  // inject our routers into their respective route file
  require('../users/authRoutes.js')(authRouter);
  require('../routes/api.js')(apiRouter);


};
