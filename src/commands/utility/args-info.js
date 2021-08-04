module.exports = {
	name: 'args-info',
	description: 'Shows information about the arguments provided. Usage: .args-info foo | .args-info arg1 arg2 arg3...',
	args: true,
	execute(message, args) {
		if (!args.length) {
			message.channel.send('Você não passou nenhum argumento.');
		}
		else if (args[0] === 'foo') {
			return message.channel.send('bar');
		}
		let response = `Args: ${args.join(', ')}.`;
		response += `\nPrimeiro argumento: ${args[0]}.`;
		response += `\nTotal de argumentos: ${args.length}.`;
		return message.channel.send(response);
	},
};