

angular.module("cocos.index").controller('indexpageController', function($scope, $http){


    $scope.register = true;
    $scope.email =  "";
    $scope.submit = function(){

        var data = {};
        data.email = $scope.email;
        data.company = $scope.company;

        $http.post("/signup", data, csrfconfig).success(function(data){

            if(data.status == 1){
                return alert(data.msg);
            }
            UserCenter.userinfo = data;
            localStorage.email = $scope.email;
            $scope.register = false;
        });
    };



});



