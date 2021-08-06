const express = require('express');
const nodeHtmlToImg = require('node-html-to-image');
var fs = require('fs');
const pollResult = require('./poll-result');
require('discord-reply');

module.exports = {
    name: "poll-create",
    description: "Creates a poll to decide something important or not.",
    args: false,
    async execute(message, args) {
        // Criar pool
		const pollArgs = args.join(" ").split("|");
		
		let Poll = {}
		
		let pollKey = '';
		
		let idCharacters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz1234567890';
		
		for ( let i = 0; i < 5; i++) {
			pollKey += idCharacters[Math.floor(Math.random() * idCharacters.length)]
		}
		
		Poll.Id = pollKey;
		
		if( pollArgs.length < 3) return message.channel.send("Revise o comando!");
		if( pollArgs.length > 5 ) return message.channel.send("Somente 3 opções são suportatas no momento.");
		
		let expiration = parseInt(pollArgs[0]);
		
		if(expiration < 10 || expiration > 600) return message.channel.send("Expiração precisa ser entre 10 e 600");
		
		Poll.Expiration = expiration;
		
		if(isNaN(expiration)) return message.channel.send("Expiração precisa ser um número inteiro a partir de 0.");
		
		const pollSubject = pollArgs[1].trim();
		
		Poll.Subject = pollSubject;
		
		let options = '';
		
		let reactionsAmount = 0;
		
		Poll.Options = []
		
		for ( var i = 2; i < pollArgs.length; i++) {
			reactionsAmount++;
			Poll.Options.push({Option: pollArgs[i].trim(), Votes: 0})
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
						position: relative;
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
					
					.option5 {
						color: #b76aff;
					}
					
					.pollId {
						position: absolute;
						right: 20px;
						top: 10px;
						font-size: 16px;
						color: #AAA;
						font-weight: 600;
					}
				</style>
			</head>
			<body>
				<div class="pollId">${pollKey}</div>
				
				<main>
				
					<h2>${pollSubject}</h2>
					
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
		
		let pollMessageId = msg.id;
		
		Poll.pollId = pollMessageId;
		
		fs.readFile('./src/polls.json', 'utf8', function readFileCallback(err, data){
			if (err){
				console.log(err);
			} else {
			let jsonObj = JSON.parse(data);
			jsonObj.push(Poll);
			json = JSON.stringify(jsonObj);
			fs.writeFile('./src/polls.json', json, 'utf8', function() { });
		}});
		
		for(let i = 0; i < reactionsAmount; i++) {
			if (i == 0) msg.react('1️⃣');
			if (i == 1) msg.react('2️⃣');
			if (i == 2) msg.react('3️⃣');
			if (i == 3) msg.react('4️⃣');
			if (i == 4) msg.react('5️⃣');
		}
		
		let interval = setInterval(function() {
			expiration--;
			msg.edit(expiration + " segundos restantes")
			
			if( expiration <= 0 ) {
				clearInterval(interval);
				msg.edit('Votação finalizada');
				
				pollResult.execute(message, pollKey);
			}
		}, 1000);
    },
};