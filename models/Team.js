



exports.Team = function(k, opts){

    var Team = k.create({
        
        teamname: "string",

        domain: "string",

        type: "string", // 2w, 10w

        admin: "string" //admin user id



    }, "Team");

    
    
    return Team;
};



