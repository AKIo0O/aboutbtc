



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


