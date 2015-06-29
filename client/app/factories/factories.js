var mod = angular.module('GitUs.factories', [])

mod.factory('User', function($http) {
  return {
    // username: 'soundswarm',
    // languages: { 
    //   ObjectCoffeeScript: 458, 
    //   JavaScript: 1234,
    //   Ruby: 23810
    // },
    technologies: {
      Angular: 1000,
      Backbone: 400,
      Express: 500,
      SQL: 300,
      Mongo: 200
    },
    // bling: {
    //   Followers: 30,
    //   Watcher: 20,
    //   Stars: 10,
    //   Forks: 5,
    //   Downloads: 2,
    // },
    url: {
      root: 'http://127.0.0.1:8000',
      self: 'http://127.0.0.1:8000'+'/api/user',
      related: 'http://127.0.0.1:8000' + '/api/related'
      // user: 'http://127.0.0.1:8000'+'/api/user/',
    },
    getUser: function(userUrl) {
      console.log(userUrl);
      return $http.get(userUrl)
        .then(function(user) {
          return user;
        })
        .catch(function(err){
          console.log(err);
        })
    },
    getRelated: function(relatedUrl) {
      return $http.get(relatedUrl)
        .then(function(array) {
          return array;
        })
        .catch(function(err) {
          console.log(err);
        })
    }
  }
});

mod.factory('Coder', function($http) {
  return {
    url: {
      coder: 'http://127.0.0.1:8000/coder/'
    },
    getCoder: function(url) {
      return $http.get(url)
        .then(function(coder) {
          return coder;
        })
        .catch(function(err){
          console.log(err);
        })
    }
  };
});

mod.factory('Auth', function($http) {
  return {
    signin: function() {
       console.log('inAuthcontroller')
      return $http.get(auth);
    }
    //implement a function that checks if user is signed in.
    // isSignedIn: function() {
    //   return $http.get('http://127.0.0.1:8000/auth')
    //     .then(function(bool) {
    //       return bool
    //     })
    //     .catch(function(err){
    //       console.log(err)
    //     })
    // }
  }
});


  


// mod.factory('Auth', function ($http, $location, $window) {
//   // Don't touch this Auth service!!!
//   // it is responsible for authenticating our user
//   // by exchanging the user's username and password
//   // for a JWT from the server
//   // that JWT is then stored in localStorage as 'com.shortly'
//   // after you signin/signup open devtools, click resources,
//   // then localStorage and you'll see your token from the server
//   var signin = function (user) {
//     return $http({
//       method: 'GET',
//       url: '/signin'
//     });
//     // .then(function (resp) {
//     //   return resp.data.token;
//     // });
//   };

//   var signup = function (user) {
//     return $http({
//       method: 'POST',
//       url: '/haiku/users/signup',
//       data: user
//     })
//     .then(function (resp) {
//       return resp.data.token;
//     });
//   };

//   var isAuth = function () {
//     return !!$window.localStorage.getItem('com.shortly'); //access cookie
//   };

//   var signout = function () {
//     $window.localStorage.removeItem('com.shortly');
//     $location.path('/signin');
//   };


//   return {
//     signin: signin,
//     signup: signup,
//     isAuth: isAuth,
//     signout: signout
//   };
// })
