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
