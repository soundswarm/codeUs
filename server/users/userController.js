// var User = require('./userModel.js'),
//     Q    = require('q'),
//     jwt  = require('jwt-simple');

// module.exports = {

//   checkAuth: function(req, res, next) {
//     var token = req.headers['x-access-token'];
//     if(!token){
//       next(new Error('No token'))
//     } else {
//       var user = jwt.decode(token, 'secret')
//       var findUser = Q.nbind(User.findOne, User);
//       findUser({ username:username })
//       .then(function(foundUser) {
//         if(foundUser) {
//           res.send(200);
//         } else {
//           res.send(401);
//         }

//       })
//       .fail(function(error) {
//         next(error)
//       });
//     }
//   },

//   getUser: function(req) {
//     console.log("do we have"+ req)
//     // var foundUser = "Chris"

//     var token = req.headers['x-access-token'];
//     if(!token){
//       next(new Error('No token'))
//     } else {
//       var user = jwt.decode(token, 'secret')

//       var findUser = Q.nbind(User.findOne, User);
//       return findUser({ username: user.username })
//       .then(function(foundUser) {
//         if(foundUser) {
//           console.log("Hello" +foundUser)
//           var foundUser = foundUser;
//           return foundUser;
//         } else {
//           console.log("could not get user in getPoems request")
//           return null;
//         }

//       })
//       console.log(foundUser)
//       return foundUser;
//     }
//     // console.log(foundUser)
//     // return foundUser;
//   }


// };
