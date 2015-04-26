

angular.module("cocos.index").controller('teamController', function($scope, $http, userinfo){


    $scope.users = [];

    userinfo.get({},function(data){
        $scope.user = data;
    });


    $http.get("/teamuser").success(function(data){

        $scope.users = data;
    });

    $scope.invite = function(){

        var user = {};
        user.email1 = $scope.inviteemail;

        $http.post("/email",user, csrfconfig).success(function(data){
            if(data.status == 1){
                alert(data.msg);
                $scope.inviteemail = "";
            }else{
                alert("邀请成功");
            }
        });
    };

});



