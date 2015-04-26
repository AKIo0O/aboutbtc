

angular.module("cocos.index").controller('getstartedController', function($scope, $http){

    var h = location.hash.slice(1);

    $scope.email = localStorage.email;

    $scope.step = h ? h : "1";
    $scope.userinfo = {};

    $scope.emails = ["email1","email2","email3"];
    $scope.addemail = function(){
        $scope.emails.push(Date.now());
    };

    $scope.invite = function(){

        var user = $scope.userinfo;

        $http.post("/email",user, csrfconfig).success(function(data){
            if(data.status == 1){
                alert(data.msg);
            }else{
                alert("邀请成功");
            }
        });

    };


    $scope.submit = function(){
        var user = $scope.userinfo;
        if(!user.username || !user.password) return alert("请填写");
        if(user.password != user.password2) return alert("密码不一致");

        if(user.username.length && (user.password == user.password2) && user.password.length){
            $http.post("/user",{name: user.username,qq: user.qq,phone: user.phone, password: user.password}, 
                csrfconfig).success(function(data){
                $scope.step = "2";
                location.hash = "#2";
            });
        }
    };

    $scope.addteamname = function(){
        var user = $scope.userinfo;


        if(user.teamname.length){
            $http.post("/user",{teamname: user.teamname}, csrfconfig).success(function(data){
                $scope.step = "3";
                location.hash = "#3";
            });
        }else{
            alert("团队名为空");
        }
    };

    $scope.submitall = function(){
        var user = $scope.userinfo;
        if(user.domain.length){
            $http.post("/user?end=1",{domain: user.domain}, csrfconfig).success(function(data){
                $scope.step = "4";
                location.hash = "#4";
            });
        }
    };
});



