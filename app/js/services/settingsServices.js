'use strict';

MyApp.factory('SettingsService', function($ionicLoading, $q, $rootScope, $http, localStorageService, $cordovaCamera, $cordovaFile) {
  
  var settingsServiceFactory = {};

  var _changeNumbers = function(numbers){

    var deferred = $q.defer();
    var authData = localStorageService.get('authorizationData');
    var data = {
                    old_number:numbers.old_number,
                    new_number:numbers.new_number
                };

    $http.defaults.headers.common['Authorization'] = authData.token;
    $http.post($rootScope.urlBackend + '/user/changenumber', data).success(function (response) {
      
      if(response.status == "success")
        localStorageService.set('authorizationData', { username: response.user.username, mobilenumber: response.user.mobilenumber, token:authData.token, isAuth:true });
      
      deferred.resolve(response);
    }).error(function (err, status) {
      deferred.reject(err);
    });

    return deferred.promise;
    
  }

  var _removeUser = function(numbers){

    var deferred = $q.defer();
    var authData = localStorageService.get('authorizationData');
    var data = {
                    old_number:numbers.old_number,
                    new_number:numbers.new_number
                };

    $http.defaults.headers.common['Authorization'] = authData.token;
    $http.post($rootScope.urlBackend + '/user/delete', data).success(function (response) {
      
      if(response.status == "success")
        localStorageService.remove('authorizationData');
      
      deferred.resolve(response);
    }).error(function (err, status) {
      deferred.reject(err);
    });

    return deferred.promise;
    
  }
	
  var _fileTo = function(serverURL,aType,aSource) {
    var deferred = $q.defer();

    if (ionic.Platform.isWebView()) {

      var options = {
          quality: 100
          , destinationType: Camera.DestinationType.FILE_URI
          , encodingType: Camera.EncodingType.JPEG
      }
      if(aSource === 'CAMERA')
        options.sourceType = Camera.PictureSourceType.CAMERA;
      else
        options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;

      if(aType === 'AVATAR'){
        options.targetWidth = 200;
        options.targetHeight = 200;
      }
      if(aType === 'TRIBY'){
        options.targetWidth = 200;
        options.targetHeight = 200;
      }

      $cordovaCamera.getPicture(options).then(

        function(fileURL) {
          $ionicLoading.show({
            template: 'Uploading...'
          });

          var authData = localStorageService.get('authorizationData');
          $http.defaults.headers.common.Authorization = authData.token;

          var uploadOptions = new FileUploadOptions();
          uploadOptions.fileKey = 'file';
          uploadOptions.fileName = authData.username + '_' + Date.now();
          uploadOptions.mimeType = 'image/jpeg';
          uploadOptions.chunkedMode = false;

          var params = {
            type: aType
          };
          uploadOptions.params = params;
          uploadOptions.fileName += '.jpg';

          $cordovaFile.uploadFile(serverURL, fileURL, uploadOptions).then(
            function(result) {
              var obj = JSON.parse(result.response);
              deferred.resolve(obj);
              $ionicLoading.hide();
            }, function(err) {
              deferred.reject(err);
              $ionicLoading.hide();
            });

        }, function(err){
          deferred.reject(err);
          $ionicLoading.hide();
        });

    }
    else {
      deferred.reject('Uploading not supported in browser');
    }
    $ionicLoading.hide();
    return deferred.promise;

  }

  var _saveProfile = function(userData){
    var deferred = $q.defer();

    var authData = localStorageService.get('authorizationData');
    $http.defaults.headers.common.Authorization = authData.token;

    $http.put($rootScope.urlBackend + '/user/' + authData.username, userData).success(function (response) {
      
      deferred.resolve(response);
    }).error(function (err, status) {
      deferred.reject(err);
    });

    return deferred.promise;

  }

  var _saveFeedback = function(feedBackData){
    var deferred = $q.defer();
    var authData = localStorageService.get('authorizationData');
    $http.defaults.headers.common['Authorization'] = authData.token;
    feedBackData.username = authData.username;
    
    $http.post($rootScope.urlBackend + '/user/feedback', feedBackData).success(function (response) {
        deferred.resolve(response);
    }).error(function (err, status) {
          deferred.reject(err);
    });

    return deferred.promise;
  }

  var _getContactsLocal = function(){
    var authData = localStorageService.get('contacts');
    if(!authData)
      return [];
    else
      return authData.contacts;
  }

  var _getContacts = function(numbers){
    var deferred = $q.defer();
    var authData = localStorageService.get('authorizationData');
    $http.defaults.headers.common['Authorization'] = authData.token;
   
    
    $http.post($rootScope.urlBackend + '/user/contacts', numbers).success(function (response) {
        localStorageService.set('contacts', { contacts: response.users });
        deferred.resolve(response);
    }).error(function (err, status) {
          deferred.reject(err);
    });

    return deferred.promise;
  }

  settingsServiceFactory.changeNumbers = _changeNumbers;
  settingsServiceFactory.removeUser = _removeUser;
  settingsServiceFactory.fileTo = _fileTo;
  settingsServiceFactory.saveProfile = _saveProfile;
  settingsServiceFactory.saveFeedback = _saveFeedback;
  settingsServiceFactory.getContacts = _getContacts;
  settingsServiceFactory.getContactsLocal = _getContactsLocal;
  
  return settingsServiceFactory;
})