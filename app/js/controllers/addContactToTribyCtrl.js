'use strict';
MyApp.controller('AddContactToTribyCtrl', function($scope, tribes, $state, FeedService, $ionicLoading) {

    for(var i =0; i < tribes.length; i++){
        tribes[i].checked = tribes[i].members.indexOf($state.params.username) >= 0;
    }
    $scope.tribes = tribes;
    var updateTriby = (function(){
        var i = 0;
        return function(){
            if($scope.tribes[i].checked) {
                $scope.tribes[i].members.push($state.params.username);
                FeedService.updateTriby($scope.tribes[i]).then(function(response){
                    if(response.status=="success"){
                        i++;
                        if(i < $scope.tribes.length){
                            updateTriby()
                        }
                        else{
                            $ionicLoading.hide();
                            $state.go('app.contacts');
                        }
                    }
                    else
                        $ionicLoading.hide();
                    window.plugins.toast.showShortCenter(response.message, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
                });
            }
            else{
                i++;
                if(i < $scope.tribes.length){
                    updateTriby()
                }
                else{
                    $ionicLoading.hide();
                    $state.go('app.contacts');
                }
            }
        }
    })();
    // update triby
    $scope.updateTribes = function(){
        $ionicLoading.show({
            content: '<ion-spinner class="spinner-energized"></ion-spinner>'
        });
        updateTriby();
    };


    // go to triby info page
    $scope.goBack = function(){
        $state.go("app.contacts");
    }
});

