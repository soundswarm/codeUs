var mod = angular.module('GitUs.auth', []);

mod.controller('AuthController', function($scope, Auth) {
  $scope.signin = Auth.signin;
  // $scope.user = {};

  // $scope.signin = function() {
  //   Auth.signin($scope.user)
  //   .then(function() {
  //     // $window.localStorage.setItem('com.shortly', token);
  //     console.log("signed in!!");

  //     // $location.path('/')
  //   })
  //   .catch(function(error) {
  //     console.error(error);
  //   });
  // };

})
