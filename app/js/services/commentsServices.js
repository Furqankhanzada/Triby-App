'use strict';

MyApp.service('CommentsService', function ($http, localStorageService, $rootScope, $cordovaFile, $cordovaCamera, $q, $ionicLoading, SettingsService) {

  var commentsServiceFactory = {};

  var _addComment = function(commentObj, aType, aSource){

      var deferred = $q.defer();

      if(aType && aSource){
          SettingsService.fileTo(aSource, commentObj, '/comments', aType, function(success, err){
              if(success) deferred.resolve(success);
              if(err) deferred.reject(err);
          });
      }
      else{
          var authData = localStorageService.get('authorizationData');
          $http.defaults.headers.common['Authorization'] = authData.token;

          $http.post($rootScope.urlBackend + '/comments', commentObj).then(function(data){
              deferred.resolve(data.data);
          }, function(err){
              deferred.reject(err);
          });
      }
      return deferred.promise;
  };

  commentsServiceFactory.addComment = _addComment;

  return commentsServiceFactory;

});
