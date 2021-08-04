import { Client, Intents } from "discord.js";
import { token, channelId, prefix } from "../config.json";

import test from "./commands/test";

const client = new Client();

client.once("ready", () => {
	console.log("Ready!");
});

client.on("message", (message) => {
	const { channel, content, author } = message;
	if (!content.startsWith(prefix)) return;
	if (author.bot || channel.id !== channelId) return;

	//-----------------------------------------------------------------------

	// return test(message);

	return message.reply("Works fine!")

	//-----------------------------------------------------------------------

	// return message.channel.send("test");
});

client.on("messageReactionAdd", (reaction) => {
	return reaction.message.channel.send(
		`${reaction.emoji.name} count: ${reaction.count}`
	);
});

client.login(token);
