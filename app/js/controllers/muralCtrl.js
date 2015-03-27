'use strict';
MyApp.controller('MuralCtrl', function($window, $scope, $timeout, $ionicPopup, $location, $cordovaCamera, $ionicModal, $stateParams) {

  $ionicModal.fromTemplateUrl('templates/mural_details.html', function(modal) {
      $scope.gridModal = modal;
    },
    {
      scope: $scope
    });

  $scope.goBack = function(){
    $window.location.href = "#/app/news_feed/" + $stateParams.triby_id;
  }

  $scope.openModal = function(selected) {

    $scope.gridModal.show();
  };

  $scope.closeModal = function() {
    $scope.gridModal.hide();
  };
});

