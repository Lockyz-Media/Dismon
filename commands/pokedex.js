const { SlashCommandBuilder } = require('@discordjs/builders');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');
const Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pokedex')
		.setDescription('Get information on a specific pokemon')
            .addStringOption((option) => 
			    option
				    .setName('pokemon')
				    .setDescription('The pokemon you want information on.')
				    .setRequired(true)
		    ),
	async execute(interaction) {
        const client = interaction.client
        const member = interaction.member
        const peekamon = interaction.options.getString('pokemon')
        var form = 'false';
        var gen = 1;

        let pkmon = peekamon.toLowerCase();
        const pokeEmbed = new MessageEmbed()
        P.getPokemonSpeciesByName(pkmon)
            .then(function(response) {
                pokeEmbed.addField('Tags', '\u200b')
                pokeEmbed.addField('Legendary?', response.is_legendary.toString().replace("false", "No").replace("true", "Yes"), true)
                pokeEmbed.addField('Mythical?', response.is_mythical.toString().replace("false", "No").replace("true", "Yes"), true)
                /*if(advanced === "true") {
                    pokeEmbed.addField('Genus', response.genera[7].genus.toString(), true)
                }*/
                pokeEmbed.addField('Basic Information', '\u200b')
                pokeEmbed.addField('Generation', response.generation.name.toString().replaceAll("-", " "), true)
                /*if(advanced === "true") {
                    pokeEmbed.addField('Habitat', response.habitat.name.toString(), true)
                    pokeEmbed.addField('Growth Rate', response.growth_rate.name.toString(), true)
                    pokeEmbed.addField('Shape', response.shape.name.toString(), true)
                }*/
                pokeEmbed.addField('Colour', response.color.name.toString(), true)
                pokeEmbed.setDescription(response.flavor_text_entries[gen-1].flavor_text.toString().replaceAll("\n", " ").replaceAll("\u000c", " "))
            P.getPokemonByName(pkmon)
                .then(function(response) {
                    pokeEmbed.setTitle('Pokedex | N° '+response.id+ " " +response.name)
                    pokeEmbed.setThumbnail(response.sprites.front_default)
                    if(response.types[1] === undefined) {
                        pokeEmbed.addField(`Types`, response.types[0].type.name, true)
                    } else {
                        pokeEmbed.addField(`Types`, response.types[0].type.name+ ", "+ response.types[1].type.name, true)
                    }
                    /*if(advanced === "true") {
                        pokeEmbed.addField('Height', response.height+'m', true)
                        pokeEmbed.addField('Weight', response.weight+'kg', true)
                        pokeEmbed.addField('Base Experience', response.base_experience.toString(), true)
                        pokeEmbed.addField('Base Stats', '\u200b')
                        pokeEmbed.addField('HP', response.stats[0].base_stat.toString(), true)
                        pokeEmbed.addField('ATK', response.stats[1].base_stat.toString(), true)
                        pokeEmbed.addField('DEF', response.stats[2].base_stat.toString(), true)
                        pokeEmbed.addField('S. ATK', response.stats[3].base_stat.toString(), true)
                        pokeEmbed.addField('S. DEF', response.stats[4].base_stat.toString(), true)
                        pokeEmbed.addField('\u200b', '\u200b')
                    }*/
                    pokeEmbed.addField('Ability Information', '\u200b')
                    pokeEmbed.addField('Ability 1', response.abilities[0].ability.name, true)
                    if(response.abilities[1].is_hidden === true) {
                        pokeEmbed.addField('Hidden Ability', response.abilities[1].ability.name, true)
                    } else {
                        pokeEmbed.addField('Ability 2', response.abilities[1].ability.name, true)
                        pokeEmbed.addField('Hidden Ability', response.abilities[2].ability.name, true)
                    }
                    /*if(form !== 'false') {
                        P.getPokemonFormByName(form)
                            .then(function(response) {
                                pokeEmbed.addField('Form Information', '\u200b')
                                pokeEmbed.addField('Battle Only?', response.is_battle_only.toString())
                                pokeEmbed.addField('Mega?', response.is_mega.toString())
                        })
                    }*/
                interaction.reply({ embeds: [pokeEmbed] })
                return;
            })
        });
	},
};
