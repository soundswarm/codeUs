var mod = angular.module('GitUs.user', [])
mod.controller('UserController', function($scope, $http, User) {
  $scope.user = User;

  //this can be refactored when all the user data is 
  // coming from server
  User.getUser()
    .then(function(user) {
      user = user.data;
      $scope.user.url = user.url; 
      $scope.user.login = user.login; 
      $scope.user.avatar_url = user.avatar_url; 
    });
});