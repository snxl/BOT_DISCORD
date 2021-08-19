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
					
					// Checar se a poll está fechada
					if (poll.Closed === true) {
						
						let totalVotes = 0;
						
						poll.Options.forEach(option => {
							totalVotes += option.Votes;
						});
						
						let options = '';
						
						for( let i = 0; i < poll.Options.length; i++) {
							
							options += `<article class="option${i+1} result">
											<span>${((100 * poll.Options[i].Votes) / totalVotes).toFixed(0)}%<br/>(${poll.Options[i].Votes})</span>
											<label>${poll.Options[i].Option.trim()}</label>
											<div style="width: ${ ((100 * poll.Options[i].Votes) / totalVotes) }%"></div>
										</article>`;
						}
						
						(async function() {
							const resultImage = await nodeHtmlToImg({
								html: `<html>
								<head>
									<style>
										.body {
											width: 400px;
											height: 300px;
											background-color: white;
											font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
											color: black;
											display: flex;
											flex-direction: column;
											border-radius: 5px;
										}
										
										header {
											position: relative;
										}
										
										header h2 {
											padding: 20px;
											color: #444;
											margin: 0px 0;
											font-size: 3.5vh;
										}
										
										header span {
											position: absolute;
											top: 5px;
											right: 10px;
											color: #888;
										}
										
										session {
											flex: 1;
											display: flex;
											flex-direction: column;
										}
										
										article {
											position: relative;
											padding: 0 20px;
											flex: 1;
											display: flex;
											gap: 15px;
											align-items: center;
											border-top: 1px solid #EEE;
										}

										article.result {
											
										}
										
										article span {
											background-color: #EFEFEF;
											padding: 1px 8px 3px 8px;
											margin-right: 15px;
											border-radius: 50%;
											font-weight: bold;
											z-index: 1;
										}
										
										article label {
											line-height: 24px;
											color: #555;
											text-align: justify;
											font-size: 2.5vh;
											z-index: 1;
										}
										
										article.result span {
											padding: 3px 6px 6px 6px;
											border-radius: 5px;
											font-size: 1.6vh;
											margin-left: -10px;
											text-align: center;
											background-color: white;
										}
										
										article div {
											position: absolute;
											left: 0;
											bottom: 0;
											height: 5px;
											z-index: 0;
										}
										
										.option1 {
											color: #0A86FF;
										}
										
										.option1 div {
											background-color: #0A86FF88;
										}
										
										.option2 {
											color: #FFA539;
										}
										
										.option2 div {
											background-color: #ffa63988;
										}
										
										.option3 {
											color: #FF6A83;
										}
										
										.option3 div {
											background-color: #FF6A8388;
										}
									</style>
								</head>
								<body class="body">
									
									<header>
										<h2>${poll.Subject}</h2>
										<span>${poll.Id}</span>
									</header>
									
									<session>
										
										${options}
										
									</session>
									
								</body>
								</html>`,
								quality: 100,
								transparent: true,
							});
							
							json = JSON.stringify(jsonObj);
							fs.writeFile('./src/polls.json', json, 'utf8', function() { });
							
							message.lineReply('', {
								files: [resultImage]
							});
						})();
					} else {
						
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
									
									// Votes.map(option => {
									// 	options += `<article class="option${i+1} result">
									// 					<span>${((100 * option.Votes) / totalVotes).toFixed(0)}%<br/>(${option.Votes})</span>
									// 					<label>${option.Option.trim()}</label>
									// 					<div style="width: ${ ((100 * option.Votes) / totalVotes) }%"></div>
									// 				</article>`;
									// })
									
									// (${Votes[i][1]}) ${ ((100 * Votes[i][1]) / totalVotes).toFixed(2) }%
									
									for( let i = 0; i < Votes.length; i++) {
										// let rn = Math.random() * 100;
										// options += `<article class="option${i+1} result">
										// 				<span>${rn.toFixed(0)}%<br/>(${Votes[i][1]})</span>
										// 				<label>${Votes[i][0].trim()}</label>
										// 				<div style="width: ${ rn }%"></div>
										// 			</article>`;
										options += `<article class="option${i+1} result">
														<span>${((100 * Votes[i][1]) / totalVotes).toFixed(0)}%<br/>(${Votes[i][1]})</span>
														<label>${Votes[i][0].trim()}</label>
														<div style="width: ${ ((100 * Votes[i][1]) / totalVotes) }%"></div>
													</article>`;
									}
									
									poll.Closed = true;
									
									(async function() {
										const resultImage = await nodeHtmlToImg({
											html: `<html>
											<head>
												<style>
													.body {
														width: 400px;
														height: 300px;
														background-color: white;
														font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
														color: black;
														display: flex;
														flex-direction: column;
														border-radius: 5px;
													}
													
													header {
														position: relative;
													}
													
													header h2 {
														padding: 20px;
														color: #444;
														margin: 0px 0;
														font-size: 3.5vh;
													}
													
													header span {
														position: absolute;
														top: 5px;
														right: 10px;
														color: #888;
													}
													
													session {
														flex: 1;
														display: flex;
														flex-direction: column;
													}
													
													article {
														position: relative;
														padding: 0 20px;
														flex: 1;
														display: flex;
														gap: 15px;
														align-items: center;
														border-top: 1px solid #EEE;
													}
			
													article.result {
														
													}
													
													article span {
														background-color: #EFEFEF;
														padding: 1px 8px 3px 8px;
														margin-right: 15px;
														border-radius: 50%;
														font-weight: bold;
														z-index: 1;
													}
													
													article label {
														line-height: 24px;
														color: #555;
														text-align: justify;
														font-size: 2.5vh;
														z-index: 1;
													}
													
													article.result span {
														padding: 3px 6px 6px 6px;
														border-radius: 5px;
														font-size: 1.6vh;
														margin-left: -10px;
														text-align: center;
														background-color: white;
													}
													
													article div {
														position: absolute;
														left: 0;
														bottom: 0;
														height: 5px;
														z-index: 0;
													}
													
													.option1 {
														color: #0A86FF;
													}
													
													.option1 div {
														background-color: #0A86FF88;
													}
													
													.option2 {
														color: #FFA539;
													}
													
													.option2 div {
														background-color: #ffa63988;
													}
													
													.option3 {
														color: #FF6A83;
													}
													
													.option3 div {
														background-color: #FF6A8388;
													}
												</style>
											</head>
											<body class="body">
												
												<header>
													<h2>${poll.Subject}</h2>
													<span>${poll.Id}</span>
												</header>
												
												<session>
													
													${options}
													
												</session>
												
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
				}
			});
		}});
    },
};