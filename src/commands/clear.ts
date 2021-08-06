import { Message } from "discord.js";

export default {
	name: "clear",
	description: "delete some channel messages",
	async run(message: Message) {
		(await message.channel.messages.fetch()).forEach(msg => msg.delete())
	},
};
