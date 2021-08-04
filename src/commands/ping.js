module.exports = {
	name: 'ping',
	description: 'Sends a "Pong! 🏓" back.',
	execute(message, args) {
		return message.channel.send("Pong! 🏓");
	}
};