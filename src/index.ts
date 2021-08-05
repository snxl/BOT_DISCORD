import { Client } from "discord.js";
import { token, channelId, prefix } from "../config.json";
import commandHandler, {commands} from "./commandHandler";
import { pollExists } from "./utils/db";

const client = new Client();

client.once("ready", () => {
	console.log("Ready!");
});

client.on("message", (message) => {
	const { channel, content, author } = message;

	if (!content.startsWith(prefix) || author.bot || channel.id !== channelId)
		return;

	commandHandler(message);
});

client.on("messageReactionAdd", (reaction_orig, user) => {
	if (
		reaction_orig.message.author.bot &&
		!user.bot &&
		pollExists(reaction_orig.message.id)
	) {
		commands.poll.vote(reaction_orig.message, user.id, reaction_orig.emoji.name);
	}
});

client.login(token);