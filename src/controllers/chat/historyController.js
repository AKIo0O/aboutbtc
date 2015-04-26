


angular.module("cocos.index").controller('chatHistory', function($scope, $http, $route, userinfo, socket){

    var currentid = $route.current.params.id, cache = {}, loading;

    var template = document.querySelector("#template").value, 
        content  = document.querySelector(".content"),
        subtickets = document.querySelector(".subtickets");

    userinfo.get({}, function(data){
        $scope.userinfo = data;
    });

     $scope.help = function(tid){

        if(window.confirm("确认请求官方的支持？")){
            $http.post("/offical", {id: tid}, csrfconfig).success(function(data){

                if(data.status){
                    alert(data.msg);
                }else{
                    alert("处理成功");
                    $scope.ticket.offical = "offical";
                }
            });
        }
    };

    function loading(){

        $http.get("/ticket/data/"+currentid).success(function(data){
            
            socket.emit("init", {_id: currentid});
            listener(currentid);

            $scope.ticket = data.tickets;
            // $scope.subtickets = data.subtickets;
            subtickets.innerHTML = "";
            data.subtickets.map(render);
            
            setTimeout(reset, 200);
        });
    };

    $scope.submit = function($event){

        var text, sub = {};

        if($event.keyCode == "13" && $scope.inputtext.length && $event.shiftKey == false){

            text = $scope.inputtext;
            $scope.inputtext = "";

            sub.parent = currentid;
            sub.content = text;
            sub.author = $scope.userinfo.name;
            sub.userid = $scope.userinfo._id;
            console.log(sub);
            socket.emit("message", sub);
        }
    };

    $scope.filter = function($event){

        var items, file, reader;

        items = $event.clipboardData.items;

        if( !(items[0] && items[0].type == "image/png") ) return true;

        file = items[0].getAsFile();
        reader = new FileReader();
        
        reader.onload = function(e) {
            
            $http.post("/uploadfile",{base64:e.target.result}, csrfconfig).success(function(data){

                var sub = {};

                sub.parent = currentid;
                sub.content = "![图片](/upload/"+data.id+")";
                sub.author = $scope.userinfo.name;
                sub.userid = $scope.userinfo._id;
                socket.emit("message", sub);

            });
        };
        reader.readAsDataURL(file);

    };

    var cache = {};

    function listener(id){
        if(cache[id]) return;
        socket.on("message"+id, render);
        cache[id] = true;
    }


    function render(data){

        var dom = template.slice(0);
        dom = dom.replace("#{content}", data.content);
        dom = dom.replace("#{author}", data.author);
        dom = dom.replace("#{time}", data.time);
        dom = dom.replace("#{_id}", data.userid);
        if(data.teamname == "2361bdf7c55e26ed9d322476dd0563637f3a401d"){
            dom.replace("#{offical}", "offical");
        }else{
            dom.replace("#{offical}", "");
        }
         
        subtickets.insertAdjacentHTML("beforeend", dom);
        setTimeout(reset, 200);
    }

    function reset(){
        content.scrollTop =  30+ content.scrollHeight - content.clientHeight;
    }


    
    loading();

    userinfo.get({}, function(data){
        $scope.userinfo = data;
    });
});




