import { Message, MessageEmbed } from "discord.js";
import { poll } from "discord.js-poll";
import { createPoll, updatePoll, pollExists } from "../utils/db";

// type PollArgs = string[];

// export default {
// 	name: "poll",
// 	run(message: Message, args: PollArgs) {
// 		return poll(message, args, "+", "#00D1CD");
// 	},
// };

export default {
	name: "poll",
	async run(message: Message, optionName: string = "") {
		let sim = 0;
		let nao = 0;

		if (optionName) {
			const pollInfo = updatePoll(message.id, optionName);
			sim = pollInfo?.options[0].count ?? 0;
			nao = pollInfo?.options[1].count ?? 0;
			message.delete();
		}

		const embed = new MessageEmbed({
			title: "Título",
			description: `
			Sim (${sim})   Não (${nao})
		`,
		});

		message.channel.send({ embed }).then(async (msg) => {
			await msg.react("👍");
			await msg.react("👎");
			if (!optionName) message.delete();
			createPoll(msg.id);
		});
	},
};
