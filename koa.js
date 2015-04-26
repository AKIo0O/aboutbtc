


var koa = require('koa');
var app = koa();
var k = require("kmodel");

var mount = require('koa-mount');
var session = require('koa-session');
var staticserver = require('koa-static');
var koaBody = require("koa-body"),
    xss = require("xss"),
    csrf = require('koa-csrf');

var config = require("./config.js");


var hash = config.hash;


k.connect("mongodb://127.0.0.1:27017/"+config.dbname, __dirname+"/models/");



var router = require("./routes/index");

app.keys = config.keys;
app.use(staticserver(__dirname+'/public/'));
app.use(staticserver(__dirname+'/views/'));


app.use(session({secret: hash}));
csrf(app);

app.use(csrf.middleware);

app.use(koaBody({
    formLimit:100 * 1024 * 1024,
    formidable: {
        maxFieldsSize: "10mb"
    }
}));
app.use(function*(next){
    
    yield next;

    var postbody;

    if(this.method == "POST"){
        postbody = this.request.body;
        for(var key in postbody){
            if(postbody[key])
                this.request.body[key] = xss(postbody[key]);
        }
    }
});


app.use(mount("/", router.middleware()));

require("./routes/helper/socket");

app.use(function*(){

    var html = "";

    if(this.path.indexOf("/user") == 0 && this.path.indexOf(".html") < 0){

        html = "./views"+this.path+".html";
    }

    if(this.path.indexOf("/chat") == 0 && this.path.indexOf(".html") < 0){

        html = this.path.length >0 ? "./views/templates/chat.html" : "./views/templates"+this.path+".html";

        if(this.session.user && this.session.user.email == "tangxm90@gmail.com" && this.path.indexOf(".html") < 0){
            html = "./views/templates/adminchat.html";
        }
    }

    if(html.length) this.body = require("fs").readFileSync(html).toString().replace("#crsftoken#", this.csrf);;
});



Date.prototype.string = function(){

    return this.getFullYear() + "-" + String("00"+this.getMonth()).slice(-2)
         + "-" +String("00"+this.getDate()).slice(-2)
         +" "+String("00"+this.getHours()).slice(-2)+":"+String("00"+this.getMinutes()).slice(-2);
};


















app.listen(3000);