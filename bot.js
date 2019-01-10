const Discord = require("discord.js");
const fs = require("fs");
const {Client, Attachment} = require("discord.js");
const client = new Discord.Client();
require("dotenv").config()
const prefix = "!";

client.on("ready", () => {
    console.log("I am ready!");
})

client.on("message", message => {
    if (message.content.substring(0, 1) == "!") {
        var args = message.content.substring(1).split(" ")
        var cmd = args[0];

        args = args.splice(1);

        switch (cmd) {
            case "ping":
                message.channel.send("pong")
                break;
            case "job":
                message.channel.send("My job is to record our servers ranks and the names of those who belongs to those ranks!");
                break;
            case "csv":
                function runCSV() {
                    //Tags come in based on what role id you entered for args, after it get tags it maps it into an array
                    var showContent = [];
                    function csvRole(roleNameSTR, idSTR) {
                        let thisRole = message.guild.roles.get(idSTR).members.map(m => m.user.tag);
                        for (let i = 0; i < thisRole.length; i++) {
                            showContent.push(`${roleNameSTR},${thisRole[i]}\n`)
                        }
                    }
                    csvRole("Admin", "532407084428558356")
                    csvRole("Dev", "532407172525588480")
                    finalContent = showContent.join("");
                    fs.writeFile("./logs/ranks.csv", finalContent, function (err) {
                        if (err) throw err;
                    })
                    
                    const attachment = message.channel.send(new Attachment("./logs/ranks.csv"))
                    message.channel.send("CSV File created!", attachment)
                }
                runCSV();
                break;
        }
    }

})

client.login(process.env.BOT_TOKEN)