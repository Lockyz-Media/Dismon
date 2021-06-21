if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

const { Client, MessageEmbed } = require('discord.js');
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Enmap = require('enmap');
const config = require('./config.js')
require('dotenv-flow').config();

const client = new Client({
	disableEveryone:  true,
	messageCacheMaxSize: 500,
	messageCacheLifetime: 120,
	messageSweepInterval: 60
});

client.commands = new Enmap();
client.aliases = new Enmap();
client.categories = new Enmap();
client.categories.fun = new Enmap();
client.categories.info = new Enmap();
client.categories.settings = new Enmap();

client.commands = new Enmap();
client.aliases = new Enmap();

client.logger = require('./utils/logger');

require('./utils/functions')(client);

const init = async () => {

	const cmdFiles = await readdir('./commands/');
	cmdFiles.forEach(f => {
		if (!f.endsWith('.js')) return;
		const response = client.loadCommand(f);
		if (response) client.logger.log(response);
	});

	const evtFiles = await readdir('./events/');
	evtFiles.forEach(f => {
		const evtName = f.split('.')[0];
		const event = require(`./events/${f}`);
		client.on(evtName, event.bind(null, client));
	});

	client.login(config.token);
};

init();