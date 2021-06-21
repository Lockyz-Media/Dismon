//client.user.setPresence({ game: { name: `Pokemon Information` , type: `WATCHING` }, status: 'online'});

const { RichEmbed } = require('discord.js');
const { embedColor, prefix, discord, owner } = require('../config');
const { version } = require('../package.json');
const { noBotPerms } = require('../utils/errors');
const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

exports.run = async (client, message, args) => {

    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'botsettings';").get();
	if (!table['count(*)']) {
	  sql.prepare("CREATE TABLE botsettings (clientID TEXT PRIMARY KEY, presenceName TEXT, ownerID TEXT, presenceType TEXT);").run();
	  sql.pragma("synchronous = 1");
	  sql.pragma("journal_mode = wal");
	}
	client.getSettings = sql.prepare("SELECT * FROM botsettings WHERE clientID = ?");
	client.setSettings = sql.prepare("INSERT OR REPLACE INTO botsettings (clientID, presenceName, ownerID, presenceType) VALUES (@clientID, @presenceName, @ownerID, @presenceType);");

    let botsettings;

    botsettings = client.getSettings.get('678204683189354499');

    if(message.author.id === '835394949612175380') {
        if(!args.length) {
            botsettings.presenceName = 'Pokemon Information'
            botsettings.presenceType = 'WATCHING'
            client.setSettings.run(botsettings);
            client.user.setPresence({ activity: { name: botsettings.presenceName , type: botsettings.presenceType }, status: 'online'})
            return message.reply('Reset bots presence')
        }
        let type = args[0]
        let status = args.slice(1).join(' ');
        if(!status) {
            return message.reply(`Please specify a Message`);
        }
        botsettings.presenceName = status
        botsettings.presenceType = type
        client.setSettings.run(botsettings);
        client.user.setPresence({ activity: { name: botsettings.presenceName , type: botsettings.presenceType }, status: 'online'})
        return message.reply('Action complete')

    } else {
		message.reply(`you don't have permission to use this command.`)
	}
};

exports.help = {
    name: 'presence',
    aliases: [],
    description: 'Set the bots status',
    usage: 'presence {Type} {Status}',
    premium: 'false',
    metrics: 'true',
    category: 'settings'
};