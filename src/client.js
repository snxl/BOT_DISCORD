const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

const { token, prefix, channelName } = require('../config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFolders = fs.readdirSync(path.resolve(__dirname, 'commands'));

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(path.resolve(__dirname, 'commands', folder)).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

client.once('ready', () => {
	console.log(`${client.user.username} is here! 🤖`);
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot || message.channel.id !== channelName) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.channel.send('Eu não posso executar esse comando dentro de DMs!');
	}

	if (command.args && !args.length) {
		let response = `Você não proveu argumentos, ${message.author}!`;

		if (command.usage) {
			response += `\nO uso correto é: **${prefix}${command.name} ${command.usage}**`;
		}

		return message.channel.send(response);
	}

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.channel.send(`Houve um erro ao executar o comando "${commandName}" ☹`);
	}
});

client.login(token);

module.exports = client;