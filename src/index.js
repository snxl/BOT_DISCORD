const { Client, Intents, Collection } = require("discord.js");
const { token, channelName, prefix } = require("../config.json");
const fs = require("fs");
const path = require("path");

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.commands = new Collection();

const commandFolders = fs.readdirSync(path.resolve(__dirname, "commands"));

for (const folder of commandFolders) {
	const commandFiles = fs
		.readdirSync(path.resolve(__dirname, "commands", folder))
		.filter((file) => file.endsWith(".js"));

	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

client.once("ready", () => {
	console.log("Ready!");
});

client.on("message", (message) => {
	const { channel, content, author, createdTimestamp } = message;

	// Restringir respostas se o mensageiro for o Bot ou canal não for o selecionado
	if (author.bot || channel.id !== channelName || !content.startsWith(prefix))
		return;

	// Separar a mensagem enviada pelo usuário
	const args = content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;
	
	const command = client.commands.get(commandName);

	if (command.guildOnly && message.channel.type === "dm") {
		return message.channel.send(
			"Eu não posso executar esse comando dentro de DMs!"
		);
	}

	if (command.args && !args.length) {
		let response = `Você não proveu argumentos, ${message.author}!`;

		if (command.usage) {
			response += `\nO uso correto é: **${config.prefix}${command.name} ${command.usage}**`;
		}

		return message.channel.send(response);
	}

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.channel.send(
			`Houve um erro ao executar o comando "${commandName}" ☹`
		);
	}
});

client.login(token);
