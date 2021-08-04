const client = require('../client');

client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'bem-vindo');

	if (!channel) return;

	channel.send(`Seja bem-vindo, ${member}!`);
});