// Source: src/app.js






var cocos = angular.module('cocos',[

    'ngResource',
    'ngRoute',
    // '',
    'cocos.index',
    'progress',
    'navlist'

]);




angular.module('navlist', []).service("navlist", function(){

    function current(){
        var pathname = location.pathname;
        var classname = "";
        classname = pathname == "/allticket" ?  "allticket" : classname;
        classname = pathname == "/team" ? "team" : classname;

        return classname;
    }

    function reset(){
        var nlist = [].slice.call(document.querySelectorAll(".menu"),0);
        nlist.map(function(x, y){
            x.classList.remove("current");
        });
    }

    return function(){
        var classname = current();
        reset();
        if(classname)
            document.querySelector(".menu."+classname).classList.add("current");
    };
});

angular.module('progress', []).service("ngProgress", function(){

    var el = document.getElementById("progress"), 
        w = window.innerWidth, start = 0, state = "uncomplete",
        time = 100;

    var run = function(){

        start += 25;

        if(state == "uncomplete"){
            time++;
        }

        if(state == "completed"){
            time =1;
        }
        
        el.style.width = start + "px";
        if(start < w) setTimeout(run, 10);
        else{
            el.style.width = "0px";
            start = 0;
            time = 100;
            state = "uncomplete"
        }
    };

    return {
        start: function(){
            state = "uncomplete";
            run();
        },
        complete: function(){
            state = "completed";
        }
    };
});

angular.module('cocos.index', []);
// Source: src/controllers/allticket.js


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




// Source: src/controllers/index.js


angular.module("cocos.index").controller('indexRouteController', function($scope, $http){



    $scope.dialog = false;
    $scope.type = "normal";

    $scope.showdialog = function(){

        $scope.dialog = true;
        // $http.get("/mpay?type="+$scope.type).success(function(data){
        // });
    };



    


});




// Source: src/controllers/indexpage.js


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




// Source: src/controllers/introController.js


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




// Source: src/controllers/newticketController.js


angular.module("cocos.index").controller('newticketController', function($scope, $http){


    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        mode:"javascript"
    });
    // editor.setOption("theme", "monokai");
    console.log(editor)
    $scope.selectx = "2dx";
    $scope.select = function(item){

        $scope.selected[$scope.selectx] = "";
        $scope.selectx = item;
        $scope.selected[item] = "selected";
    };

    $scope.selected = {
        "2dx": "selected",
        "2djs": "",
        "2dlua": "",
        "2dstudio": "",
        "2dcode": "",
        "anysdk": "",
        "other": ""
    };

    $scope.ticket = "offical";

    $scope.newticket = function(){
        var data = {};

        data.title = $scope.xtitle;
        data.content = editor.getValue();
        data.type = $scope.selectx;
        data.ticket = $scope.ticket;

        if(data.title.length == 0){
            return alert("请添加标题");
        }

        $http.post("/ticket", data, csrfconfig).success(function(data){
            location.href="/chat#"+data[0]._id;
        });
    };


});







// Source: src/controllers/ticket.js


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




// Source: src/controllers/userinfo.js



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




// Source: src/controllers/chat/chatController.js



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





// Source: src/controllers/chat/historyController.js



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





// Source: src/controllers/chat/homeController.js


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




// Source: src/controllers/chat/teamController.js


angular.module("cocos.index").controller('teamController', function($scope, $http, userinfo){


    $scope.users = [];

    userinfo.get({},function(data){
        $scope.user = data;
    });


    $http.get("/teamuser").success(function(data){

        $scope.users = data;
    });

    $scope.invite = function(){

        var user = {};
        user.email1 = $scope.inviteemail;

        $http.post("/email",user, csrfconfig).success(function(data){
            if(data.status == 1){
                alert(data.msg);
                $scope.inviteemail = "";
            }else{
                alert("邀请成功");
            }
        });
    };

});




// Source: src/controllers/getstarted/getstartedController.js


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




// Source: src/controllers/getstarted/userinitController.js


