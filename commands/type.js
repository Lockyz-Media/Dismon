const { MessageEmbed } = require('discord.js');
const { noBotPerms } = require('../utils/errors');
var Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();
const type = require('../db/types.js');
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

    if(guildsettings.typedex === 'false') {
        return;
    }
    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');
    var msg = message;

    if(!args.length) {
        const embed = new MessageEmbed()
            .setTitle("Error")
            .setDescription("A Type needs to be entered.")
        message.channel.send(embed)
        return;
    }

    let pkmon = args.toString().toLowerCase();

    for(var i=0;i<type.length;i++){
		if(pkmon == type[i].name.toLowerCase()){
            const link = type[i].name.toLowerCase()
            const embed = new MessageEmbed()
                .setTitle(`Type Dex`)
                .setThumbnail("https://db.lockyzdev.net/dismon/types/"+link+".png")
                .setAuthor(type[i].name)
                if(type[i].stAg === undefined)
                {
                    embed.addField(`**Strong Against**`, 'Nothing', true)
                } else {
                    embed.addField(`**Strong Against**`, type[i].stAg, true)
                }
                if(type[i].wkAg === undefined) {
                    embed.addField(`**Weak Against**`, 'Nothing', true)
                } else {
                    embed.addField(`**Weak Against**`, type[i].wkAg, true)
                }
                //
            message.channel.send(embed)
            return;
        }
    }
    for(var i=0;!i<type.length;i++){
        const embed = new MessageEmbed()
                .setTitle(`Error 404 not found`)
                .setDescription("Your Type could not be found.\nIf this was done in error please view this [page](https://docs.lockyzgroup.net/dismon/404-mon)")
            message.channel.send(embed)
            return;
    }
    return;
};

exports.help = {
    name: 'type',
    aliases: [],
    description: 'Get Type Information.',
    usage: 'type {Type}',
    premium: 'false',
    metrics: 'true',
    category: 'fun'
};
