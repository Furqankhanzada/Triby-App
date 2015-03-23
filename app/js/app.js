// Ionic Starter App
'use strict';
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var MyApp = angular.module('MyApp', ['ionic','LocalStorageModule','openfb','ngRoute','ngCordova']);

MyApp.config(['$ionicConfigProvider','$compileProvider','$sceDelegateProvider', function ($ionicConfigProvider,$compileProvider,$sceDelegateProvider){
  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.views.transition('none');
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.navBar.positionPrimaryButtons('left');
  $ionicConfigProvider.navBar.positionSecondaryButtons('right');
  // Set the whitelist for certain URLs just to be safe
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|data|http|blob):/);
  $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$')]);
}]);

MyApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html'
  })
    .state('signup_step1', {
      url: '/signup_1',
      templateUrl: 'templates/signup-step-1.html'
    })
    .state('signup_step2', {
      url: '/signup_2',
      templateUrl: 'templates/signup-step-2.html'
    })
    .state('login_facebook', {
      url: '/login_facebook',
      templateUrl: 'templates/login_facebook.html',
      controller: 'AppCtrl'
    })
    .state('confirm', {
      url: '/confirm',
      templateUrl: 'templates/signup-step-3.html'
    })
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/container.html',
      controller: 'AppCtrl'
    })
    .state('app.main', {
      url:'/main',
      views: {
        'menuContent' :{
          templateUrl: 'templates/main.html',
          controller: 'AppCtrl'
        }
      }
    })
    .state('app.main.home', {
      url:'/home',
      views: {
        'tab-home' :{
          templateUrl: 'templates/home.html',
          controller:'AppCtrl'
        }
      }
    })
    .state('app.noti', {
      url:'/noti',
      views: {
        'menuContent' :{
          templateUrl: 'templates/noti.html',
          controller:'AppCtrl'
        }
      }
    })
    .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/setting.html'
        }
      }
    })
    .state('app.news_feed', {
      url: '/news_feed/:triby_id/:count',
      views: {
        'menuContent': {
          templateUrl: 'templates/news_feed.html',
          controller: "FeedCtrl"
        }
      }
    })
    .state('app.comments', {
      url: '/comments/:triby_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/comments.html',
          controller:"CommentsCtrl"
        }
      }
    })
    .state('app.comments_side', {
      url: '/comments_side/:triby_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/comments_side.html'
        }
      }
    })
    .state('app.chat', {
      url: '/chat',
      views: {
        'menuContent': {
          templateUrl: 'templates/chat.html'
        }
      }
    })
    .state('app.add_members', {
      url: '/add_members',
      views: {
        'menuContent': {
          templateUrl: 'templates/add_members.html'
        }
      }
    })
    .state('app.new_triby', {
      url: '/new_triby',
      views: {
        'menuContent': {
          templateUrl: 'templates/new_triby.html'
        }
      }
    })
    .state('app.add_people', {
      url: '/add_people',
      views: {
        'menuContent': {
          templateUrl: 'templates/add_people.html'
        }
      }
    })
    .state('app.search', {
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'templates/search.html'
        }
      }
    })
    .state('app.tribys', {
      url: '/tribys',
      views: {
        'menuContent': {
          templateUrl: 'templates/tribys.html'
        }
      }
    })
    .state('app.info', {
      url: '/info/:triby_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/info.html'
        }
      }
    })
    .state('app.edit_info', {
      url: '/edit_info/:triby_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/edit_info.html'
        }
      }
    })
    .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html'
        }
      }
    })
    .state('app.account', {
      url: '/account',
      views: {
        'menuContent': {
          templateUrl: 'templates/account.html'
        }
      }
    })
    .state('app.contacts', {
      url: '/contacts',
      views: {
        'menuContent': {
          templateUrl: 'templates/contacts.html'
        }
      }
    })
    .state('app.change_number', {
      url: '/change_number',
      views: {
        'menuContent': {
          templateUrl: 'templates/change_number.html'
        }
      }
    })
    .state('app.delete_account', {
      url: '/delete_account',
      views: {
        'menuContent': {
          templateUrl: 'templates/delete_account.html'
        }
      }
    })
    .state('app.notifications', {
      url: '/notifications',
      views: {
        'menuContent': {
          templateUrl: 'templates/notifications.html'
        }
      }
    })
    .state('app.feedback', {
      url: '/feedback',
      views: {
        'menuContent': {
          templateUrl: 'templates/feedback.html'
        }
      }
    })
    .state('app.terms', {
      url: '/terms',
      views: {
        'menuContent': {
          templateUrl: 'templates/terms.html'
        }
      }
    })
    .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html'
        }
      }
    })
    .state('app.mural', {
      url: '/mural/:triby_info',
      views: {
        'menuContent': {
          templateUrl: 'templates/mural.html'
        }
      }
    })
    .state('mural_details', {
      url: '/mural_details',
      templateUrl: 'templates/mural_details.html'
    })
    .state('app.main.no_connection', {
      url:'/no_connection',
      views: {
        'tab-home' :{
          templateUrl: 'templates/no_connection.html',
          controller:'AppCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/signup');
});

MyApp.run(function($ionicPlatform,$rootScope,UserService,$cordovaSplashscreen,$ionicPopup,OpenFB,$location,$state) {

  $rootScope.params = {count: 0};
  $rootScope.params.increment = function(){
    $rootScope.params.count++;
  };

  OpenFB.init('585883268214163','http://localhost:8100/oauthcallback.html', window.localStorage);
  $rootScope.urlBackend = 'http://104.236.5.153:3000';
  //$rootScope.urlBackend = 'http://192.168.1.77:3000';

  $rootScope.Get_Width=function(index)
  {
    if(index%3==0)
      return '100%';
    else
      return '50%';
  }
  $rootScope.Get_PaddingLeft=function(index)
  {
    if(index%3==0 || index%3==1)
      return '0px';
    else
      return '3px';
  }

  $ionicPlatform.registerBackButtonAction(function (event) {
    if($state.current.name=="app.main.home"){
      navigator.app.exitApp();
    }
    else {
      navigator.app.backHistory();
    }
  }, 100);

  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if(window.Connection) {
      if(navigator.connection.type == Connection.NONE) {
        $location.path('app/main/no_connection');
      }
      document.addEventListener("offline", function() {
        $location.path('app/main/no_connection');
      }, false);
      document.addEventListener("online", function() {
        $location.path('app/main/home');
      }, false);
    }
    console.log("Checking user..");
    if(!UserService.isAuthorized()){
      console.log("Not authorized");
      $cordovaSplashscreen.hide();
    }
  });
});
