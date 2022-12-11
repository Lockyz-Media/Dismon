const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permission, MessageButton } = require('discord.js');
const paginationEmbed = require('discordjs-button-pagination');
const ms = require("ms");
const Pokedex = require('pokedex-promise-v2');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./databases/user.sqlite');
var P = new Pokedex();
const types1 = require('../db/types1.js');
const types2 = require('../db/types2.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pokemon')
		.setDescription('Get information from the pokemon games')
        .addSubcommand(subcommand =>
            subcommand
                .setName('pokedex')
                .setDescription('Get information on a specific pokemon')
                .addStringOption((option) => 
			        option
				        .setName('pokemon')
				        .setDescription('The pokemon you want information on.')
				        .setRequired(true)
		        )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('typedex')
                .setDescription('Get type information')
                .addStringOption((option) => 
			        option
				        .setName('type')
				        .setDescription('The type you wanted information for')
				        .setRequired(true)
                        .addChoices(
                            { name: 'Normal', value: 'normal' },
                            { name: 'Fire', value: 'fire' },
                            { name: 'Water', value: 'water' },
                            { name: 'Grass', value: 'grass' },
                            { name: 'Electric', value: 'electric' },
                            { name: 'Ice', value: 'ice' },
                            { name: 'Fighting', value: 'fighting' },
                            { name: 'Poison', value: 'poison' },
                            { name: 'Ground', value: 'ground' },
                            { name: 'Flying', value: 'flying' },
                            { name: 'Psychic', value: 'psychic' },
                            { name: 'Bug', value: 'bug' },
                            { name: 'Rock', value: 'rock' },
                            { name: 'Ghost', value: 'ghost' },
                            { name: 'Dark', value: 'dark' },
                            { name: 'Dragon', value: 'dragon' },
                            { name: 'Steel', value: 'steel' },
                            { name: 'Fairy', value: 'fairy' },
                        )
		        )
                .addStringOption((option) =>
                    option
                        .setName('version')
                        .setDescription('Set the specific database version you\'d like to use')
                        .addChoices(
                            { name: 'Version 1.0', value: "1" },
                            { name: 'Version 2.0', value: "2" },
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('itemdex')
                .setDescription('Get item information')
                .addStringOption((option) => 
			        option
				        .setName('item')
				        .setDescription('The item you wanted information for')
				        .setRequired(true)
		        )
        ),
	async execute(interaction) {
        const client = interaction.client
        const member = interaction.member
        var lan = 'en'
        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }
        const locale = require('../locale/'+lan+'.json')

        if(interaction.options.getSubcommand() === 'pokedex') {
            const peekamon = interaction.options.getString('pokemon')
            var form = 'false';
            var gen = 1;

            let pkmon = peekamon.toLowerCase();
            const embed1 = new MessageEmbed()

            const embed2 = new MessageEmbed()
            embed2.setTitle('Stats')
            
            const embed3 = new MessageEmbed()
            embed3.setTitle('Tags')

            const embed4 = new MessageEmbed()
            embed4.setTitle('Advanced')

            const button1 = new MessageButton()
                .setCustomId('previousbtn')
                .setLabel('Previous')
                .setStyle('DANGER');

            const button2 = new MessageButton()
                .setCustomId('nextbtn')
                .setLabel('Next')
                .setStyle('SUCCESS');

            P.getPokemonSpeciesByName(pkmon)
                .then(function(response) {
                    //Tags
                    embed3.addField('Legendary?', response.is_legendary.toString().replace("false", "No").replace("true", "Yes"), true)
                    embed3.addField('Mythical?', response.is_mythical.toString().replace("false", "No").replace("true", "Yes"), true)
                    //Advanced
                    embed4.addField('Genus', response.genera[7].genus.toString(), true)
                    embed1.addField('Generation', response.generation.name.toString().replaceAll("-", " "), true)
                    embed4.addField('Habitat', response.habitat.name.toString(), true)
                    embed4.addField('Growth Rate', response.growth_rate.name.toString(), true)
                    embed4.addField('Shape', response.shape.name.toString(), true)
                    embed4.addField('Colour', response.color.name.toString(), true)
                    //Normal
                    embed1.setDescription(response.flavor_text_entries[gen-1].flavor_text.toString().replaceAll("\n", " ").replaceAll("\u000c", " "))
                P.getPokemonByName(pkmon)
                    .then(function(response) {
                        //Normal
                        embed1.setTitle('Pokedex | N° '+response.id+ " " +response.name)
                        embed1.setThumbnail(response.sprites.front_default)
                        embed2.setThumbnail(response.sprites.front_default)
                        embed3.setThumbnail(response.sprites.front_default)
                        if(response.types[1] === undefined) {
                            embed1.addField(`Types`, response.types[0].type.name, true)
                        } else {
                            embed1.addField(`Types`, response.types[0].type.name+ ", "+ response.types[1].type.name, true)
                        }

                        //Stats
                        embed2.addField('Height', response.height+'m', true)
                        embed2.addField('Weight', response.weight+'kg', true)
                        embed2.addField('Base Experience', response.base_experience.toString(), true)
                        embed2.addField('Base Stats', '\u200b')
                        embed2.addField('HP', response.stats[0].base_stat.toString(), true)
                        embed2.addField('ATK', response.stats[1].base_stat.toString(), true)
                        embed2.addField('DEF', response.stats[2].base_stat.toString(), true)
                        embed2.addField('S. ATK', response.stats[3].base_stat.toString(), true)
                        embed2.addField('S. DEF', response.stats[4].base_stat.toString(), true)
                        embed2.addField('\u200b', '\u200b')

                        //Normal
                        embed1.addField('Ability Information', '\u200b')
                        embed1.addField('Ability 1', response.abilities[0].ability.name, true)
                        if(response.abilities[1].is_hidden === true) {
                            embed1.addField('Hidden Ability', response.abilities[1].ability.name, true)
                        } else {
                            embed1.addField('Ability 2', response.abilities[1].ability.name, true)
                            embed1.addField('Hidden Ability', response.abilities[2].ability.name, true)
                        }

                        pages = [
                            embed1,
                            embed2,
                            embed3,
                            embed4
                        ];

                        buttonList = [
                            button1,
                            button2
                        ]

                        paginationEmbed(interaction, pages, buttonList);
                        
                        //interaction.reply({ embeds: [pokeEmbed] })
                        return;
                })
            });
        }
        if(interaction.options.getSubcommand() === 'typedex') {
            const type = interaction.options.getString('type').toLowerCase();
            const version = interaction.options.getString('version')

            if(version === "1") {
                for(var i=0;i<types1.length;i++){
                    if(type == types1[i].name.toLowerCase()){
                        const link = types1[i].name.toLowerCase()
                        const pokeEmbed = new MessageEmbed()
                            .setTitle(`Typedex V1 | `+types1[i].name)
                            .setThumbnail("https://dbbackup.lockyzdev.net/botcommands/typedex/"+link+".png")
                            if(types1[i].stAg === undefined)
                            {
                                pokeEmbed.addField(`**Strong Against**`, 'Nothing', true)
                            } else {
                                pokeEmbed.addField(`**Strong Against**`, types1[i].stAg, true)
                            }
                            if(types1[i].wkAg === undefined) {
                                pokeEmbed.addField(`**Weak Against**`, 'Nothing', true)
                            } else {
                                pokeEmbed.addField(`**Weak Against**`, types1[i].wkAg, true)
                            }
                            pokeEmbed.addField('Important Information', 'More information has been added to the pokedex command.')
                        interaction.reply({ embeds: [pokeEmbed] })
                        return;
                    }
                }
            } else {
                for(var i=0;i<types2.length;i++){
                    if(type == types2[i].name.toLowerCase()){
                        const link = type
                        const pokeEmbed = new MessageEmbed()
                            .setTitle(`Typedex V2 | `+types2[i].name)
                            .setThumbnail("https://dbbackup.lockyzdev.net/botcommands/typedex/"+link+".png")
                            if(types2[i].noEffect === "None")
                            {
                                pokeEmbed.addField(`**No Effect Towards**`, 'Nothing', true)
                            } else {
                                pokeEmbed.addField(`**No Effect Towards**`, types2[i].noEffect, true)
                            }
                            if(types2[i].noVerEffect === "None") {
                                pokeEmbed.addField(`**Not Very Effective Against**`, 'Nothing', true)
                            } else {
                                pokeEmbed.addField(`**Not Very Effective Against**`, types2[i].noVerEffect, true)
                            }
                            if(types2[i].supEffect === "None") {
                                pokeEmbed.addField(`**Super Effective Against**`, 'Nothing', true)
                            } else {
                                pokeEmbed.addField(`**Super Effective Against**`, types2[i].supEffect, true)
                            }
                        interaction.reply({ embeds: [pokeEmbed] })
                        return;
                    }
                }
            } 
        }
        
        if(interaction.options.getSubcommand() === 'itemdex') {
            const item = interaction.options.getString('item').toLowerCase();
            P.getItemByName(item)
                .then(function(response) {
                const pokeEmbed = new MessageEmbed()
                    .setTitle('Itemdex | '+response.name)
                    .setThumbnail(response.sprites.default)
                    pokeEmbed.addField('Effect', response.effect_entries[0].short_effect)
                    if(response.cost = 0) {
                        pokeEmbed.addField('Cost in Mart', 'Not Purchaseable')
                    } else {
                        pokeEmbed.addField('Cost in Mart', response.cost.toString())
                    }
                    pokeEmbed.addField('Item Category', response.category.name)
                    pokeEmbed.setDescription(response.flavor_text_entries[0].text.toString())
                interaction.reply({ content: ' ', embeds: [pokeEmbed], components: [row] })
                return;
            });
        }
    }
};
