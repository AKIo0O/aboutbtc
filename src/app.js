





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