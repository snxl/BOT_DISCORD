module.exports = {
	name: 'role',
	args: true,
	usage: '<user> <role>',
	execute(message, args) {
		message.channel.send(args);
		message.channel.send('Eu ainda não faço nada! 🤖');
	},
};