var mod = angular.module('GitUs.coders', []);

mod.controller('CodersController', function($scope, $http, User) {

  User.getRelated(User.url.related)
    .then(function(collection) {
      $scope.collection = collection.data;
      $scope.length = collection.data.length;
    });
});