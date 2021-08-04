import { Client } from "discord.js";
import { token, channelId, prefix } from "../config.json";
import commandHandler from "./commandHandler";

const client = new Client();

client.once("ready", () => {
	console.log("Ready!");
});

client.on("message", (message) => {
	const { channel, content, author } = message;

	if (!content.startsWith(prefix) || author.bot || channel.id !== channelId)
		return;

	//-----------------------------------------------------------------------
	commandHandler(message);
});

client.login(token);
