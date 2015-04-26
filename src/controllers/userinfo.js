


angular.module("cocos.index").controller('userinfo', function($scope, $http,$location){

    var UserCenter = {};
    UserCenter.callbacks = {};
    $scope.home = "/";
    $scope.sign_status = "no";
    UserCenter.process = function(key, func){
            
        var userinfo = this.userinfo;

        if(userinfo){
            func(userinfo);
        }else{
            this.callbacks[key] = func;
        }
    };
    UserCenter.loaded = function(){
        var key ;
        for(key in this.callbacks){
            this.callbacks[key](this.userinfo);
        }
    };


    $scope.usershow = false;

    $scope.logout = function(){
        $http.get("/logout").success(function(data){
            location.href="/";
            localStorage.email = "";
        });
    };

    function checkstatus(){

        var index = 0;
        $http.get("/user").success(function(data){
            
            if(!data || data.active == "0"){
                if(location.pathname != "/" && location.pathname != "/register") location.href="/";
            }else if(data.active == "1"){
                if(location.pathname != "/getstarted") location.href="/getstarted#1";
            // }else if(data.active == "2"){
            //     if(location.pathname != "/pay") location.href="/pay";
                
            }else{
                index = data.email.indexOf("@");
                // data.name = data.email.slice(0,index);
                $scope.userinfo = data;
                $scope.home = "/allticket";
                $scope.sign_status = "yes";
                UserCenter.userinfo = data;
                UserCenter.loaded();
            }
        });
    }

    checkstatus();
    setInterval(checkstatus, 10000);


    if(location.pathname == "/team") $scope.team = "current";
    if(location.pathname == "/tickets") $scope.tickets = "current";
    

    window.UserCenter = UserCenter;

});



