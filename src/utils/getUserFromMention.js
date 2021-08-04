const client = require('../client');

const getUserFromMention = (mention) => {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		console.log('mention', mention);
		return client.users.cache.get(mention);
	}
}

module.exports = getUserFromMention;