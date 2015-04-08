'use strict';
MyApp.controller('InfoEditCtrl', function($scope, $location, $ionicLoading, FeedService, $rootScope, $stateParams, SettingsService, $window, $timeout, $route
    ,$state) {

  $scope.triby = {};
  FeedService.getTriby($stateParams.triby_id).then(function(response){
    $scope.triby = response.data.tribe;

  });

  $scope.showDone = "";
  var initializing = true;
  $scope.$watch("triby.name", function(newValue, oldValue) {
    if(initializing){
      $timeout(function() { initializing = false; },500);
    }
    else{
      if (newValue != oldValue) {
        $scope.showDone = "Done";
      }
    }
  });
  $scope.$watch("triby.pic", function(newValue, oldValue) {
    if(initializing){
      $timeout(function() { initializing = false; },500);
    }
    else{
      if (newValue != oldValue) {
        $scope.showDone = "Done";
      }
    }
  });

  $scope.uploadPicture = function(){
    $ionicLoading.show({
      template: 'Uploading...'
    });
    SettingsService.fileTo($rootScope.urlBackend + '/uploads','AVATAR').then(function(response){

      if(response.status == "success"){
        $scope.triby.pic = response.url_file;
      }
      else
        window.plugins.toast.showShortCenter("Error uploading picture", function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
      $ionicLoading.hide();
    });
  };

  $scope.saveTribyInfo = function(){

    FeedService.updateTriby($scope.triby).then(function(response){
      if(response.status=="success"){
          $state.go("app.info",{triby_id: $scope.triby._id});
      }
      else
        window.plugins.toast.showShortCenter(response.message, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
    });
  };

  $scope.goBack = function(){
      $state.go("app.news_feed",{triby_id: $scope.triby._id});
  }
});




