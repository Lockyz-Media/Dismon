const { MessageEmbed } = require('discord.js');
const { embedColor, prefix, base, dev, commby, bName, supportS, description } = require('../info.js');
const { noBotPerms } = require('../utils/errors');
const Discord = require('discord.js');
const fs = require('fs');

exports.run = async (client, message, args) => {
    if(message.author.id === "835394949612175380") {
        switch(args[0]) {
            case 'unload':
                const commandName = args[1].toLowerCase();
                const command = client.commands.get(commandName)
                    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        
                if (!command) {
                    return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
                }
        
                const commands = fs.readdirSync('./commands');
                //const folderName = commands.find(fs.readdirSync(`./commands/`).includes(`${command.name}.js`));
        
                delete require.cache[require.resolve(`../commands/${commandName}.js`)];
        
                try {
                    const newCommand = require(`../commands/${commandName}.js`);
                    message.client.commands.set(newCommand.name, newCommand);
                    message.channel.send(`Command \`${newCommand.name}\` was reloaded!`);
                } catch (error) {
                    console.error(error);
                    message.channel.send(`There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``);
                }
            case 'load':
                //let cmds = Array.from(client.commands.keys());
                let cmd2 = args[1];
                let cmdObj2 = client.commands.get(cmd2) || client.commands.get(client.aliases.get(cmd2));
                if (!cmdObj2) return;
                client.loadCommand(cmdObj2)
            return;
            case 'restart':
            return;
        }
    } else {
        message.channel.send('You don\'t have permission to use this command')
    }
};

exports.help = {
    name: 'dev',
    aliases: [],
    description: 'Do Dev functions',
    usage: 'dev {function}',
    premium: 'false',
    metrics: 'false',
    category: 'settings'
};