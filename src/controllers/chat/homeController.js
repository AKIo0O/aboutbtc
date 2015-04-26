

angular.module("cocos.index").controller('homeController', function($scope, $http, userinfo){


    var input = document.querySelector("#uploadfile");

    userinfo.get({},function(data){
        $scope.user = data;
    });
    input.onchange = function(){

        console.log("asdasd");
        
    };


    $scope.post = function(){


        var file = input.files[0];

        if(file) uploadHead(file);
        else{
            $http.post("/user",{name: $scope.user.name}, csrfconfig).success(function(data){
                alert("保存成功");
                location.reload();
            });
        }
    };
    
    function uploadHead(file){

        var reader  = new FileReader();
        
        var previewfile = document.querySelector(".previewfile");
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");

        reader.onloadend = function () {
            var base64 = reader.result;

            $http.post("/uploadfile", {base64: base64, name: $scope.user._id},csrfconfig).success(function(data){
                $http.post("/user",{name: $scope.user.name}, csrfconfig).success(function(data){
                    alert("保存成功");
                    location.reload();
                });
            });

        }

        reader.readAsDataURL(file);
    }

});



