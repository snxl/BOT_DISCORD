import { Message } from "discord.js";
// import { poll } from "discord.js-poll";

export default {
	name: "poll",
	run(message: Message) {
		return message.channel.send("Poll handler");
	},
};
