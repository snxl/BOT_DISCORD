module.exports = {
	name: 'avatar',
	description: 'Shows a user avatar. Usage: .avatar | .avatar @mention1 @mention2',
	execute(message, args) {
		if (args[0]) {
			const mentions = message.mentions.users;
			const response = mentions.map(mention => {
				return `Avatar de ${mention.username}: ${mention.displayAvatarURL({ dynamic: true, size: 256 })}`;
			});

			return message.channel.send(response);
		}

		console.log(message.author.displayAvatarURL());

		return message.channel.send(`${message.author.username}, seu avatar: ${message.author.displayAvatarURL({ dynamic: true, size: 256 })}`);
	},
};