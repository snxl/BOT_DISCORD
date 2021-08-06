const express = require('express');
const { Client, Intents, Collection } = require("discord.js");
const nodeHtmlToImg = require('node-html-to-image');
require('discord-reply');
var fs = require('fs');

module.exports = {
    name: "poll-result",
    description: "Get the result of a previous poll.",
    args: false,
    async execute(message, args) {
        
		let pollKey = '';
		
		if(typeof(args) == "string")  pollKey = args;
		if(typeof(args) == "object")  pollKey = args.join("");
		
		if(pollKey.length > 5) return console.log("Digite somente o id da votação.");
		
		fs.readFile('./src/polls.json', 'utf8', function readFileCallback(err, data){
			if (err){
				console.log(err);
			} else {
			let jsonObj = JSON.parse(data);
			
			jsonObj.map(poll => {
				if(poll.Id == pollKey) {
					message.channel.messages.fetch({ limit: 100 }).then((messages) => {
						messages.map(m => {
							if(parseInt(m.id) == parseInt(poll.pollId)) {
								let oneCount = undefined;
								let twoCount = undefined;
								let threeCount = undefined;
								let fourCount = undefined;
								let fiveCount = undefined;
								
								let totalVotes = 0;
								let Votes = []
								
								if(m.reactions.cache.get('1️⃣')) {
									oneCount = m.reactions.cache.get('1️⃣').count - 1;
									totalVotes += oneCount;
									poll.Options[0].Votes = oneCount;
									Votes.push([poll.Options[0].Option, oneCount]);
									//console.log(poll.Options[0].Votes)
								}
								if(m.reactions.cache.get('2️⃣')) {
									twoCount = m.reactions.cache.get('2️⃣').count - 1;
									totalVotes += twoCount;
									poll.Options[1].Votes = twoCount;
									Votes.push([poll.Options[1].Option, twoCount]);
								};
								if(m.reactions.cache.get('3️⃣')) {
									threeCount = m.reactions.cache.get('3️⃣').count - 1;
									totalVotes += threeCount;
									poll.Options[2].Votes = threeCount;
									Votes.push([poll.Options[2].Option, threeCount]);
								};
								if(m.reactions.cache.get('4️⃣')) {
									fourCount = m.reactions.cache.get('4️⃣').count - 1;
									totalVotes += fourCount;
									poll.Options[3].Votes = fourCount;
									Votes.push([poll.Options[3].Option, fourCount]);
								};
								if(m.reactions.cache.get('5️⃣')) {
									fiveCount = m.reactions.cache.get('5️⃣').count - 1;
									totalVotes += fiveCount;
									poll.Options[4].Votes = fiveCount;
									Votes.push([poll.Options[4].Option, fiveCount]);
								};
								
								let options = '';
								
								for( let i = 0; i < Votes.length; i++) {
									options += `<article class="option${i+1}">
													<span>${i+1}</span>
													<label>${Votes[i][0].trim()}</label>
													<div style="border-left: ${ ((100 * Votes[i][1]) / totalVotes) * 3 }px solid"> (${Votes[i][1]}) ${ ((100 * Votes[i][1]) / totalVotes).toFixed(2) }%</div>
													
												</article>`;
								}
								
								(async function() {
									const resultImage = await nodeHtmlToImg({
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
													position: relative;
													background-color: transparent;
													padding: 0 20px;
													margin: 8px 0;
												}
												
												article label {
													line-height: 24px;
													font-size: 18px;
													color: #555;
												}
												
												article div {
													position: relative;
													bottom: 0;
													height: 3px;
													margin-top: 10px;
													line-height: 2px;
													padding-left: 6px;
													font-size: 10px;
													opacity: 0.8;
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
											<div class="pollId">${poll.Id}</div>
											
											<main>
											
												<h2>${poll.Subject}</h2>
												
												<session>
													
													${options}
													
												</session>
												
											</main>
											
										</body>
										</html>`,
										quality: 100,
										transparent: true,
									});
									
									json = JSON.stringify(jsonObj);
									fs.writeFile('./src/polls.json', json, 'utf8', function() { });
									
									m.lineReply('', {
										files: [resultImage]
									});
								})();
							}
						})
					});
				}
			});
		}});
    },
};