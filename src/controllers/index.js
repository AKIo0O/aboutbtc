

angular.module("cocos.index").controller('indexRouteController', function($scope, $http){



    $scope.dialog = false;
    $scope.type = "normal";

    $scope.showdialog = function(){

        $scope.dialog = true;
        // $http.get("/mpay?type="+$scope.type).success(function(data){
        // });
    };



    


});



