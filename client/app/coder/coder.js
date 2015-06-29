var mod = angular.module('GitUs.coder', [])
mod.controller('CoderController', function($scope, $http, Coder) {
  $scope.coder = Coder;

  var usernameArr = window.location.hash.split('/');

  $scope.username = usernameArr[usernameArr.length-1];

  var targetUrl = Coder.url.coder + $scope.username;

  console.log('targetUrl: ', targetUrl);

  Coder.getCoder(targetUrl)
    .then(function(coder) {
      console.log('coder.data:', coder.data);
      $scope.coder.data = coder.data; 
    });
});