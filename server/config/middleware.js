var morgan      = require('morgan'), // used for logging incoming request
    bodyParser  = require('body-parser'),
    helpers     = require('./helpers.js'); // our custom middleware
    db          = require('../app/config');
    api         = require('../app/helpers/helpers');
    

module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var oauthRouter = express.Router();
  var apiRouter = require('../routes/api.js');


  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));


  app.use(oauthRouter); // use user router for all user request
  app.use('/api', apiRouter);

  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);



  // inject our routers into their respective route file
  require('../users/oauthRoutes.js')(oauthRouter);
  apiRouter(app);


};
