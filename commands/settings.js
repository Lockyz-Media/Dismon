const { MessageEmbed } = require('discord.js');
const { embedColor, prefix, discord, owner } = require('../config');
const { version } = require('../package.json');
const { noBotPerms } = require('../utils/errors');
const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

exports.run = async (client, message, args) => {

    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guildsettings';").get();
	if (!table['count(*)']) {
	  sql.prepare("CREATE TABLE guildsettings (guildID TEXT PRIMARY KEY, premium TEXT, prefix TEXT, pokedex TEXT, typedex TEXT);").run();
	  sql.pragma("synchronous = 1");
	  sql.pragma("journal_mode = wal");
	}
	client.getSettings = sql.prepare("SELECT * FROM guildsettings WHERE guildID = ?");
	client.setSettings = sql.prepare("INSERT OR REPLACE INTO guildsettings (guildID, premium, prefix, pokedex, typedex) VALUES (@guildID, @premium, @prefix, @pokedex, @typedex);");

    let guildsettings;

    guildsettings = client.getSettings.get(message.guild.id);

    if(message.author.id === message.guild.ownerID || message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_GUILD')) {
        switch(args[0]) {
            case 'command':
                switch (args[1]) {
                    case 'pokedex':
                        if(guildsettings.pokedex === 'false') {
                            guildsettings.pokedex = 'true'
                            client.setSettings.run(guildsettings);
                            message.reply('Pokedex Command has been enabled')
                        } else {
                            guildsettings.pokedex = 'false'
                            client.setSettings.run(guildsettings);
                            message.reply('Pokedex Command has been Disabled')
                        }
                    return;
                    case 'typedex':
                        if(guildsettings.typdex === 'false') {
                            guildsettings.typedex = 'true'
                            client.setSettings.run(guildsettings);
                            message.reply('Typedex Command has been enabled')
                        } else {
                            guildsettings.typedex = 'false'
                            client.setSettings.run(guildsettings);
                            message.reply('Typedex Command has been Disabled')
                        }
                    return;
                    default:
                        message.channel.send('That\'s not a valid command')
                }
            return;
            case 'prefix':
                if(!args[1]) {
                    message.reply(`There's nothing here to make the prefix`)
                } else {
                    guildsettings.prefix = args[1]
                    client.setSettings.run(guildsettings);
                }
            return;
            default:
                const infoEmbed = new MessageEmbed()
                    .setTitle('Settings')
                    .setDescription(`Change Guild Settings`)
                    .setColor(embedColor)
                    .addField('Command Settings', guildsettings.prefix+'settings command {Command Name}')
                    .addField('pokedex', guildsettings.pokedex, true)
                    .addField('typedex', guildsettings.typedex, true)
                    .addField('General Settings', guildsettings.prefix+'settings {setting} <Additional Options>')
                    .addField('prefix', guildsettings.prefix, true)

                message.channel.send(infoEmbed);
            return;
        }
    } else {
		message.reply(`you don't have permission to use this command.`)
	}
};

exports.help = {
    name: 'settings',
    aliases: [],
    description: 'Change guild based settings',
    usage: 'settings {Setting Type} {Setting}',
    premium: 'false',
    metrics: 'true',
    category: 'settings'
};