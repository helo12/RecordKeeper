var Discord = require("discord.io");
var logger = require("winston");
var auth = require("./auth.json");
var fs = require("fs");

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = "debug";

var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on("ready", function(evt){
    logger.info("Connected");
    logger.info("Logged in as: ");
    logger.info(bot.username + `-(${bot.id})`);
});

bot.on("message", function(user, userID, channelID, message, evt) {
    if(message.substring(0,1) == "!") {
        var args = message.substring(1).split(" ")
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            case "ping":
            bot.sendMessage({
                to: channelID,
                message: "Pong!"
            });
            case "csv":
            // Use this code for each role
            function csvRole(nameSTRING, idSTRING){
                let roleName = nameSTRING
                let thisRole = message.guild.roles.get(idSTRING).members.map(m=>m.user.tag);
                thisRole.join(` ${roleName},`);
                thisRole.split(" ");
                thisRole.unshift(`${roleName},`);
                thisRole.join("\n")
            }

            let content = [
                // csvRole("Admin", "1231354425632433"),
                // csvRole("HR", "1231231241241241")
            ].join("\n");

            fs.writeFile("/logs/ranks.csv", content, function(err){
                if (err) throw err;
                bot.sendMessage({
                    to: channelID,
                    message: "CSV created."
                })
            })
            message.channel.send(new Discord.Attachment("./logs/ranks.csv", "ranks.csv"))
            .then(msg => {
                bot.sendMessage({
                    to: channelID,
                    message: "CSV added to files."
                })
            }).catch(console.error);
            break;
        }
    }
})