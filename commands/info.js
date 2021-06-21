const { MessageEmbed } = require('discord.js');
const { embedColor, prefix, base, dev, commby, bName, supportS, description } = require('../info.js');
const { noBotPerms } = require('../utils/errors');
const Discord = require('discord.js');

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');
    const infoEmbed = new MessageEmbed()
        .setTitle(bName)
        .setDescription(`If you need help do ${prefix}help\n`+description)
        .setColor(embedColor)
        .addField('Support', supportS)
        .addField('Base Version', base)
        .addField('Developer', dev)
        .setFooter('©2020 Lockyz Development');

    message.channel.send(infoEmbed);
};

exports.help = {
    name: 'info',
    aliases: ['botinfo'],
    description: 'View bot information.',
    usage: 'info',
    premium: 'false',
    metrics: 'true',
    category: 'info'
};