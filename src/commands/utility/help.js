const fs = require('fs');
const path = require('path');

module.exports = {
	name: 'help',
	description: 'Shows available commands.',
	execute(message) {
		const commandFolders = fs.readdirSync(path.resolve(__dirname, '..'));

		const availableCommands = [];

		for (const folder of commandFolders) {
			const commandFiles = fs.readdirSync(path.resolve(__dirname, '..', folder)).filter(file => file.endsWith('.js'));

			for (const file of commandFiles) {
				const command = file.replace('.js', '');
				availableCommands.push(command);
			}

		}

		return message.channel.send(`Comandos disponíveis: ${availableCommands.join(', ')}.`);
	},
};