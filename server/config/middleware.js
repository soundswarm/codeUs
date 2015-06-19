var morgan      = require('morgan'), // used for logging incoming request
    bodyParser  = require('body-parser'),
    helpers     = require('./helpers.js'); // our custom middleware


var githubOAuth = require('github-oauth')({
  githubClient: process.env['16b3fb882ea54cac1939'],
  githubSecret: process.env['4da3e94f68a98158647e5e145426f975a026d6b3'],
  baseURL: 'http://localhost',
  loginURI: '/oauth/signin',
  callbackURI: '/success',
  scope: 'user' // optional, default scope is set to user
});

githubOAuth.on('error', function(err) {
  console.error('there was a login error', err)
});

githubOAuth.on('token', function(token, serverResponse) {
  console.log('here is your shiny new github oauth token', token)
  serverResponse.end(JSON.stringify(token))
})



module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  // var oauthRouter = express.Router();
  // var linkRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));


  // app.use('/oauth', oauthRouter); // use user router for all user request

  // authentication middleware used to decode token and made available on the request
  //app.use('/api/links', helpers.decode);
  // app.use('/api/links', linkRouter); // user link router for link request
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://173.247.199.46:8000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
  });

  app.get('/oauth/signin', function(req, res, next) {
     return githubOAuth.login(req, res)
  });

  app.get('/success', function(req, res, next) {
    return githubOAuth.callback(req, res)
  });

  // inject our routers into their respective route file
  //
  // require('../users/oauthRoutes.js')(oauthRouter);

};
