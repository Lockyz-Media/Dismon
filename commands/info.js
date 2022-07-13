const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Get advanced information about the bot.'),
	async execute(interaction) {
        const client = interaction.client
        var d = new Date();
        var n = d.getFullYear();
        const embed = new MessageEmbed()
            .setTitle("Dismon")
            .setDescription("**Dismon** is a Pokemon Information Discord Bot.")
            .addField("Developer", 'Robin Painter')
            .setFooter("©2018-"+n+" Lockyz Dev");
        interaction.reply({ embeds: [embed] })
	}
};