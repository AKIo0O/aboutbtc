


var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var config = require("../config.js");


var transporter = nodemailer.createTransport(smtpTransport(config.mailconfig));


module.exports = function(to, title, content){
    
    return function(done){
        transporter.sendMail({
            from: 'support@uuzcloud.com',
            to: to,
            subject: title,
            html: content
        }, function(err, info){
            var data = err ? {status: 0}: {status: 1};
            console.log(err);
            done(null,data);
        });
    }

};
