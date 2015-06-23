var mod = angular.module('GitUs.user', [])
mod.controller('UserController', function($scope, $http, User) {
  $scope.user = {};

  $scope.user.languages = User.languages;

  $http.get('https://api.github.com/users/soundswarm')
  .success(function(data) {
    $scope.user.login = data.login;
    $scope.user.avatar_url = data.avatar_url;
    $scope.user.url = data.html_url;

  })
})