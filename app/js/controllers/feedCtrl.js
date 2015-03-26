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
MyApp.controller('FeedCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $location, $cordovaCamera, $stateParams, SettingsService, $rootScope, FeedService, $window, $state, UserService) {
  console.log("FeedCtrl start ...");
	$scope.title = '<a href="#/app/info/' + $stateParams.triby_id + '" >BFFs</a>';
  //$scope.title = '<a ui-sref="app.info({triby_id:})" href="#/app/info/' + $stateParams.triby_id + '">BFFs</a>';

  $scope.posts = [];
	$scope.post = {
		message: "",
		image: "",
		triby: $stateParams.triby_id
	};

  $scope.goSideChat = function(id){
    if(id == $scope.currentUser._id)
    {
      alert("Post owner side-chat bar is in progress")
    }else{
      $state.go("app.comments_side",{user_id: id});
    }
  };
  /////////////////// get Current User /////////////////////
  UserService.getUser().then(function(data){
    console.log("get user .... :", data);
    $scope.currentUser = data.data.user;
  });
  /////////////////// get Current User /////////////////////

  /////////////////// icon Filter /////////////////////////
  $scope.iconFilter = function(array){
    if($scope.currentUser){
      for(var i = 0; i < array.length; i++)
      {
        if(array[i] == $scope.currentUser._id){
          console.log('matching user id :', array[i] == $scope.currentUser._id);
          return true;
        }
      }
      return false;
    }
    else{
      UserService.getUser().then(function(data){
        console.log("get user .... :", data);
        //$scope.currentUser = data.data.user;
        //$scope.iconFilter(array)
      });
    }
  };
  /////////////////// icon Filter /////////////////////////

  /////////////////// get All Currrnt Triby Post /////////////////////////
  $scope.getAllPostInCtrl = function(){
    FeedService.getTribyPosts($stateParams.triby_id).then(function(response){
      console.log("get All Currrnt Triby Post :", response.data.posts);
      $scope.getAllPost = response.data.posts;
    });
  };
  /////////////////// get All Currrnt Triby Post /////////////////////////

  $scope.getAllPostInCtrl();

  ///////////////////  set Like /////////////////////////
  $scope.setLike = function(post){
    var like = {
      type: 'post',
      id: post._id
    };
    if($scope.iconFilter(post.likes)){
      FeedService.removeLike(like).then(function(response){
        console.log("like success :", response.data.post);
        $scope.getAllPostInCtrl();
      }, function(err){
        console.log("like error :", err);
      });
    }
    else{
      FeedService.addLike(like).then(function(response){
        console.log("like success :", response.data.post);
        $scope.getAllPostInCtrl();
      }, function(err){
        console.log("like error :", err);
      });
    }
  };
  ///////////////////  set Like /////////////////////////

  ///////////////////  set Heart /////////////////////////
  $scope.setHeart = function(post){
    var heart = {
      type: 'post',
      id: post._id
    };
    if($scope.iconFilter(post.hearts)){
      FeedService.removeHeart(heart).then(function(response){
        console.log("heart success :", response.data.post);
        $scope.getAllPostInCtrl();
      }, function(err){
        console.log("heart error :", err);
      });
    }
    else{
      FeedService.addHeart(heart).then(function(response){
        console.log("heart success :", response.data.post);
        $scope.getAllPostInCtrl();
      }, function(err){
        console.log("heart error :", err);
      });
    }
  };
  ///////////////////  set Heart /////////////////////////

  ///////////////////  set DisLike /////////////////////////
  $scope.setDislike = function(post){
    var dislike = {
      type: 'post',
      id: post._id
    };
    if($scope.iconFilter(post.dislikes)){
      FeedService.removeDislike(dislike).then(function(response){
        console.log("dislike success :", response.data.post);
        $scope.getAllPostInCtrl();
      }, function(err){
        console.log("dislike error :", err);
      });
    }
    else{
      FeedService.addDislike(dislike).then(function(response){
        console.log("dislike success :", response.data.post);
        $scope.getAllPostInCtrl();
      }, function(err){
        console.log("dislike error :", err);
      });
    }
  };
  ///////////////////  set DisLike /////////////////////////

  /////////////////// send Post /////////////////////////
	$scope.sendPost = function(){
		FeedService.savePost($scope.post).then(function(response){
			console.log("$scope.sendPost :", response.tribe);
      $scope.getAllPostInCtrl();
      $scope.post.message = "";

		});
	};
  /////////////////// send Post /////////////////////////

  /////////////////// upload Picture /////////////////////////
	$scope.uploadPicture = function(source){

		SettingsService.fileTo($rootScope.urlBackend + '/uploads',"POST",source).then(function(response){

			if(response.status == "success"){
				$scope.post.image = response.url_file;
				FeedService.savePost($scope.post).then(function(response){
					console.log("News-feed uploadPicture :", response);
          $scope.getAllPostInCtrl();
          $scope.post.message = "";
				});
			}
			else
				window.plugins.toast.showShortCenter("Error uploading picture", function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
		});
	};
  /////////////////// upload Picture /////////////////////////

	$scope.goMural = function(){
		$window.location.href = "#/app/mural/" + $stateParams.triby_id;
	}

});
MyApp.controller('CommentsCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $location, $cordovaCamera, $stateParams, SettingsService, $rootScope, CommentsService, FeedService, $window, $state) {

  $scope.post = {type: 'post', id: $stateParams.post_id};
  $scope.triby = {
    id: $stateParams.post_id
  };

  /////////////////// add Comment /////////////////////////
  $scope.addComment = function(form){
    $scope.submitted = true;
    if(form.$valid){
      CommentsService.addComment($scope.post).then(function(data){
        console.log("comment success :", data);
        $scope.post.comment = '';
        $scope.submitted = false;
        $scope.comments = data.data.post.comments;
      }, function(err){
        console.log("comment error :", err);
      });    }
  };
  /////////////////// add Comment /////////////////////////

  /////////////////// get Comment /////////////////////////
  $scope.getComments = function(){
    FeedService.getPosts($stateParams.post_id).then(function(data){
        console.log("comment success :", data);
        $scope.comments = data.data.post.comments;
      }, function(err){
        console.log("comment error :", err);
      });
  };
  /////////////////// get Comment /////////////////////////

  /////////////////// upload Picture /////////////////////////
  $scope.uploadPicture = function(source){

    SettingsService.fileTo($rootScope.urlBackend + '/uploads',"POST",source).then(function(response){

      if(response.status == "success"){
        $scope.post.image = response.url_file;
        FeedService.savePost($scope.post).then(function(response){
          console.log("comment area post from album or camera", response);
        });
      }
      else
        window.plugins.toast.showShortCenter("Error uploading picture", function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
    });
  }
  /////////////////// upload Picture /////////////////////////

});
MyApp.controller('ChatCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $location, $cordovaCamera, $stateParams, SettingsService, $rootScope, FeedService, $window, CommentsService, SideChatService) {
  console.log("Private ChatCtrl start ...");
  console.log("$stateParams :", $stateParams);

  $scope.userID = $stateParams.user_id;
  $scope.post = {type: 'sidechat'};
  console.log("user id :", $scope.post);

  //$scope.privateChat = {
  //  owner : { },
  //  user: { },
  //  date: '22-03-2015 @ 4:35:50 AM',
  //  comments: [
  //    {
  //      comment: 'this is a comment in private Chat',
  //      user: {
  //        name: "Haider alee",
  //        pic: "img/default_avatar.jpg"
  //      } ,
  //      time:Date
  //    },
  //    {
  //      comment: 'this is a comment in private Chat 2',
  //      user: {
  //        name: "Sumair khanzada",
  //        pic: "img/default_avatar.jpg"
  //      } ,
  //      "time":Date
  //    },
  //    {
  //      comment: 'this is a comment in private Chat 3',
  //      user: {
  //        name: "Haider alee",
  //        pic: "img/default_avatar.jpg"
  //      } ,
  //      time:Date
  //    },
  //    {
  //      comment: 'this is a comment in private Chat 4',
  //      user: {
  //        name: "Sumair khanzada",
  //        pic: "img/default_avatar.jpg"
  //      } ,
  //      time:Date
  //    }
  //  ]
  //};

  $scope.sidechat = {
    comments: []
  };


  /////////////////// add Comment /////////////////////////
  $scope.addComment = function(form){
    $scope.submitted = true;
    if(form.$valid){
      //SideChatService.addComment({user : $scope.post.user}).then(function(data){
      CommentsService.addComment($scope.post).then(function(res){
        console.log("sidechat add comment success :", res);
        $scope.post.comment = '';
        $scope.submitted = false;
        $scope.sidechat = res.data.sidechat;
      }, function(err){
        console.log("sidechat add comment error :", err);
      });    }
  };
  /////////////////// add Comment /////////////////////////

  /////////////////// get Comment /////////////////////////
  $scope.sideChat = function(){
    //SideChatService.addComment({user : $scope.post.user}).then(function(data){
    SideChatService.sideChat({user : $scope.userID}).then(function(res){
      console.log("sideChat success :", res);
      $scope.sidechat = res.data.sidechat;
      $scope.post.id = res.data.sidechat._id;
      //$scope.comments = data.data.post.comments;
    }, function(err){
      console.log("sideChat error :", err);
    });
  };
  /////////////////// get Comment /////////////////////////

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
	};

	$scope.nextStep = function(){
		FeedService.setNewTriby($scope.triby);
		//$location.path('app/add_people');
		$window.location.href = "#/app/add_people";
	}
});
MyApp.controller('AddPeopleCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $location, $ionicLoading, SettingsService, FeedService, $rootScope, $window) {

	SettingsService.getContactsLocal().then(function(response){
		$scope.contacts = response;
	});

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
			$window.location.href = "#/app/news_feed/" + $scope.triby._id;
		}, 100);
	}
});
MyApp.controller('AddMembersCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $location, $ionicLoading, SettingsService, FeedService, $rootScope, $window, $route, $state) {

	var triby;
	var contacts = [];
	SettingsService.getContactsLocal().then(function(response){
		console.log(response);
		contacts = response;
		//console.log(JSON.stringify(triby));
		triby = FeedService.getNewTriby();
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
	});

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
