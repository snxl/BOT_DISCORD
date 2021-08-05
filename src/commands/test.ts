import {
	MessageCollector,
	Message,
	CollectorFilter,
	TextChannel,
	DMChannel,
} from "discord.js";

export default {
	name: "test",
	async run(message: Message) {
		return await message.channel.send('test handler')

		const questions = [
			"Qual o seu nome?",
			"Qual sua idade?",
			"De onde você é?",
		];
		const filter: CollectorFilter = (m) => m.author.id === message.author.id;

		const collector = new MessageCollector(
			message.channel as TextChannel | DMChannel,
			filter,
			{
				max: questions.length,
				time: 1000 * 15, // 15s
			}
		);

		let counter = 0;
		message.channel.send(questions[counter++]);

		collector.on("collect", (m) => {
			if (counter < questions.length) {
				m.channel.send(questions[counter++]);
			}
		});

		collector.on("end", (collected) => {
			let counter = 0;
			const res = collected
				.map((value) => {
					return `${questions[counter++]}  ${value.content}`;
				})
				.join("\n");
			message.channel.send(res);
		});
	},
};
