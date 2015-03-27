'use strict';
MyApp.controller('ChatCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $location, $cordovaCamera, $stateParams, SettingsService, $rootScope, FeedService, $window, CommentsService, SideChatService, UserService) {
  console.log("Private ChatCtrl start ...");
  console.log("$stateParams :", $stateParams);

  $scope.userID = $stateParams.user_id;
  $scope.post = {type: 'sidechat'};
  console.log("user id :", $scope.post);

  $scope.sidechat = {
    comments: [],
    user: {name: ''}
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
        $scope.currentUser = data.data.user;
      });
    }
  };
  /////////////////// icon Filter /////////////////////////

  ///////////////////  set Like /////////////////////////
  $scope.setLike = function(comment){
    var like = {
      type: 'sideChatComments',
      id: $scope.sidechat._id,
      comment_id: comment._id
    };
    if($scope.iconFilter(comment.likes)){
      FeedService.removeLike(like).then(function(response){
        console.log("like success :", response.data.post);
        $scope.sideChat();
      }, function(err){
        console.log("like error :", err);
      });
    }
    else{
      FeedService.addLike(like).then(function(response){
        console.log("like success :", response.data.post);
        $scope.sideChat();
      }, function(err){
        console.log("like error :", err);
      });
    }
  };
  ///////////////////  set Like /////////////////////////

  ///////////////////  set Heart /////////////////////////
  $scope.setHeart = function(comment){
    var heart = {
      type: 'sideChatComments',
      id: $scope.sidechat._id,
      comment_id: comment._id
    };
    if($scope.iconFilter(comment.hearts)){
      FeedService.removeHeart(heart).then(function(response){
        console.log("heart success :", response.data.post);
        $scope.sideChat();
      }, function(err){
        console.log("heart error :", err);
      });
    }
    else{
      FeedService.addHeart(heart).then(function(response){
        console.log("heart success :", response.data.post);
        $scope.sideChat();
      }, function(err){
        console.log("heart error :", err);
      });
    }
  };
  ///////////////////  set Heart /////////////////////////

  ///////////////////  set DisLike /////////////////////////
  $scope.setDislike = function(comment){
    var dislike = {
      type: 'sideChatComments',
      id: $stateParams.post_id,
      comment_id: comment._id
    };
    if($scope.iconFilter(comment.dislikes)){
      FeedService.removeDislike(dislike).then(function(response){
        console.log("dislike success :", response.data.post);
        $scope.sideChat();
      }, function(err){
        console.log("dislike error :", err);
      });
    }
    else{
      FeedService.addDislike(dislike).then(function(response){
        console.log("dislike success :", response.data.post);
        $scope.sideChat();
      }, function(err){
        console.log("dislike error :", err);
      });
    }
  };
  ///////////////////  set DisLike /////////////////////////

  /////////////////// add Comment /////////////////////////
  $scope.addComment = function(form){
    //$scope.submitted = true;
    //if(form.$valid){
      //SideChatService.addComment({user : $scope.post.user}).then(function(data){
      CommentsService.addComment($scope.post).then(function(res){
        console.log("sidechat add comment success :", res);
        $scope.post.comment = '';
        $scope.submitted = false;
        $scope.sidechat = res.data.sidechat;
      }, function(err){
        console.log("sidechat add comment error :", err);
      });
    //}
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
        $scope.post.pic = response.url_file;
        CommentsService.addComment($scope.post).then(function(res){
          console.log("sidechat add comment success :", res);
          $scope.post.comment = '';
          $scope.sidechat = res.data.sidechat;
        }, function(err){
          console.log("sidechat add comment error :", err);
        });
      }
      else
        window.plugins.toast.showShortCenter("Error uploading picture", function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
    });
  };


  /////////////////// go Side Chat /////////////////////
  $scope.goSideChat = function(id){
    if(id != $scope.currentUser._id)
    {
      $state.go("app.comments_side",{user_id: id});
    }
  };
  /////////////////// go Side Chat /////////////////////
});
