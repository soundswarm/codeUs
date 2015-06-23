var mod = angular.module('GitUs.factories', [])

mod.factory('User', function($http) {
  return {
    languages: { 
      ObjectCoffeeScript: 458, 
      JavaScript: 1234,
      Ruby: 23810
    },
    tecnologies: {
      Angular: 1000,
      Backbone: 400,
      Express: 500,
      SQL: 300,
      Mongo: 200
    }
  }
})
  //   return 
  //   {
  //     user: { 
  //       ObjectCoffeeScript: 458, 
  //       JavaScript: 1234,
  //       Ruby: 23810
  //     },
  //     getUser: function($http) {
  //       $http.get('https://api.github.com/users/soundswarm')
  //         .success(function(data) {
  //           $scope.user.login = data.login;
  //           $scope.user.avatar_url = data.avatar_url;
  //           $scope.user.url = data.html_url;

  //         })
  //       }    
  //     }
  //   }

  


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
