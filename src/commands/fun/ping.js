module.exports = {
	name: 'ping',
	description: 'Sends a "Pong! 🏓" back.',
	execute(message, args) {
		console.log(args);
		return message.channel.send('Pong! 🏓');
	},
};