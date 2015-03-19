'use strict';
MyApp.controller('UserCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $location, UserService, $window, $cordovaDevice, OpenFB, $cordovaSplashscreen) {
  
  $scope.signupData = {
    username: "",
    phone: ""
  }
  $scope.texto = 'Hello World!';
  if(UserService.isAuthorized()){
    UserService.loginUser().then(function(response){
      console.log(response.message);
      if(response.status == "success"){
        $window.location.href = "#/app/main/home";
        $timeout(function(){
          $cordovaSplashscreen.hide();
        },5000);
      }
    });
    
  }

  $scope.fbLogin = function(){
    
    OpenFB.login('email,user_friends').then(
      function () {
        var aUser = {};
        OpenFB.get('/me').success(function (user) {
          aUser.id = user.id;
          aUser.name = user.name;
          aUser.email = user.email;
          OpenFB.get('/me/picture',{
            "redirect": false,
            "height": 80,
            "width": 80,
            "type": "normal"
          }).success(function(response){
            aUser.image = response.data.url;
            UserService.loginUserFacebook(aUser).then(function(response){
              console.log(response);
              if(response.status == "success")
                $location.path('app/main/home');
            });
          });
            
        });
      },
      function () {
          alert('OpenFB login failed');
      });
  }

  $scope.loginFacebook = function(){
    var confirmPopup = $ionicPopup.confirm({
     title: 'Authorization',
     template: 'Triby would like to access your public profile, location and friend lists.'
   });
   confirmPopup.then(function(res) {
     if(res) {
       console.log("OK");
     } else {
       console.log("Don't allow");
     }
   });
  }

  $scope.signup = function(){
    
    UserService.signUpUser($scope.signupData,$cordovaDevice.getUUID()).then(function(response){
      if(response.status == "success")
        $location.path("/confirm");
      else
        window.plugins.toast.showShortCenter(response.message, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
    });
  }
});

MyApp.controller('UserCtrlConfirm', function($scope, $ionicModal, $timeout, $ionicPopup, $location, $window, UserService) {
  
  $scope.formData = {
    code : ""
  };

  $scope.init = function () {
    console.log("load UserCtrlConfirm")
    $scope.mobilenumber = UserService.getMobileNumber();
  }
  // init method
  $scope.init();

  $scope.confirm = function() {
   
    UserService.confirmUser($scope.formData.code).then(function(response){

      if(response.status == "success")
        $window.location.href = "#/app/main/home";
      else
        window.plugins.toast.showShortCenter(response.message, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
   });
  }
});