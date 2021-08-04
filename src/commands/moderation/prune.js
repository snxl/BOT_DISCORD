module.exports = {
	name: 'prune',
	description: 'Delete messages from the channel it\'s used in. Usage: .prune 1 | .prune 15...',
	execute(message, args) {
		if (!args[0]) {
			return message.channel.send('Você precisa especificar o número de mensagens que serão deletadas.');
		}

		const amount = parseInt(args[0]) + 1;

		if (isNaN(amount)) {
			return message.channel.send('Você precisa informar um número válido entre 2 e 100.');
		}

		if (amount < 2 || amount > 100) {
			return message.channel.send('O número de mensagens a serem deletadas precisa ser entre 2 e 100.');
		}

		return message.channel.bulkDelete(amount, true).catch(err => {
			console.error(err);
			message.channel.send('Houve um erro ao tentar deletar mensagens nesse canal.');
		});
	},
};