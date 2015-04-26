

exports.User = function(k, opts){

    var User = k.create({
        
        email: "string",

        company: "string",
        
        password: "string",

        active: "string",

        activestr: "string",

        name: "string", // 姓名

        teamname: "string",

        domain: "string",

        qq: "string",

        phone: "string",

        type: "string",

        head: "string"


    }, "User");

    
    
    return User;
};

