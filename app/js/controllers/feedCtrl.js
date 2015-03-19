'use strict';
MyApp.controller('FeedCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $location, $cordovaCamera, $stateParams,SettingsService,$rootScope,FeedService,$window) {

	$scope.title = '<a href="#/app/info/' + $stateParams.triby_id + '">BFFs</a>';
	$scope.posts = [];
	$scope.post = {
		message: "",
		image: "",
		triby: $stateParams.triby_id
	};

	FeedService.getPosts($stateParams.triby_id).then(function(response){
		console.log(response);
	});

	$scope.feeds = [
		{
		  "likes":50,
		  "hearth":50,
		  "dislikes":0,
		  "messages":true,
		  "chatMessages":0
		},
		{
		  "likes":0,
		  "hearth":0,
		  "dislikes":1,
		  "messages":false,
		  "chatMessages":100
		},
	];

	$scope.getHandUp = function(index){
		if($scope.feeds[index].likes > 0)
		  return "img/hand-up.png";
		else
		  return "img/hand-up-grey.png";
	}
	$scope.getHearth = function(index){
		if($scope.feeds[index].hearth > 0)
		  return "img/heart.png";
		else
		  return "img/heart-grey.png";
	}
	$scope.getHandDown = function(index){
		if($scope.feeds[index].dislikes > 0)
		  return "img/hand-down.png";
		else
		  return "img/hand-down-grey.png";
	}
	$scope.addLike = function(index){
		$scope.feeds[index].likes += 1;
	}
	$scope.addHearth = function(index){
		$scope.feeds[index].hearth += 1;
	}
	$scope.addDislike = function(index){
		$scope.feeds[index].dislikes += 1;
	}

	$scope.postMessage = function(){
		console.log($scope.post.message)
	};

	$scope.uploadPicture = function(source){

		SettingsService.fileTo($rootScope.urlBackend + '/uploads',"POST",source).then(function(response){

			if(response.status == "success"){
				$scope.post.image = response.url_file;
				// adding post
				FeedService.savePost($scope.post).then(function(response){
					console.log(response);
					if(response.status == "success"){
						$timeout(function(){
							$window.location.href = "#/app/news_feed/" + $stateParams.triby_id;
							$window.location.reload();
						}, 100);
					}
				});
			}
			else
				window.plugins.toast.showShortCenter("Error uploading picture", function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
		});
	}
});

MyApp.controller('MuralCtrl', function($scope, $timeout, $ionicPopup, $location, $cordovaCamera, $ionicModal) {

	$ionicModal.fromTemplateUrl('templates/mural_details.html', function(modal) {
		$scope.gridModal = modal;
		}, 
		{
			scope: $scope
	});

	$scope.openModal = function(selected) {
		
		$scope.gridModal.show();
	};

	$scope.closeModal = function() {
		$scope.gridModal.hide();
	};
});

MyApp.controller('NewTribyCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $location, $ionicLoading, SettingsService, FeedService, $rootScope, $window) {

	$scope.triby = {
		pic : 'img/add_photo.png',
		name : '',
		members : []
	}

	$scope.uploadPicture = function(){
		$ionicLoading.show({
	      template: 'Uploading...'
	    });
		SettingsService.fileTo($rootScope.urlBackend + '/uploads',"TRIBY").then(function(response){

			if(response.status == "success"){
				$scope.triby.pic = response.url_file;
			}
			else
				window.plugins.toast.showShortCenter("Error uploading picture", function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
			$ionicLoading.hide();
		});
	}

	$scope.nextStep = function(){
		FeedService.setNewTriby($scope.triby);
		//$location.path('app/add_people');
		$window.location.href = "#/app/add_people";
	}
});
MyApp.controller('AddPeopleCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $location, $ionicLoading, SettingsService, FeedService, $rootScope, $window) {

	$scope.contacts = SettingsService.getContactsLocal();

	$scope.createTriby = function(){
		var triby = FeedService.getNewTriby();
		triby.members = [];
		for(var i=0; i < $scope.contacts.length; i++){
			if($scope.contacts[i].checked)
				triby.members.push($scope.contacts[i].username);
		}
		FeedService.saveTriby(triby).then(function(response){
			console.log(JSON.stringify(response));
			if(response.status=="success"){
				window.plugins.toast.showShortCenter("New Triby created successfully", function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
				
				$timeout(function(){
					$window.location.href = "#/app/main/home";
				}, 100);
			}
			else
				window.plugins.toast.showShortCenter(response.message, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
		});
	}
});
MyApp.controller('HomeCtrl', function($scope, $location, $ionicLoading, FeedService, $rootScope,$timeout) {

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
MyApp.controller('InfoCtrl', function($window, $timeout, $scope, $location, $ionicLoading, FeedService, $rootScope, $stateParams, UserService, $ionicPopup) {
	
	$scope.triby = {};
	FeedService.getTriby($stateParams.triby_id).then(function(response){
		$scope.triby = response.data.tribe;
		var members = $scope.triby.members;
		$scope.triby.users = [];
		for(var i=0; i < members.length; i++)
			UserService.getUser(members[i]).then(function(response){
				$scope.triby.users.push(response.data.user)
			});
		FeedService.setNewTriby($scope.triby);
	});
	
	$scope.goBack = function(tribyId){
		$location.path('app/news_feed/' + tribyId);
	}

	$scope.exitTriby = function(tribyId){
		FeedService.exitTriby(tribyId).then(function(response){
			if(response.status === 'success'){
				$timeout(function(){
					$window.location.href = "#/app/main/home";
					$window.location.reload();
				}, 100);
			}
			else
				window.plugins.toast.showShortCenter(response.message, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
		});
	  }
});
MyApp.controller('InfoEditCtrl', function($scope, $location, $ionicLoading, FeedService, $rootScope, $stateParams, SettingsService, $window, $timeout, $route) {

	$scope.triby = {};
	FeedService.getTriby($stateParams.triby_id).then(function(response){
		$scope.triby = response.data.tribe;

	});

	$scope.showDone = "";
	var initializing = true
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
	}

	$scope.saveTribyInfo = function(){

		FeedService.updateTriby($scope.triby).then(function(response){
			if(response.status=="success"){
				$timeout(function(){
					$window.location.href = "#/app/info/" + $scope.triby._id;
					$window.location.reload();
				}, 100);
			}
			else
				window.plugins.toast.showShortCenter(response.message, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
		});
	}

	$scope.goBack = function(){
		$timeout(function(){
			$window.location.href = "#/app/info/" + $scope.triby._id;
			$window.location.reload();
		}, 100);
	}
});
MyApp.controller('AddMembersCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $location, $ionicLoading, SettingsService, FeedService, $rootScope, $window, $route, $state) {

	var contacts = SettingsService.getContactsLocal();
	var triby = FeedService.getNewTriby();
	console.log(JSON.stringify(triby));
	console.log(JSON.stringify(contacts));
	for(var i=0; i < contacts.length; i++){
		console.log(triby.members.indexOf(contacts[i].username));
		if(triby.members.indexOf(contacts[i].username) >= 0)
			contacts[i].checked = true;
		else
			contacts[i].checked = false;
	}
	console.log(JSON.stringify(contacts));
	$scope.contacts = contacts; 

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
});