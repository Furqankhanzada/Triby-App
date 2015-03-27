'use strict';
MyApp.controller('FeedCtrl', function($scope, $ionicSideMenuDelegate, $ionicModal, $timeout, $ionicPopup, $location, $cordovaCamera, $stateParams, SettingsService, $rootScope, FeedService, $window, $state, UserService) {
  console.log("FeedCtrl start ...");
	$scope.title = '<a href="#/app/info/' + $stateParams.triby_id + '" >BFFs</a>';
  //$scope.title = '<a ui-sref="app.info({triby_id:})" href="#/app/info/' + $stateParams.triby_id + '">BFFs</a>';

  $scope.posts = [];
	$scope.post = {
		message: "",
		image: "",
		triby: $stateParams.triby_id
	};

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  /////////////////// go Side Chat /////////////////////
  $scope.goSideChat = function(id){
    if(id != $scope.currentUser._id)
    {
      $state.go("app.comments_side",{user_id: id});
    }
  };
  /////////////////// go Side Chat /////////////////////

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

		SettingsService.fileTo($rootScope.urlBackend + '/uploads', "POST", source).then(function(response){

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
