const express = require('express');
const { Client, Intents, Collection } = require("discord.js");
const router = express.Router();
const nodeHtmlToImg = require('node-html-to-image');
const path = require('path');
require('discord-reply');

//!poll 10 | Qual é o maior país da américa? | Brasil | Estados Unidos | Canadá

module.exports = {
    name: "poll",
    description: "Creates a poll to decide something important or not.",
    args: false,
    async execute(message, args, client) {
        // Criar pool
		const pollArgs = args.join(" ").split("|");
		let expiration = parseInt(pollArgs[0]);
		const subject = pollArgs[1].trim();
		
		let options = '';
		
		//console.log(pollArgs.length)
		
		for ( var i = 2; i < pollArgs.length; i++) {
			//console.log(pollArgs[i].trim())
			options += `<article class="option${i-1}">
							<span>${i-1}</span>
							<label>${pollArgs[i].trim()}</label>
						</article>`;
		}
		
		const image = await nodeHtmlToImg({
			html: `<html>
			<head>
				<style>
					body {
						width: 400px;
						height: 300px;
						background-color: white;
						font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
						color: black;
						display: flex;
						flex-direction: column;
						border-radius: 5px;
					}
					
					h2 {
						padding: 20px;
						color: #444;
						margin: 10px 0;
					}
					
					session {
						display: flex;
						flex-direction: column;
						gap: 15px;
					}
					
					article {
						background-color: transparent;
						padding: 0 20px;
						margin: 8px 0;
					}
					
					article label {
						line-height: 24px;
						font-size: 18px;
						color: #555;
					}
					
					span {
						background-color: #EFEFEF;
						padding: 1px 8px 3px 8px;
						border-radius: 50%;
						font-weight: bold;
					}
					
					.option1 {
						color: #0A86FF;
					}
					
					.option2 {
						color: #FFA539;
					}
					
					.option3 {
						color: #FF6A83;
					}
					
					.option4 {
						color: #4dbb31;
					}
					
					.option6 {
						color: #b76aff;
					}
				</style>
			</head>
			<body>
				
				<main>
					
					<h2>${subject}</h2>
					
					<session>
						
						${options}
						
					</session>
					
				</main>
				
			</body>
			</html>`,
			quality: 100,
			transparent: true,
		});
		
		let msg = await message.channel.send('', {
			files: [image],
		})
		
		msg.react('1️⃣');
		msg.react('2️⃣');
		msg.react('3️⃣');
	
		let interval = setInterval(function() {
			expiration--;
			msg.edit(expiration + " segundos restantes")
			
			if( expiration <= 0 ) {
				clearInterval(interval);
				msg.edit('Votação finalizada');
				let oneCount = msg.reactions.cache.get('1️⃣').count - 1;
				let twoCount = msg.reactions.cache.get('2️⃣').count - 1;
				let threeCount = msg.reactions.cache.get('3️⃣').count - 1;
				
				(async function() {
					const resultImage = await nodeHtmlToImg({
						html: `<html><head><style>
						body {
							font-family: Calibri;
							width: 200px;
							height: 200px;
							background-color: dodgerblue;
							color: white;
						}
						</style></head><body>
							<div>1️⃣: ${oneCount}</div>
							<div>2️⃣: ${twoCount}</div>
							<div>3️⃣: ${threeCount}</div>
						</body></html>`,
						quality: 100,
						transparent: true,
					});
								
					msg.lineReply('', {
						files: [resultImage]
					});
				})();
			}
			
		}, 1000);
    },
};



