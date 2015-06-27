var mod = angular.module('GitUs.user', [])
mod.controller('UserController', function($scope, $http, User) {
  $scope.user = User;

  User.getUser(User.url.self)
    .then(function(user) {
      console.log(user)
      $scope.user.data = user.data; 
    });
});