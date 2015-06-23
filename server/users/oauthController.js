// var User = require('./userModel.js'),
var Promise = require("bluebird");
//     Q    = require('q'),
jwt  = require('jwt-simple');
//
//     This file is in .gitignore
var githubOAuth = require('github-oauth')({
  githubClient: '16b3fb882ea54cac1939',
  githubSecret: '4da3e94f68a98158647e5e145426f975a026d6b3',
  baseURL: 'http://localhost:8000',
  loginURI: '/signin',
  callbackURI: '/success',
  scope: '' // optional, default scope is set to user
});

githubOAuth.on('error', function(err) {
  console.error('there was a login error', err)
});

githubOAuth.on('token', function(token, serverResponse) {
  console.log('here is your shiny new github oauth token', token)
  serverResponse.end(JSON.stringify(token))
})


module.exports = {
  signin: function(req, res, next) {
    return githubOAuth.login(req, res);
  },
  success: function(req, res, next) {
    return githubOAuth.callback(req, res);
  }

  // signup: function(req, res, next) {
  //   var username = req.body.username,
  //       password = req.body.password,
  //       create,
  //       newUser;

  //   var findOne = Q.nbind(User.findOne, User);

  //   //does user already exist?
  //   findOne({ username: username })
  //   .then(function(user) {
  //     if(user) {
  //       next(new Error("User already exists"))
  //     } else {
  //       create = Q.nbind(User.create, User);
  //       newUser = {
  //         username: username,
  //         password: password
  //       }
  //       return create(newUser)
  //     }
  //   })
  //   .then(function(user) {
  //     console.log("SignedUp User");
  //     var token = jwt.encode(user, 'secret');
  //     res.json({token: token})
  //   })
  //   .fail(function(error) {
  //     next(error)
  //   })
  // }

}
