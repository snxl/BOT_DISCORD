module.exports = {
	name: 'ping',
	description: 'Sends a "Pong! 🏓" back.',
	args: true,
	execute(message, args) {
		
		
		
		return message.channel.send("Pong! 🏓");
	}
};