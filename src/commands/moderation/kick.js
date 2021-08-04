module.exports = {
	name: 'kick',
	description: 'Example of mention handling to kick user. Usage: .kick @mention',
	guildOnly: true,
	execute(message) {
		const taggedUser = message.mentions.users.first();

		return taggedUser ?
			message.channel.send(`Você quis banir ${taggedUser}.`) :
			message.channel.send('Você precisa mencionar um usuário para bani-lo.');
	},
};