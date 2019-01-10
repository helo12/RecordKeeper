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
            case "add":
                message.channel.send("Added:")
                for (var a = 0; a < args.length; a++) {
                    fs.appendFile(`${__dirname}/logs/roleNames.txt`, `${args[a]}\n`, function (err) {
                        if (err) throw err;
                    });
                    message.channel.send(`${args[a]}`)
                }
                break;
            case "csv":
                function runCSV() {
                    //Tags come in based on what role id you entered for args, after it get tags it maps it into an array
                    var showContent = [];
                    fs.readFile(`${__dirname}/logs/roleNames.txt`, "utf8", function (err, data) {
                        if (err) throw err;
                        var roleNames = data.split("\n");
                        var popped = roleNames.pop();
                        for (var l = 0; l < roleNames.length; l++) {
                            csvRole(roleNames[l]);
                            console.log(roleNames[l])
                        }
                    })
                    setTimeout(function () {
                        finalContent = showContent.join("");
                        fs.writeFile(`${__dirname}/logs/ranks.csv`, finalContent, function (err) {
                            if (err) throw err;
                        })
                        const attachment = message.channel.send(new Attachment(`${__dirname}/logs/ranks.csv`))
                        message.channel.send("CSV File created!", attachment)
                    }, 2000)

                    function csvRole(roleNameSTR) {
                        let thisRole = message.guild.roles.find(role => role.name === roleNameSTR).members.map(m => m.user.tag);
                        for (let i = 0; i < thisRole.length; i++) {
                            showContent.push(`${roleNameSTR},${thisRole[i]}\n`)
                        }
                    }

                }
                runCSV();
                break;
        }
    }

})

client.login(key.BOT_TOKEN)