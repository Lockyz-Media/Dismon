const { prefix } = require('../config');
const { version } = require('../package.json');
const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

const versions = {
    production: 'Production',
    development: 'Development'
};

module.exports = async client => {

    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'botsettings';").get();
	if (!table['count(*)']) {
	  sql.prepare("CREATE TABLE botsettings (clientID TEXT PRIMARY KEY, presenceName TEXT, ownerID TEXT, presenceType TEXT);").run();
	  sql.pragma("synchronous = 1");
	  sql.pragma("journal_mode = wal");
	}
	client.getSettings = sql.prepare("SELECT * FROM botsettings WHERE clientID = ?");
	client.setSettings = sql.prepare("INSERT OR REPLACE INTO botsettings (clientID, presenceName, ownerID, presenceType) VALUES (@clientID, @presenceName, @ownerID, @presenceType);");

    let botsettings;

    botsettings = client.getSettings.get(client.user.id);

    await client.logger.log(`Logged in as ${client.user.tag} (${client.user.id}) in ${client.guilds.size} server(s).`);
    await client.logger.log(`Version ${version} of the bot loaded.`);

    client.user.setPresence({ activity: { name: botsettings.presenceName , type: botsettings.presenceType }, status: 'online'})
};