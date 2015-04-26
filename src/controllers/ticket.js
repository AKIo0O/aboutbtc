

angular.module("cocos.index").controller('ticketController', function($scope, $http, $route){

    var tid = $route.current.params.id;
    
    $http.get("/ticket/data/"+tid).success(function(data){

        $scope.ticket = data.tickets;
        $scope.subtickets = data.subtickets;
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
    


    UserCenter.process("xticket",function(user){
        $scope.user = user;
    });


    $scope.submitticket = function(){

        var content = $scope.textarea;
        var image = $scope.image;

        $http.post("/subticket", {content: content, image: image, parent: tid}, csrfconfig)
             .success(function(data){
                console.log(data);
             });


    };
    $scope.tips = "上传图片（可选）";
    // $scope.reader = reader;

    document.querySelector(".imagefile").onchange = reader;


    function reader(){
        var reader  = new FileReader();
        var file = this.files[0];

        reader.onloadend = function () {
            var base64 = reader.result;
            $http.post("/uploadfile", {base64: base64}, csrfconfig).success(function(data){
                $scope.tips = "图片已选择："+data.id;
                $scope.image = data.id;
            }).error(function(){
                alert("图片太大");
            });
        };

        reader.readAsDataURL(file);
    }
});



