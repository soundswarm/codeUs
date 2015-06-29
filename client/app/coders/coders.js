var mod = angular.module('GitUs.coders', [])
mod.controller('CodersController', function($scope, $http, User) {
  $scope.user = Coders;

  User.getUser(User.url.related)
    .then(function(collection) {
    	console.log(collection);
      $scope.collection = collection; 
    });
});