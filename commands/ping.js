exports.run = async (client, message, args) => {

    message.delete(1000);
    const msg = await message.channel.send('Ping?');
    msg.edit(`Pong! Latency is \`${msg.createdTimestamp - message.createdTimestamp}ms\`. API Latency is \`${Math.round(client.ws.ping)}ms\`.`);
};

exports.help = {
    name: 'ping',
    aliases: [],
    description: 'View the latency of the bot and API.',
    usage: 'ping',
    premium: 'false',
    metrics: 'true',
    category: 'info'
};