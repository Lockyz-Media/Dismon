const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const fs = require('fs');
const { token } = require('./config.json');

const client = new Client({
	intents: [
        Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_INTEGRATIONS,
		Intents.FLAGS.GUILD_WEBHOOKS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGES
    ]
})
// We now have a giveawaysManager property to access the manager everywhere!
client.giveawaysManager = manager;
console.log('==============================')
console.log('=                            =')
console.log('= Dismon Startup Procedures. =')
console.log('=                            =')
console.log('==============================')
console.log('Loading Bot Base...')
console.log('🟢 Bot Base Online')

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	console.log('Loading Slash Command Collection...')
	const command = require('./commands/'+file);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}
console.log('🟢 Found all Slash Commands. Bot Slash Command System Online...')

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	
	const event = require('./events/'+file);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
client.login(token);