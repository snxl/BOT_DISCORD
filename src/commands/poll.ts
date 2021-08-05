import { Message, MessageEmbed } from "discord.js";
import { createPoll, vote, hasVoted } from "../utils/db";
import { pollArgsToObj } from "../utils/utils";

const alphabet = [
	"🇦",
	"🇧",
	"🇨",
	"🇩",
	"🇪",
	"🇫",
	"🇬",
	"🇭",
	"🇮",
	"🇯",
	"🇰",
	"🇱",
	"🇲",
	"🇳",
	"🇴",
	"🇵",
	"🇶",
	"🇷",
	"🇸",
	"🇹",
	"🇺",
	"🇻",
	"🇼",
	"🇽",
	"🇾",
	"🇿",
];

export default {
	name: "poll",
	description: "create a poll",
	async run(message: Message, args: string[], optionName?: string) {
		const { title, options } = pollArgsToObj(args);

		const isMultipleOptions = Boolean(options.length);
		let embed;

		if (isMultipleOptions) {
			embed = new MessageEmbed({
				title,
				description: `
					${options
						.map(
							(option, index) => `${alphabet[index]} **(0)** - ${option}\n\n`
						)
						.join("")}
				`,
			});
		} else {
			embed = new MessageEmbed({
				title,
				description: `
					👍 **(0)** - Sim

					👎 **(0)** - Não 
				`
			});
		}

		message.channel.send({ embed }).then(async (msg) => {
			if (!optionName) message.delete();
			let optionsObj: any = [];
			if (isMultipleOptions) {
				optionsObj = await Promise.all(
					options.map(async (option, i) => {
						await msg.react(alphabet[i]);
						return { name: option, reactionEmoji: alphabet[i], count: 0 };
					})
				);
			} else {
				await msg.react("👍");
				await msg.react("👎");
				optionsObj = [
					{ name: "Sim", reactionEmoji: "👍", count: 0 },
					{ name: "Não", reactionEmoji: "👎", count: 0 },
				];
			}
			createPoll(msg.id, title, optionsObj);
		});
	},




	async vote(message: Message, userId: string, reactionEmoji: string) {
		if (hasVoted(message.id, userId)) {
			return;
		}
		const [{ title, options }, updateId] = vote(
			message.id,
			userId,
			reactionEmoji
		);
		const embed = new MessageEmbed({
			title,
			description: `
				${options
					.map(
						(option) =>
							`${option.reactionEmoji} **(${option.count})** - ${option.name}\n\n`
					)
					.join("")}
			`,
		});

		await message.channel.send({ embed }).then((msg) => {
			message.delete();
			options.forEach(async (option) => {
				await msg.react(option.reactionEmoji);
			});
			updateId(msg.id);
		});
	},
};
