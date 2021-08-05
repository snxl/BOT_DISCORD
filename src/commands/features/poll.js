const express = require('express');
const { Client, Intents, Collection } = require("discord.js");
const router = express.Router();
const nodeHtmlToImg = require('node-html-to-image');
const path = require('path');

module.exports = {
    name: "poll",
    description: "Creates a poll to decide something important or not.",
    args: false,
    async execute(message, args) {
        // Criar pool

        
			
			const image = await nodeHtmlToImg({
				html: `<html><head><style>
				body {
				  font-family: Calibri;
				  width: 200px;
				  height: 200px;
				  background-color: crimson;
				  color: white;
				}
			  	</style></head><body><div>0</div></body></html>`,
				quality: 100,
				transparent: true,
			});
			
			const m = message.channel.send('', {
				files: [image],
			}).then(msg => {
				msg.react('1️⃣').then(() => msg.react('2️⃣')).then(() => msg.react('3️⃣'));
				
				
			})
			
			//m.react('👍').then(() => m.react('👎'));
			// let lm = message.channel.lastMessage;
			// console.log(lm.id)

			// message.channel.messages.fetch({ limit: 1 }).then(messages => {
			// 	let lastMessage = messages.first();
				
				
			// 	console.log(lastMessage.id)
				
			// 	// if (lastMessage.author.bot) {
			// 	// 	// The author of the last message wasn't a bot
					
			// 	// }
			// })
			// .catch(console.error)
			
			// const id = returnedMessage.id;
			// console.log(id);
			
			// return returnedMessage;
			
			// return message.channel.send('', {
			// 	files: [image],
			// });
		// if (args[0]) {
			
        // }
    },
};