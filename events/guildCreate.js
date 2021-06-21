const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = async (client, guild) => {
    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guildsettings';").get();
	if (!table['count(*)']) {
        sql.prepare("CREATE TABLE guildsettings (guildID TEXT PRIMARY KEY, premium TEXT, prefix TEXT, pokedex TEXT, typedex TEXT);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
      }
    client.getSettings = sql.prepare("SELECT * FROM guildsettings WHERE guildID = ?");
    client.setSettings = sql.prepare("INSERT OR REPLACE INTO guildsettings (guildID, premium, prefix, pokedex, typedex) VALUES (@guildID, @premium, @prefix, @pokedex, @typedex);");

    let guildsettings;

    guildsettings = client.getSettings.get(guild.id);
	if(!guildsettings) {
		guildsettings = {guildID: guild.id, premium: 'false', prefix: config.prefix, pokedex: 'true', typedex: 'true'}
		client.setSettings.run(guildsettings);
	}
}