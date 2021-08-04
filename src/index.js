const { Client, Intents } = require('discord.js');
const { token } = require('../config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	const { channel, content, author, createdTimestamp } = message;

	if (author.bot || channel.name !== 'bot-tests') return;

	const response = `sent a message on channel ${channel} at ${createdTimestamp}: ${content}`;

	return message.reply(response);
});

client.on('messageReactionAdd', reaction => {
	return reaction.message.channel.send(`${reaction.emoji.name} count: ${reaction.count}`);
});

client.login(token);