module.exports = {
	name: 'ping',
	description: 'Sends a "Pong! 🏓" back.',
	execute(message) {
		return message.channel.send('Pong! 🏓');
	},
};