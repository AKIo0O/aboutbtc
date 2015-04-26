



cocos.factory('userinfo',function($resource){

    return $resource('/user');
});

cocos.factory('socket',function($resource){

    var socket = io.connect("http://www.aboutbtc.me:8900",{transports: ['websocket']});

    socket.emit("connected");
    return socket;
});


// lottery.factory('carmodels',function($resource){

//     return $resource('/api/carmodels?_=1417420788140');
// });


