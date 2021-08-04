const { MessageCollector } = require("discord.js");

module.exports = (message) => {
	const questions = ["Qual o seu nome?", "Qual sua idade?", "De onde você é?"];
	let counter = 0;
	const filter = (m) => m.author.id === message.author.id;

	const collector = new MessageCollector(message.channel, filter, {
		max: questions.length,
		time: 1000 * 15, // 15s
	});

	message.channel.send(questions[counter++]);

	collector.on("collect", (m) => {
		if (counter < questions.length) {
			m.channel.send(questions[counter++]);
		}
	});

	collector.on("end", (collected) => {
		let counter = 0;
		const res = collected.map((value) => {
			return `${questions[counter++]}  ${value.content}`
		}).join("\n");
        message.channel.send(res)
	});
};
