module.exports = {
	name: 'user-info',
	description: 'Shows user info. Usage: .user-info | .user-info @mention',
	execute(message) {
		return message.reply(`aqui estão suasinformações:\nNome de usuário: ${message.author.username}\nID: ${message.author.id}`);
	},
};