module.exports = {
	name: 'teste',
	description: 'Sends test',
	args: false,
	execute(message, args) {
		
		return message.channel.send(message)
		
		return message.channel.send("Pong! 🏓");
	}
};