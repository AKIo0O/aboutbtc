

angular.module("cocos.index").controller('introController', function($scope, $http){



    var swiper = new Swiper('.swiper-container');

    
    $scope.signin = function(){

        $http.post("/signin", {email: $scope.email, password: $scope.password}, csrfconfig)
        .success(function(data){
            if(data.status){
                alert(data.msg);
            }else{
                location.href="/allticket";
            }
        });

    };


});



