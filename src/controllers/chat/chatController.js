


angular.module("cocos.index").controller('chatController', function($scope, $http, $route, userinfo){

    $scope.newticket = false;

    var index = 0;

    var currentid = $route.current && $route.current.params.id;

    userinfo.get({}, function(data){
        $scope.userinfo = data;
    });

    $scope.showdialog = function(){
        $scope.newticket = true;
    };

   

    $scope.select = function(url){

        if(url == "/chat/logout"){
            $http.get("/logout").success(function(){
                location.href="/";
            });

            return;
        }
        if(url == "/chat/qa"){
            location.href="/qa.html";
            return;
        }
        if(url == "/chat/pricing"){
            location.href="/pricing.html";
            return;
        }


        if(index) $scope.tickets[index].current = false;
        history.pushState({},"",url);
    };

    $scope.loading = function(xindex, tid){
        $scope.tickets[index].current = false;
        $scope.tickets[xindex].current = true;
        index = xindex;
        history.pushState({},"","/chat/room/"+tid);
    };  

    userinfo.get({},function(data){
        $scope.userinfo = data;
    });
    var types = {
        "2dx" : "Cocos2d x",
        "2djs" : "Cocos2d JS",
        "2dlua" : "Cocos2d lua",
        "2dstudio" : "Cocos2d Studio",
        "2dcode" : "Cocos2d Code IDE",
        "anysdk" : "AnySDK",
        "other": "其他"
    }; 

    $scope.selects = {
        type: "select",
        data: types,
        show: false,
        selected: types['2dx'],
        select: function(p){
            this.selected = types[p];
            this.show = false;
        }
    };


    $scope.closedialog = function(){
        $scope.newticket = false;
    };

    $scope.ticketform = {
        ticket: "team"
    };

    $scope.postticket = function(){
        
        var data = $scope.ticketform;

        data.type = $scope.selects.selected;

        if(data.title.length == 0){
            return alert("请添加标题");
        }
        if(data.content.length == 0){
            return alert("请添加内容");
        }
        $http.post("/ticket", data, csrfconfig).success(function(data){
            buffer();
            $scope.newticket = false;
            currentid = data[0]._id;

            $scope.loading(index, data[0]._id);
        });
    };

    function buffer(){
        index = 0;

        $http.get("/tickets/").success(function(data){
            $scope.tickets = data;
            data.map(function(item, i){
                if(item._id == currentid) index = i;
            });
            $scope.tickets[index].current = true;
        });
    }

    buffer();

});




