module.exports = {
	name: 'beep',
	description: 'Sends a "Boop! 🤖" back.',
	execute(message, args) {
		return message.channel.send("Boop! 🤖");
	}
};