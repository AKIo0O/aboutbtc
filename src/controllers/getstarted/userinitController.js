

angular.module("cocos.index").controller('userinitController', function($scope, $http){

    var h = location.hash.slice(1);

    $scope.email = localStorage.email;

    $scope.step = h ? h : "1";
    $scope.userinfo = {};

    $scope.submit = function(){
        var user = $scope.userinfo;
        if(!user.username || !user.password) return alert("请填写");
        if(user.password != user.password2) return alert("密码不一致");

        if(user.username.length && (user.password == user.password2) && user.password.length){
            $http.post("/user",{name: user.username, password: user.password}, csrfconfig)
            .success(function(data){
                $scope.step = "2";
                location.href = "/allticket";
            });
        }
    };

});



