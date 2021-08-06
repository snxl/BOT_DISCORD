import { Message } from "discord.js";
import { createPoll, vote, hasVoted } from "../utils/db";
import generatePollImg from "../utils/generatePollImg";
import { pollArgsToObj } from "../utils/utils";
import { alphabet } from "../utils/constants";

export default {
	name: "poll-img",
	description: "create a poll",
	usage: "Ex.: *!poll-img Pergunta? Opção 1; Opção 2*",
	validate(message: Message, args: string[]) {
		if (!args.length) {
			message.reply(this.usage)
			return false
		}
		return true
	},
	async run(message: Message, args: string[]) {
		if(!this.validate(message, args)) return;

		const { title, options } = pollArgsToObj(args);
		if(options.length > 10) return message.reply("o máximo são 10 opções.")

		const isMultipleOptions = Boolean(options.length);

		if (!isMultipleOptions) return;

		const adjustedOptions: { name: string; count: number }[] = options.map(
			(option) => ({ name: option, count: 0 })
		);

		const imagePath = await generatePollImg(title, adjustedOptions);
		message.channel
			.send("", { files: [imagePath] })
			.then(async (msg) => {
				message.delete();
				let optionsObj: any = [];
				if (isMultipleOptions) {
					optionsObj = await Promise.all(
						options.map(async (option, i) => {
							await msg.react(alphabet[i]);
							return {
								name: option,
								reactionEmoji: alphabet[i],
								count: 0,
							};
						})
					);
				} else {
					msg.react("👍");
					msg.react("👎");
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

		const adjustedOptions: { name: string; count: number }[] = options.map(
			({ name, count }) => ({ name, count })
		);

		const imagePath = await generatePollImg(title, adjustedOptions);
		message.channel.send("", { files: [imagePath] }).then((msg) => {
			message.delete();
			options.forEach((option) => {
				msg.react(option.reactionEmoji);
			});
			updateId(msg.id);
		});
	}
};
