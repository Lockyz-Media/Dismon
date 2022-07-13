const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const humanizeDuration = require('humanize-duration');
const sql = new SQLite('./bot.sqlite');
const sql1 = new SQLite('./spam.sqlite');
const AntiSpam = require('discord-anti-spam');

module.exports = {
    name: 'messageCreate',
    execute(message) {
        const client = message.client
        const user = message.author.user
        const member = message.author
        const guild = message.guild
        var logsID = '635300240819486732'
	},
};