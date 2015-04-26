

exports.Ticket = function(k, opts){

    var Ticket = k.create({
        
        title: "string", // 标题

        content: "string",// 内容
        
        type: "string", // 类型

        author: "string",// 作者

        time: "string", // 时间

        status: "string", // 状态

        lastupdate: "string", // 最后更新

        domain: "string",

        ticket: "string",

        userid: "string",
        
        teamname: "string",

        offical: "string"

    }, "Ticket");

    
    
    return Ticket;
};

