'use strict';
MyApp.controller('HomeCtrl', function($scope, $location, $ionicLoading, FeedService, $rootScope, $timeout) {

  $ionicLoading.show({
    duration: 30000,
    noBackdrop: false,
    content: '<ion-spinner class="spinner-energized"></ion-spinner>'
  });
  $scope.tribes = {};
  $scope.hideEmptyTribes = true;

  FeedService.getTribes().then(function(response){
    if(response.data.tribes.length > 0)
      $scope.hideEmptyTribes = true;
    else
      $scope.hideEmptyTribes = false;
    $scope.tribes = chunk(response.data.tribes, 2);
    $timeout(function() { $ionicLoading.hide(); },300);
  });

  function chunk(arr, size) {
    var newArr = [];
    for (var i=0; i<arr.length; i+=size) {
      newArr.push(arr.slice(i, i+size));
    }
    return newArr;
  }
});
