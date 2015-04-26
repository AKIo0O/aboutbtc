
var Router = require('koa-router'),
    k      = require("kmodel"), fs = require("fs");

var index = new Router();
var config = require("./config.js");
var User = k.load("User"), sendmail = require("./sendmail");

var Ticket = k.load("Ticket"), Team = k.load("Team");

index.get("/ticket/data/:id", function*(){

    var id = this.params.id, tickets,subtickets;

    subtickets = yield SubTicket.find({parent: id});
    tickets    = yield Ticket.queryOne({_id: id});
    
    this.body = {tickets: tickets, subtickets: subtickets};
});


var  Order = k.load("Order");

index.get("/mpay", function*(){

    var money, name, data, order;

    if( !this.session.user) return this.body = {status:1, msg: "未登录"};

    money = this.query.type == "normal" ? 20000: 100000;
    name  = this.session.user.company;
    data  = alipay.pay(name, money);

    data.order.userid = this.session.user._id;

    order = yield Order.insertOne(data.order);

    this.redirect(data.url);
});


index.get("/tickets/", function*(){
    
    var user = this.session.user, ticket = yield Ticket.find({teamname: user.teamname}),
        offical;

    if(user.teamname == "2361bdf7c55e26ed9d322476dd0563637f3a401d"){

        offical = yield Ticket.find({offical: "offical"});

        this.body = offical;
    }else{
        this.body = ticket;
    }
});

index.get("/teamuser", function*(){
    
    var user = this.session.user;
    
    this.body = yield User.find({teamname: user.teamname});
});

index.post("/ticket", function*(){


    var body = this.request.body, user = this.session.user;

    body.time = new Date().string();
    body.author = user.name;
    body.domain = user.domain;
    body.userid = user._id;
    body.teamname = user.teamname;

    this.body = yield Ticket.insertOne(body);
});


var SubTicket = k.load("SubTicket");

index.post("/offical", function*(){

    var user = this.session.user, teamname, tid = this.request.body.id, t;

    if(user){

        teamname = user.teamname;
        t = yield Ticket.queryOne({teamname: teamname, _id: tid});

        if(t){

            yield Ticket.updateOne({offical: "offical"}, {_id: tid} );
            this.body = {status: 0};
        }else{
            this.body = {status: 1, msg: "无此单操作权限"};
        }
    }else{
        this.body = {status: 1, msg: "未登录"};
    }
    
});

index.post("/subticket", function*(){


    var body = this.request.body, user = this.session.user;

    body.time = new Date().string();
    body.author = user.name;
    body.userid = user._id;

    this.body = yield SubTicket.insertOne(body);
});

index.post("/user/login", function*(){

    var body = this.request.body;

    var password = crypt(body.password);

    var user = yield User.queryOne({email: body.email, password: password});
    console.log(user)
    if(user){
        if(user.active == "0"){
            this.body = {status: 1, msg: "账号未激活"};
        // }else if(user.active == "1" ){
            // this.body = {status: 0, path: user.username ? "/inituser" : "/getstarted#1"};
        }else if(user.active == "1"){
            user.password = "";
            this.session.user = user;
            this.body = {status: 0};
        }
    }else{
        this.body = {status: 1, msg: "账号或密码错误"};
    }

});

index.post("/user/sign_up", function *(next){

    var body = this.request.body, me = this;

    if(body.email.length == 0 ||
        body.password.length == 0 ||
        body.name.length == 0){
        this.body = {status:1, msg: "表单不完全"};
    }

    var str = generate();
    var user = yield User.find({email: body.email});

    if( false && user.length){
        this.body = {status:1, msg: "已经注册"};
    }else{
        body.active = "0";
        body.teamname = "aboutbtc";
        body.activestr = String(str);
        body.password = crypt(body.password);
        body.type = "admin";
        user = yield User.insertOne(body);
        me.session.user = user[0] || user;

        var data = yield sendmail(body.email, "欢迎注册About BTC", config.active(String(str)));

        if(data.status == 0){
            me.body = {status:1, msg: "邮件发送失败"};
        }else{
            me.body = {status:0};
        }
    }

});

index.post("/email", function *(){

    var u = this.request.body;

    var user = this.session.user;
    var email = u.email1;


    if(!user) return this.body = {status:1, msg: "未登录"};

    var u = {};
    u.email = email;
    u.teamname = "aboutbtc";
    u.domain = user.domain;
    u.company = user.company;
    u.active = "0";
    u.type = "invite";
    u.activestr = generate();

    var ux = yield User.insertOne(u);

    var data = yield sendmail(email, user.name + "邀请你注册About BTC", 
        config.invite(user.name, user.teamname, u.activestr));

    this.body = {status: 0};

});





index.post("/user", function *(){

    var keys = ["name", "qq", "phone","password", "teamname", "domain"];

    var user = yield User.queryOne({_id: this.session.user._id}), team = {};

    var body = this.request.body, end = this.query.end;

    for(var name in body){
        if(keys.indexOf(name) > -1 && body[name]){
            user[name] = name == "password" ? crypt(body[name]) : body[name];
        }

        if(name == "teamname"){
            team.teamname = body[name];
            team.admin    = this.session.user._id;
            yield Team.insertOne(team);
        }
        if(name == "domain"){
            team = yield Team.queryOne({admin: this.session.user._id});
            team.domain = body[name];
            team.save();
        }
    }

    if(end==1) user.active = "2";

    user.save(function(err, data){});
    this.session.user = user;
    this.body = {status: 0};

});

index.get("/user", function*(){
    this.body = this.session.user;
});


index.get("/logout", function*(){
    this.session.user = null;
    this.body = {status:0};
});

index.get("/invite/:code", function*(){

    var code = this.params.code;

    var user = yield User.queryOne({activestr: code, active: "0"});

    if(user.type == "invite"){
        user.active = "1";
        user.save();
        this.session.user = user;
        this.redirect("/chat/home");
    }else if(user){
        user.active = "1";
        user.save();
        this.session.user = user;
        this.redirect("/chat/home");
    }else{
        this.body = "激活码不存在或已激活";
    }

});

index.post("/uploadfile", function*(){

    var base64 = this.request.body.base64, id = this.request.body.name || Date.now();


    if(base64 && base64.indexOf && base64.indexOf("base64,") > 0) {
            
        var subfix = base64.indexOf("data:image/png") == 0 ? ".png" : ".jpg";
        var index  = subfix == ".png" ? 22 : 23;

        fs.writeFileSync("public/assets/"+id+".png", new Buffer(base64.slice(index), 'base64'));
    }

    this.body = {status: 0, id: id + ".png"};

});

module.exports = index;


function tostring(date){
    
    return date.getFullYear() + "-" + (date.getMonth()+1) + "-" +date.getDate() + "";
}

function generate(){

    var crypto = require('crypto');
    var shasum = crypto.createHash('sha1');

    shasum.update(String(Math.random()+Date.now()));

    var str = shasum.digest('hex');

    return String(str);
}


function crypt(s){
    var crypto = require('crypto');
    var shasum = crypto.createHash('sha1');

    shasum.update(s);

    var str = shasum.digest('hex');

    return String(str);
}

