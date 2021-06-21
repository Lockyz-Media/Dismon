const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../info.js');
const SQLite = require("better-sqlite3");
const sql = new SQLite('../premium.sqlite');

exports.run = async (client, message, args) => {
    let cmd = args[0];
    let cmdObj = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

    if (!cmd) {
        return message.channel.send('you need to enter a command name.')
    }

    if(!cmdObj) {
        let cmdName = client.commands.get('help', 'help.name');
        message.channel.send(`that isn't a valid command, do `+cmdName+' for a command list')
        return;
    }

    if(cmdObj.help.metrics === 'false') {
        return message.channel.send(`this command doesn't have metrics enabled.`)
    }

    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'commandmetrics';").get();
    if (!table['count(*)']) {
        sql.prepare("CREATE TABLE commandmetrics (command TEXT PRIMARY KEY, usecount INTEGER, servers INTEGER);").run();
        sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON commandmetrics (command);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }
    client.getSettings = sql.prepare("SELECT * FROM commandmetrics WHERE command = ?");
    client.setSettings = sql.prepare("INSERT OR REPLACE INTO commandmetrics (command, usecount, servers) VALUES (@command, @usecount, @servers);");

    let settings;

    settings = client.getSettings.get(cmdObj.help.name);

    if(!settings) {
        settings = { command: cmdObj.help.name, usecount: 1, servers: 1 };
        client.setSettings.run(settings);
    }
    
    const infoEmbed = new MessageEmbed()
	    .setAuthor(client.user.username, client.user.avatarURL())
        .setTitle(cmd)
        .addField(`Uses`, settings.usecount)
	    .setColor(embedColor)
	    .setTimestamp();
    message.channel.send(infoEmbed);
    //message.delete(1000);
};

exports.help = {
    name: 'metrics',
    aliases: [],
    description: 'Get metrics from various commands',
    usage: 'metrics {Command}',
    premium: 'false',
    metrics: 'true',
    category: 'info'
};