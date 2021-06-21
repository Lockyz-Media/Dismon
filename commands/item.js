const { MessageEmbed } = require('discord.js');
const { noBotPerms } = require('../utils/errors');
var Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();
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

    if(guildsettings.pokedex === 'false') {
        return;
    }

    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');
    var msg = message;

    if(!args.length) {
        const embed = new MessageEmbed()
            .setTitle("Error")
            .setDescription("An item needs to be entered.")
        message.channel.send(embed)
        return;
    }
    let pkmon = args.join(" ").toString().toLowerCase();
    P.getItemByName(pkmon)
    .then(function(response) {
        //console.log(response)
        const embed = new MessageEmbed()
            .setAuthor('ItemDex')
            .setTitle(response.name)
            .setThumbnail(response.sprites.default)
            embed.addField('Effect', response.effect_entries[0].short_effect)
            if(response.cost = 0) {
                embed.addField('Cost in Mart', 'Not Purchaseable')
            } else {
                embed.addField('Cost in Mart', response.cost)
            }
            embed.addField('Item Category', response.category.name)
            embed.addField('Important Information', 'Some data is currently unavailable while we make the transition to PokeAPI, sorry.')
        P.getItemByName(pkmon)
                .then(function(response) {
                    embed.setDescription(response.flavor_text_entries[0].text.toString())
                    message.channel.send(embed)
            });
        return;
    })
    .catch(function(error) {
        const embed2 = new MessageEmbed()
            .setTitle(`This search has resulted in an error`)
            .setDescription(error)
        console.log('There was an ERROR: ', error);
        message.channel.send(embed2)
        return;
    });
};

exports.help = {
    name: 'itemdex',
    aliases: ['item', 'idex'],
    description: 'Get Item Information.',
    usage: 'itemdex {Item}',
    premium: 'false',
    metrics: 'true',
    category: 'fun'
};
