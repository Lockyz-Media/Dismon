module.exports = {
	name: 'ready',
	once: true,
	execute(client) {

		client.user.setActivity("with your feelings.", {
			type: "PLAYING"
		});
		console.log('🟢 Bot Partially Online! Logged in as '+ client.user.tag)
		console.log('==== Have a good day! ====');
	},
};