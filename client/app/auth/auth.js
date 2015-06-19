angular.module('GitUs.auth', [])

.controller('AuthController', function($scope, $window, $location, Auth) {
  $scope.user = {};

  $scope.signin = function() {
    Auth.signin($scope.user)
    .then(function(token) {
      $window.localStorage.setItem('com.shortly', token);
      console.log("signed in!!");

      $location.path('/')
    })
    .catch(function(error) {
      console.error(error);
    });
  };

  $scope.signup = function() {
    Auth.signup($scope.user)
    .then(function(token) {
      $window.localStorage.setItem('com.shortly', token);
      console.log("signed up user!!");
      $location.path('/')
    })
    .catch(function(error) {
      console.error(error);
    });
  };




})
