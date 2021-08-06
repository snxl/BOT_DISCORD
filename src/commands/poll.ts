import { Message, MessageAttachment, MessageEmbed } from "discord.js";
import { createPoll, vote, hasVoted } from "../utils/db";
import generatePollImg from "../utils/generatePollImg";
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
	async run2(message: Message, args: string[], optionName?: string) {
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
				`,
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

	async run(message: Message, args: string[], optionName?: string) {
		const { title, options } = pollArgsToObj(args);

		const isMultipleOptions = Boolean(options.length);

		if (!isMultipleOptions) return;

		const adjustedOptions: { name: string; count: number }[] = options.map(
			(option) => ({ name: option, count: 0 })
		);

		const imagePath = await generatePollImg(title, adjustedOptions);
		const imgFile = new MessageAttachment(imagePath);
		const embedImg: any = new MessageEmbed().setImage("attachment://image.png");
		await message.channel
			.send({ embed: embedImg, files: [imgFile] })
			.then(async (msg) => {
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
		// if (hasVoted(message.id, userId)) {
		// 	return;
		// }
		const [{ title, options }, updateId] = vote(
			message.id,
			userId,
			reactionEmoji
		);

		const adjustedOptions: { name: string; count: number }[] = options.map(
			({name, count}) => ({ name, count })
		);

		const imagePath = await generatePollImg(title, adjustedOptions);
		const imgFile = new MessageAttachment(imagePath);
		const embedImg: any = new MessageEmbed().setImage("attachment://image.png");
		await message.channel
			.send({ embed: embedImg, files: [imgFile] })
		.then((msg) => {
			message.delete();
			options.forEach(async (option) => {
				await msg.react(option.reactionEmoji);
			});
			updateId(msg.id);
		});
	},

	async vote2(message: Message, userId: string, reactionEmoji: string) {
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
