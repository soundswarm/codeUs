var mod = angular.module('GitUs.coders', []);

mod.controller('CodersController', function($scope, $http, User) {
  $scope.user = Coders;

  User.getRelated(User.url.related, LANGUAGE, LOCATION)
    .then(function(collection) {
    	console.log(collection);
      $scope.collection = collection; 
    });
});