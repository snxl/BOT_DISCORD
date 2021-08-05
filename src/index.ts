import { Client } from "discord.js";
import { token, channelId, prefix } from "../config.json";
import commandHandler from "./commandHandler";
import poll from "./commands/poll";
import { pollExists } from "./utils/db";

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

// client.on("messageReactionAdd", (reaction_orig, user) => {
// 	if (
// 		reaction_orig.message.author.bot &&
// 		!user.bot &&
// 		pollExists(reaction_orig.message.id)
// 	) {
// 		poll.run(reaction_orig.message, reaction_orig.emoji.name === "👍" ? "Sim" : "Não");
// 	}
// });

client.login(token);
