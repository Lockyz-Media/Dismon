const { SlashCommandBuilder } = require('@discordjs/builders');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Get item information')
            .addStringOption((option) => 
			    option
				    .setName('item')
				    .setDescription('The item you wanted information for')
				    .setRequired(true)
		    ),
	async execute(interaction) {
        const client = interaction.client
        const member = interaction.member
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
                pokeEmbed.addField('Important Information', 'More information has been added to the pokedex command.')
            interaction.reply({ content: ' ', embeds: [pokeEmbed], components: [row] })
            return;
        });
	},
};
