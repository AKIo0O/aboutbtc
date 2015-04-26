

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






