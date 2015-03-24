'use strict';

/*MyApp.factory('FeedService', function($q, $rootScope, $http, localStorageService, $cordovaCamera, $cordovaFile) {

  var feedServiceFactory = {};

  var _tribyData = {};
  var _setNewTriby = function(tribyData){
    _tribyData = tribyData;
  }
  var _getNewTriby = function(){
    return _tribyData;
  }
  var _saveTriby = function(tribyData){
    var deferred = $q.defer();
    var authData = localStorageService.get('authorizationData');
    $http.defaults.headers.common['Authorization'] = authData.token;
    tribyData.username = authData.username;
    tribyData.members.push(authData.username);

    $http.post($rootScope.urlBackend + '/tribes', tribyData).success(function (response) {
        deferred.resolve(response);
    }).error(function (err, status) {
          deferred.reject(err);
    });

    return deferred.promise;
  }

  var _updateTriby = function(tribyData){
    var deferred = $q.defer();
    var authData = localStorageService.get('authorizationData');
    $http.defaults.headers.common['Authorization'] = authData.token;
    tribyData.username = authData.username;

    $http.put($rootScope.urlBackend + '/tribes/' + tribyData._id, tribyData).success(function (response) {
        deferred.resolve(response);
    }).error(function (err, status) {
          deferred.reject(err);
    });

    return deferred.promise;
  }

  var _addMembers = function(tribyId,users){
    var deferred = $q.defer();
    var authData = localStorageService.get('authorizationData');
    $http.defaults.headers.common['Authorization'] = authData.token;
    users.push({"username":authData.username});

    $http.post($rootScope.urlBackend + '/tribes/' + tribyId + '/members', {"users":users}).success(function (response) {
        deferred.resolve(response);
    }).error(function (err, status) {
          deferred.reject(err);
    });

    return deferred.promise;
  }

  var _getTribes = function(){
    var authData = localStorageService.get('authorizationData');
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.get($rootScope.urlBackend + '/tribes/user/' + authData.username);
  }

  var _getTriby = function(aTribyId){
    var authData = localStorageService.get('authorizationData');
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.get($rootScope.urlBackend + '/tribes/' + aTribyId);
  }

  var _savePost = function(postData){
    var deferred = $q.defer();
    var authData = localStorageService.get('authorizationData');
    $http.defaults.headers.common['Authorization'] = authData.token;

    postData.parentid = postData.triby;
    postData.parenttype = "tribe";
    postData.content = postData.message;
    postData.pic = postData.image;
    postData.user = authData.username;

    $http.post($rootScope.urlBackend + '/posts', postData).success(function (response) {
        deferred.resolve(response);
    }).error(function (err, status) {
          deferred.reject(err);
    });

    return deferred.promise;
  }

  var _getPosts = function(tribyID){
    var authData = localStorageService.get('authorizationData');
    $http.defaults.headers.common['Authorization'] = authData.token;

    return $http.get($rootScope.urlBackend + '/posts/' + tribyID);
  }

  var _exitTriby = function(tribyId){
    var deferred = $q.defer();
    var authData = localStorageService.get('authorizationData');
    $http.defaults.headers.common.Authorization = authData.token;

    var postData = {};
    postData.username = authData.username;

    $http.put($rootScope.urlBackend + '/tribes/' + tribyId + '/members', postData).success(function (response) {
        deferred.resolve(response);
    }).error(function (err, status) {
          deferred.reject(err);
    });

    return deferred.promise;
  }

  feedServiceFactory.setNewTriby = _setNewTriby;
  feedServiceFactory.getNewTriby = _getNewTriby;
  feedServiceFactory.saveTriby = _saveTriby;
  feedServiceFactory.updateTriby = _updateTriby;
  feedServiceFactory.addMembers = _addMembers;
  feedServiceFactory.getTribes = _getTribes;
  feedServiceFactory.getTriby = _getTriby;
  feedServiceFactory.savePost = _savePost;
  feedServiceFactory.getPosts = _getPosts;
  feedServiceFactory.exitTriby = _exitTriby;

  return feedServiceFactory;
})*/
MyApp.service('CommentsService', function () {

    return {

    }

});
