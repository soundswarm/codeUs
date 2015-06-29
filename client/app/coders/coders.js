var mod = angular.module('GitUs.coders', []);

mod.controller('CodersController', function($scope, $http, User) {

  User.getRelated(User.url.related)
    .then(function(collection) {
    	console.log('collection: ', collection);
      $scope.collection = collection.data; 
  		console.log('$scope.collection: ', $scope.collection);
    });
});