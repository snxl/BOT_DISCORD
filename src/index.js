const { Client, Intents } = require("discord.js");
const { token, channelName, prefix } = require("../config.json");

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
	console.log("Ready!");
});

client.on("message", (message) => {
	const { channel, content, author, createdTimestamp } = message;
	if (!content.startsWith(prefix)) return;
	if (author.bot || channel.name !== channelName) return;
	
	//-----------------------------------------------------------------------

	return require("./commands/test")(message)

	//-----------------------------------------------------------------------

	// return message.channel.send("test");
});

client.on("messageReactionAdd", (reaction) => {
	return reaction.message.channel.send(
		`${reaction.emoji.name} count: ${reaction.count}`
	);
});

client.login(token);
