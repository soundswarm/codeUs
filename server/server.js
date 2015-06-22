// var express = require('express');

// var app = express();

// require('./config/middleware.js')(app, express);

// module.exports = app;

// app.listen(8000);

//var http = require("http");
var request = require('request');
// var handleRequest = require('./request-handler');


// var port = 8000;
// var ip = "127.0.0.1";
// console.log("Listening on http://" + ip + ":" + port);

// var server = http.createServer(handleRequest);
// server.listen(port, ip);

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
});

require('http').createServer(function(req, res) {
  console.log("creating server");
  console.log(req.url)
  if (req.url.match(githubOAuth.baseURL)) console.log("HELLO");
  if (req.url.match(/signin/)) return githubOAuth.login(req, res);
  if (req.url.match(/success/)) return githubOAuth.callback(req, res);
}).listen(8000)

