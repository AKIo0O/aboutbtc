

angular.module("cocos.index").controller('ticketsController', function($scope, $http, $route){

    
    $http.get("/tickets/").success(function(data){

        $scope.tickets = data;

    });
    

    $scope.type = {
        "2dx" : "Cocos2d x",
        "2djs" : "Cocos2d JS",
        "2dlua" : "Cocos2d lua",
        "2dstudio" : "Cocos2d Studio",
        "2dcode" : "Cocos2d Code IDE",
        "anysdk" : "AnySDK",
        "other": "其他"
    }; 

    var ctype = "all";

    $scope[ctype] = "current";

    $scope.tab = function(type){

        $scope[ctype] = "";
        $scope[type] = "current";
        ctype = type;
    };


    function update(){




    }



});



