module.exports = {
	name: 'beep',
	description: 'Sends a "Boop! 🤖" back.',
	execute(message) {
		return message.channel.send('Boop! 🤖');
	},
};