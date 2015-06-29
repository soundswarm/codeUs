var mod = angular.module('GitUs.coders', []);

mod.controller('CodersController', function($scope, $http, User) {

  User.getRelated(User.url.related)
    .then(function(collection) {
      $scope.collection = collection.data;
      $scope.length = collection.data.length;
    });

  // $scope.getIframeURL = function(login) {	
  // 	var begin = 'https://ghbtns.com/github-btn.html?user={{';
  // 	var end = '}}&type=follow&count=true&size=large" frameborder="0" scrolling="0" width="220px" height="30px">';
  // 	return begin + login + end;
  // };
  
});