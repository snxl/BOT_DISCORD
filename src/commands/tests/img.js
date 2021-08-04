const nodeHtmlToImg = require('node-html-to-image');
const font2base64 = require('node-font2base64');
const path = require('path');

const _data = font2base64.encodeToDataUrlSync(path.resolve(__dirname, '..', '..', 'assets', 'fonts', 'Lexend-Regular.ttf'));
// const _data = font2base64.encodeToDataUrlSync('../../assets/fonts/Lexend-Regular.ttf');

module.exports = {
	name: 'img',
	description: 'Create an image.',
	async execute(message, args) {
		if (!args.length) {
			message.channel.send('Você não passou nenhum argumento.');
		}

		const mentions = message.mentions.users.map(mention => {
			return {
				username: mention.username,
				avatar: mention.displayAvatarURL({ dynamic: true, size: 256 }),
			};
		});

		const image = await nodeHtmlToImg({
			html: `
				<html>
					<head>
						<style>
							@font-face {
								font-family: 'Lexend';
								src: url(${_data}) format('ttf');
							}
							body {
								width: 300px;
								height: 300px;
								font-family: 'Lexend';
							}
							h1 {
								color: #ffffff;
							}
						</style>
					</head>
					<body>
						<h1>${mentions[0].username}</h1>
						<img src=${mentions[0].avatar} alt=${`Avatar de ${mentions[0].username}`} />
					</body>
				</html>
			`,
			quality: 100,
			transparent: true,
		});

		return message.channel.send('', {
			files: [image],
		});
	},
};