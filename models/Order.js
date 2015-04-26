



exports.Order = function(k, opts){

    var Order = k.create({
        
        ctime:  "string",
        key:  "string",
        money:  "string",
        name:  "string",
        pay_from:  "string",
        pay_id:  "string",
        userid: "string"
        
    }, "Order");

    
    
    return Order;
};



