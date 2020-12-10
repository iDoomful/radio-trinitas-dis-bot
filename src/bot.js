require('dotenv').config();

const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const client = new Discord.Client();
const prefix = "+"

var servers = {}

client.on('ready', () => {
    console.log("ready");

    client.user.setPresence({
        activity: {
            name: 'creștini cum se roagă',
            type: "WATCHING",
            url: 'https://www.trinitas.tv/'
        }
    });

    client.on('message', async message => {
        if (message.author.bot) return;
        if (message.content.startsWith(prefix)) {
            const [command, ...args] = message.content.trim().substring(prefix.length).split(/\s+/);

            if (command == "trinitas") {
                const voiceChannel = message.guild.channels.cache.find(channel => channel.name === "Biserica");

                if (voiceChannel == undefined) {
                    return message.channel.send("Acest bot are nevoie de un voice channel numit 'Biserica' in care sa intre");
                }

                if (message.member.hasPermission("MUTE_MEMBERS")) {
                    //if (!message.member.voiceChannel) return message.channel.send("Nu te afli intr-un voice channel");

                    switch (args[0]) {
                        case "play":
                            console.log(`* ${message.member.displayName} issued 'trinitas play'`);

                            if (servers[message.guild.id]) {
                                servers[message.guild.id].resume(true);
                            } else {
                                voiceChannel.join().then(connection => {
                                    servers[message.guild.id] = connection.play(ytdl("https://www.youtube.com/watch?v=yGBBmNaW-HE&ab_channel=TRINITASTV"))
                                        .on("finish", () => connection.disconnect())
                                });
                            }
                            break;
                        case "join":
                            console.log(`* ${message.member.displayName} issued 'trinitas join'`);

                            voiceChannel.join().then(connection => {
                                servers[message.guild.id] = connection.play(ytdl("https://www.youtube.com/watch?v=yGBBmNaW-HE&ab_channel=TRINITASTV"))
                                    .on("finish", () => connection.disconnect())
                            });

                            break;
                        case "leave":
                        case "stop":
                            console.log(`* ${message.member.displayName} issued 'trinitas leave'`);
                            voiceChannel.leave();
                            delete servers[message.guild.id];
                            break;
                        case "pause":
                            console.log(`* ${message.member.displayName} issued 'trinitas pause'`);
                            if (servers[message.guild.id]) servers[message.guild.id].pause(true);
                            break;
                    }
                } else {
                    message.channel.send("Nu ai permisiunea sa executi aceste comenzi");
                }
            }
        }
    });
});

client.login(process.env.BOT_TOKEN);