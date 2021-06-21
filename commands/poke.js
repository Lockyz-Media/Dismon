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
            .setDescription("A pokemon needs to be entered.")
        message.channel.send(embed)
        return;
    }
    let pkmon = args.join(" ").toString().toLowerCase();
    P.getPokemonByName(pkmon)
    .then(function(response) {
        //console.log(response)
        const embed = new MessageEmbed()
            .setAuthor('Pokedex')
            .setTitle("N° "+response.id+ " " +response.name)
            .setThumbnail(response.sprites.front_default)
            if(response.types[1] === undefined) {
                embed.addField(`Types`, response.types[0].type.name, true)
            } else {
                embed.addField(`Types`, response.types[0].type.name+ ", "+ response.types[1].type.name, true)
            }
            embed.addField('Height', response.height+'m', true)
            embed.addField('Weight', response.weight+'kg', true)
            embed.addField('Base Experience', response.base_experience, true)
            if(response.id >= 0 && response.id <= 151) {
                embed.addField('Gen', '1', true)
            }
            if(response.id >= 152 && response.id <= 251) {
                embed.addField('Gen', '2', true)
            }
            if(response.id >= 252 && response.id <= 386) {
                embed.addField('Gen', '3', true)
            }
            if(response.id >= 387 && response.id <= 493) {
                embed.addField('Gen', '4', true)
            }
            if(response.id >= 494 && response.id <= 649) {
                embed.addField('Gen', '5', true)
            }
            if(response.id >= 650 && response.id <= 721) {
                embed.addField('Gen', '6', true)
            }
            if(response.id >= 722 && response.id <= 809) {
                embed.addField('Gen', '7', true)
            }
            if(response.id >= 810 && response.id <= 894) {
                embed.addField('Gen', '8', true)
            }
            embed.addField('\u200b', '\u200b', true)
            embed.addField('HP', response.stats[0].base_stat, true)
            embed.addField('ATK', response.stats[1].base_stat, true)
            embed.addField('DEF', response.stats[2].base_stat, true)
            embed.addField('S. ATK', response.stats[3].base_stat, true)
            embed.addField('S. DEF', response.stats[4].base_stat, true)
            embed.addField('\u200b', '\u200b', true)
            embed.addField('Ability 1', response.abilities[0].ability.name, true)
            if(response.abilities[1].is_hidden === true) {
                embed.addField('Hidden Ability', response.abilities[1].ability.name, true)
            } else {
                embed.addField('Ability 2', response.abilities[1].ability.name, true)
                embed.addField('Hidden Ability', response.abilities[2].ability.name, true)
            }
            embed.addField('Important Information', 'Some data is currently unavailable while we make the transition to PokeAPI, sorry.')
        //message.channel.send(embed)
        P.getPokemonSpeciesByName(pkmon)
                .then(function(response) {
                    embed.setDescription(response.flavor_text_entries[0].flavor_text.toString())
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
    name: 'pokedex',
    aliases: ['poke', 'pdex'],
    description: 'Get Poke Information.',
    usage: 'pokedex {Pokemon}',
    premium: 'false',
    metrics: 'true',
    category: 'fun'
};
