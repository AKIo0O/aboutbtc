

var http = require("http");
var querystring = require('querystring');
var options = {

    method: "POST",
    port: 80

};


module.exports = function(host, path, data){


    var headers, req;

    options.host = host;
    options.path = path;
    userString = querystring.stringify(data);

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(userString)
    };

    options.headers = headers;
    return "http://"+host+path+"?"+userString;

    // http.get("http://"+host+path+"?"+userString, function(res){
    //     res.setEncoding('utf-8');

    //     var responseString = '';

    //     res.on('data', function(chunk) {
    //         responseString += chunk;
    //     });

    //     res.on('end', function() {
    //         done(null, responseString);
    //     });

    // })

    // return function(done){
        // console.log(userString)
        // req = http.request(options, function(res) {

        //     res.setEncoding('utf-8');

        //     var responseString = '';

        //     res.on('data', function(chunk) {
        //         responseString += chunk;
        //     });

        //     res.on('end', function() {
        //         done(null, responseString);
        //     });

        // });

        // req.write(userString+"\n");

        // req.end();

    // };

};




