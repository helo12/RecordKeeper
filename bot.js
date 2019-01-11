const Discord = require("discord.js");
const fs = require("fs");
const { Client, Attachment } = require("discord.js");
const client = new Discord.Client();
require("dotenv").config()
const prefix = "!";
const key = process.env;


client.on("ready", () => {
    var dir = __dirname + '/logs';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
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
            case "test":
                console.log(message.guild.roles.map(role => role.id))
                console.log(message.guild.roles.map(role => role.name))
                break;
            case "csv":
                function runCSV() {
                    //Tags come in based on what role id you entered for args, after it get tags it maps it into an array
                    var showContent = [];
                    var roleIDArr = message.guild.roles.map(role => role.id).slice(1);
                    var roleNamesArr = message.guild.roles.map(role => role.name).slice(1);

                    for (var l = 0; l < roleIDArr.length; l++) {
                        csvRole(roleIDArr[l], roleNamesArr[l]);
                        console.log(roleIDArr[l] + ": " + roleNamesArr[l]);
                    }
                    setTimeout(function () {
                        var finalContent = showContent.join("");
                        fs.writeFile(`${__dirname}/logs/ranks.csv`, finalContent, function (err) {
                            if (err) throw err;
                        })
                        const attachment = message.channel.send(new Attachment(`${__dirname}/logs/ranks.csv`))
                        message.channel.send("CSV File created!", attachment)
                    }, 2000)

                    function csvRole(roleID, roleName) {
                        let thisRole = message.guild.roles.get(roleID).members.map(m => m.user.tag);
                        for (let i = 0; i < thisRole.length; i++) {
                            showContent.push(`${roleName},${thisRole[i]}\n`);
                        }

                    }
                }
                runCSV();
                break;
        }
    }

})

client.on('error', console.error)

client.login(key.BOT_TOKEN)