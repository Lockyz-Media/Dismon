const { SlashCommandBuilder } = require('@discordjs/builders');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');
const types = require('../db/types.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Get type information')
            .addStringOption((option) => 
			    option
				    .setName('type')
				    .setDescription('The type you wanted information for')
				    .setRequired(true)
		    ),
	async execute(interaction) {
        const client = interaction.client
        const member = interaction.member
        const type = interaction.options.getString('type').toLowerCase();

            for(var i=0;i<types.length;i++){
                if(type == types[i].name.toLowerCase()){
                    const link = types[i].name.toLowerCase()
                    const pokeEmbed = new MessageEmbed()
                        .setTitle(`Typedex | `+types[i].name)
                        .setThumbnail("https://db.lockyzdev.net/dismon/types/"+link+".png")
                        if(types[i].stAg === undefined)
                        {
                            pokeEmbed.addField(`**Strong Against**`, 'Nothing', true)
                        } else {
                            pokeEmbed.addField(`**Strong Against**`, types[i].stAg, true)
                        }
                        if(types[i].wkAg === undefined) {
                            pokeEmbed.addField(`**Weak Against**`, 'Nothing', true)
                        } else {
                            pokeEmbed.addField(`**Weak Against**`, types[i].wkAg, true)
                        }
                    interaction.reply({ embeds: [pokeEmbed] })
                    return;
                }
            }
	},
};
