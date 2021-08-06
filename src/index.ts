import { Client } from "discord.js";
import { token, channelId, prefix } from "../config.json";
import commandHandler, { commands } from "./commandHandler";
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

let lastReact: string[] = [];
client.on("messageReactionAdd", async (reaction, user) => {
	try {
		if (
			reaction.message.author.bot &&
			!user.bot &&
			pollExists(reaction.message.id)
		) {
			if (lastReact[0] === reaction.message.id && lastReact[1] === user.id) {
				return;
			}
			const isImg = Boolean(reaction.message.attachments.size)
			lastReact = [reaction.message.id, user.id];
			if(isImg) {
				commands["poll-img"].vote(
					reaction.message,
					user.id,
					reaction.emoji.name
				);
			} else {
				commands.poll.vote(
					reaction.message,
					user.id,
					reaction.emoji.name
				);
			}
		}
	} catch (err) {
		console.log("Erro:", err)
		reaction.message.channel.send("Ops! Algo deu errado.")
	}
});

client.login(token);
