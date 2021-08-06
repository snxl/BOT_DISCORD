import { Message } from "discord.js";

export default {
	name: "test",
	description: "some test function",
	usage: "",
	validate(){},
	async run(message: Message) {
		await message.channel.send(this.description);
	},
};
