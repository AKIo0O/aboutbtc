
var server = require('http').createServer();
var io = require('socket.io').listen(server), markdown = require("markdown").markdown;

io.set('transports', ['websocket','flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);


var sockets = {},
    messages = {},
    users = [];


var k = require("kmodel"), Messages = k.load("SubTicket");

var mq = {};



io.on('connection', function(socket){

    socket.on("connected", function(){


        socket.on("init", function(data){
            socket.disconnected = false;
            sockets[data._id] = socket;
            mq[data._id] = mq[data._id] || [];
            // socket.emit("messages", mq[data._id]);
            console.log(data, "asdasd");
            mq[data._id] = [];
        });

        socket.on("message", function(data){

            var socket = sockets[data.parent];

            data.content = markdown.toHTML(data.content);

            saveMessage(data);

            console.log("message", data);

            socket.emit("message"+data.parent, data);
            socket.broadcast.emit("message"+data.parent, data);
        });

        socket.on("disconnect", function(){
            socket.disconnected = true;
        });
        
        
    });


});

server.listen(8000);



function saveMessage(data){

    data.time = new Date().string();

    var m = new Messages.model(data);

    m.save();
}







