var morgan      = require('morgan'), // used for logging incoming request
    bodyParser  = require('body-parser'),
    // helpers     = require('./helpers.js'), // our custom middleware
    db          = require('../app/config'),
    api         = require('../app/helpers/helpers'),
    cors        = require('cors')
    cookieParser = require('cookie-parser'),
    session     = require('express-session'),
    passport    = require('passport')    

module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var authRouter = express.Router();
  var apiRouter = express.Router();


  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));

  app.use(cookieParser());
  app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).

  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/api', apiRouter);
  app.use(authRouter); 
 

  // app.use(helpers.errorLogger);
  // app.use(helpers.errorHandler);

  // inject our routers into their respective route file
  require('../users/authRoutes.js')(authRouter);
  require('../routes/api.js')(apiRouter);
  // require('../cronjobs/populate.js')();
  // require('../cronjobs/credlang.js')();

};
