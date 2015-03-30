'use strict';
MyApp.controller('AddMembersCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $location, $ionicLoading, SettingsService, FeedService, $rootScope, $window, UserService, $state) {

  var triby;
  var contacts = [];
  $scope.contacts = [];

//  UserService.getUser().then(function(data){
//        console.log("get user .... :", data);
//      SettingsService.getContactsLocal(data.data.user).then(function(response){
//          console.log(response);
//          contacts = response;
//          //console.log(JSON.stringify(triby));
//          triby = FeedService.getNewTriby();
//          console.log(JSON.stringify(contacts));
//          for(var i=0; i < contacts.length; i++){
//              console.log(triby.members.indexOf(contacts[i].username));
//              if(triby.members.indexOf(contacts[i].username) >= 0)
//                  contacts[i].checked = true;
//              else
//                  contacts[i].checked = false;
//          }
//          console.log(JSON.stringify(contacts));
//          $scope.contacts = contacts;
//      });
//    });

  $scope.updateTriby = function(){
    var triby = FeedService.getNewTriby();
    console.log(triby);
    triby.members = [];
    for(var i=0; i < $scope.contacts.length; i++){
      if($scope.contacts[i].checked)
        triby.members.push($scope.contacts[i].username);
    }
    FeedService.updateTriby(triby).then(function(response){
      console.log(JSON.stringify(response));
      if(response.status=="success"){
        $timeout(function(){
          $window.location.href = "#/app/info/" + triby._id;
          $window.location.reload();
        }, 100);
      }
      else
        window.plugins.toast.showShortCenter(response.message, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
    });
  }

  $scope.goBack = function(){
    $timeout(function(){
      $window.location.href = "#/app/info/" + triby._id;
      $window.location.reload();
    }, 100);
  }
});