angular.module("cocos.index").controller('userinitController', function($scope, $http){

    var h = location.hash.slice(1);

    $scope.email = localStorage.email;

    $scope.step = h ? h : "1";
    $scope.userinfo = {};

    $scope.submit = function(){
        var user = $scope.userinfo;
        if(!user.username || !user.password) return alert("请填写");
        if(user.password != user.password2) return alert("密码不一致");

        if(user.username.length && (user.password == user.password2) && user.password.length){
            $http.post("/user",{name: user.username, password: user.password}, csrfconfig)
            .success(function(data){
                $scope.step = "2";
                location.href = "/allticket";
            });
        }
    };

});




// Source: src/services/block.js




cocos.factory('userinfo',function($resource){

    return $resource('/user');
});

cocos.factory('socket',function($resource){

    var socket = io.connect("http://"+location.hostname+":8000",{transports: ['websocket', 'polling', 'flashsocket']});

    socket.emit("connected");
    return socket;
});


// lottery.factory('carmodels',function($resource){

//     return $resource('/api/carmodels?_=1417420788140');
// });



// Source: src/init.js
var isBind = {};

var bind = function(key, callback){

    if(isBind[key]) return;

    Object.defineProperty(window, key, {
        set: function(value){
            callback(value);
            return value;
        }
    });

    isBind[key] = true;
};
var csrfconfig = {headers:{"X-Csrf-Token": document.getElementById("token").value}};

// Source: src/config.js

/* Controllers */
// var cocos = angular.module('cocos', ["ngClipboard"]);

cocos.config(function($routeProvider){
    
    $routeProvider.

        when('/chat/room/:id', {
            templateUrl: '/templates/chat/chathistory.html',
            title: 'Cocos企业会员'
        }).

        when('/chat/home', {
            templateUrl: '/templates/chat/home.html',
            title: 'Cocos企业会员'
        }).

        when('/chat/team', {
            templateUrl: '/templates/chat/team.html',
            title: 'Cocos企业会员'
        }).

        when('/chat/qa', {
            templateUrl: '/templates/chat/qa.html',
            title: 'Cocos企业会员'
        }).

        // when('/chat/', {
        //     templateUrl: '/templates/chat/.html',
        //     title: 'Cocos企业会员'
        // }).

        when('/register', {
            templateUrl: '/templates/register.html',
            title: 'Cocos企业会员'
        }).
        

        when('/', {
            templateUrl: '/templates/intro.html',
            title: 'Cocos企业会员介绍'
        }).
        when('/pay', {
            templateUrl: '/templates/pay.html',
            title: 'Cocos企业会员'
        }).
        when('/getstarted', {
            templateUrl: '/templates/getstarted/userinfo.html',
            title: 'Cocos企业会员'
        }).
        when('/inituser', {
            templateUrl: '/templates/getstarted/teaminfo.html',
            title: 'Cocos企业会员'
        }).
        when('/allticket', {
            templateUrl: '/templates/tickets.html',
            title: '会员中心'
        }).
        when('/new', {
            templateUrl: '/templates/newticket.html',
            title: '新建工单'
        }).
        when('/ticket/:id', {
            templateUrl: '/templates/ticket.html',
            title: '工单'
        }).
        when('/team', {
            templateUrl: '/templates/team.html',
            title: '工单'
        })
        
});



cocos.config(function($locationProvider) {
        
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    })
    .run(function($rootScope, $route, $location, $routeParams,ngProgress,navlist) {
        
        // gettextCatalog.currentLanguage = defaultLanguage;
        // amMoment.changeLocale(defaultLanguage);
        $rootScope.$on('$routeChangeStart', function() {
            
            ngProgress.start();
            // console.log($progress)
            // if(window.userinfos == undefined) location.href="/step00";
        });

        $rootScope.$on('$routeChangeSuccess', function() {
            
            navlist();
            ngProgress.complete();

            // Change page title, based on Route information
            $rootScope.titleDetail = '';
            $rootScope.title = $route.current.title;
            $rootScope.isCollapsed = true;
            $rootScope.currentAddr = null;
            // $location.hash($routeParams.scrollTo);
            // $anchorScroll();
            
        });
    });

// Source: src/directives.js


cocos.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.href === '' || attrs.href === '#' || attrs.href=="logout"){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
   };
});


// Source: src/filters.js
