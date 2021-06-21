const config = require("../config.js")
const {MessageEmbed} = require('discord.js');
const fs = require("fs");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = async (client, message) => {

	/*const embed2 = new MessageEmbed()
		.setTitle(`NEW FEATURE`)
		.setDescription(`We over at Lockyz Dev are ALWAYS updating our bots and including more commands/features\nOn the 27th of March 2021 we added an itemdex command. *You can use this command with {prefix}itemdex {item}*\n\nThanks for using our bot\nIf there are any issues contact us on our [discord](https://discord.gg/eRPsZns)`)
    */
    if (!message.guild) return;

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

    let newPrefix = guildsettings.prefix

    if (message.mentions.has(client.user.id)) {
        message.reply('My Prefix for this guild is ' +newPrefix)
     }

    if (message.author.bot) return;
    if (message.content.indexOf(newPrefix) !== 0) return;

    const args = message.content.slice(newPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd) return;
    if(cmd) {
			const SQLite = require("better-sqlite3");
			const sql = new SQLite('../premium.sqlite');

			const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'premium';").get();
			if (!table['count(*)']) {
				sql.prepare("CREATE TABLE premium (guildID TEXT PRIMARY KEY, dismon TEXT, lmb TEXT, test TEXT);").run();
				sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON premium (guildID);").run();
				sql.pragma("synchronous = 1");
				sql.pragma("journal_mode = wal");
			}
			client.getSettings = sql.prepare("SELECT * FROM premium WHERE guildID = ?");
			client.setSettings = sql.prepare("INSERT OR REPLACE INTO premium (guildID, dismon, lmb, test) VALUES (@guildID, @dismon, @lmb, @test);");
	
			let settings;
	
			settings = client.getSettings.get(message.guild.id);

			switch(cmd.help.premium){
				case 'true':
					message.channel.send('HOW YOU DO DIS')
				return;
				default:
					switch(cmd.help.metrics) {
						case 'true':
							const SQLite = require("better-sqlite3");
							const sql = new SQLite('../premium.sqlite');
				
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
					
							settings = client.getSettings.get(cmd.help.name);
					
							if(!settings) {
								settings = { command: cmd.help.name, usecount: 1, servers: 1 };
								client.setSettings.run(settings);
								cmd.run(client, message, args)
								//await message.channel.send(embed2)
								return;
							}
					
							const pointsToAdd = 1
							settings.usecount += pointsToAdd;
		
							if(settings.usecount = 1000) {
								client.channels.cache.get('812107709524082728').send(message.author.username+' has gotten the '+cmd.help.name+' to '+settings.usecount+' uses.\nMy Creator Lochlan "Lockyz" Painter will run a giveaway as soon as he notices.');
							}
					
							client.setSettings.run(settings);
							try {
								cmd.run(client, message, args)
							}
							catch (error) {
								console.error(error);
								message.channel.send(`There was an error while executing a command \`${cmd.help.name}\`:\n\`${error.message}\``);
							}
							//await message.channel.send(embed2)
						return;
						case 'false' :
							try {
								cmd.run(client, message, args)
							}
							catch (error) {
								console.error(error);
								message.channel.send(`There was an error while executing a command \`${cmd.help.name}\`:\n\`${error.message}\``);
							}
							//await message.channel.send(embed2)
					}
			}
		}
};