module.exports = {
	name: 'server',
	description: 'Shows server info.',
	execute(message) {
		return message.channel.send(`Este servidor se chama ${message.guild.name}.\nFoi criado em ${message.guild.createdAt}\nPossui ${message.guild.memberCount} membros.`);
	},
};