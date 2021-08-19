const express = require("express");
const nodeHtmlToImg = require("node-html-to-image");
var fs = require("fs");
const pollResult = require("./poll-result");
require("discord-reply");

module.exports = {
    name: "poll-create",
    description: "Creates a poll to decide something important or not.",
    args: false,
    async execute(message, args) {
        // Criar pool
        const pollArgs = args.join(" ").split("|");

        let Poll = {};

        let pollKey = "";

        let idCharacters =
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz1234567890";

        for (let i = 0; i < 5; i++) {
            pollKey +=
                idCharacters[Math.floor(Math.random() * idCharacters.length)];
        }

        Poll.Id = pollKey;

        Poll.Closed = false;

        if (pollArgs.length < 3)
            return message.channel.send("Revise o comando!");
        if (pollArgs.length > 5)
            return message.channel.send(
                "Somente 3 opções são suportatas no momento."
            );

        let expiration = parseInt(pollArgs[0]);

        if (expiration < 10 || expiration > 600)
            return message.channel.send("Expiração precisa ser entre 10 e 600");

        Poll.Expiration = expiration;

        if (isNaN(expiration))
            return message.channel.send(
                "Expiração precisa ser um número inteiro a partir de 0."
            );

        const pollSubject = pollArgs[1].trim();

        let SubjectCharacterLength = pollArgs[1].trim().length;

        Poll.Subject = pollSubject;

        let options = "";

        let reactionsAmount = 0;

        Poll.Options = [];

        let OptionsCharacterLength = 0;

        for (var i = 2; i < pollArgs.length; i++) {
            reactionsAmount++;
            Poll.Options.push({ Option: pollArgs[i].trim(), Votes: 0 });
            OptionsCharacterLength += pollArgs[i].trim().length;
            options += `<article class="option${i - 1}">
							<span>${i - 1}</span>
							<label>${pollArgs[i].trim()}</label>
						</article>`;
        }

        console.log(SubjectCharacterLength, OptionsCharacterLength);

        // SUbject: 1 linha - 34

        let SubjectFontSize = 0;

        let OptionsFontSize = 0;

        if (SubjectCharacterLength <= 34) {
            SubjectFontSize = 22;
        } else if (
            SubjectCharacterLength > 34 &&
            SubjectCharacterLength <= 68
        ) {
            SubjectFontSize = 18;
        } else {
            SubjectFontSize = 16;
        }

        if (OptionsCharacterLength <= 114) {
            OptionsFontSize = 18;
        } else if (
            OptionsCharacterLength > 114 &&
            OptionsCharacterLength <= 228
        ) {
            OptionsFontSize = 14;
        } else {
            OptionsFontSize = 12;
        }

        const image = await nodeHtmlToImg({
            html: `<html>
					<head>
						<style>
                            
                            body {
                                width: 400px;
                                height: 300px;
                            }
                        
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
                            
                            main {
                                bacoground-color: green;
                            }
                            
                            header {
                                position: relative;
                                flex: 1;
                                display: flex;
                                align-items: center;
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
                                font-size: 14px;
                            }
                            
                            session {
                                flex: 2;
                                display: flex;
                                flex-direction: column;
                            }
                            
                            article {
                                padding: 0 20px;
                                flex: 1;
                                display: flex;
                                gap: 15px;
                                align-items: center;
                                border-top: 1px solid #EEE;
                            }
                            
                            article span {
                                background-color: #EFEFEF;
                                padding: 1px 8px 3px 8px;
                                margin-right: 15px;
                                border-radius: 50%;
                                font-weight: bold;
                            }
                            
                            article label {
                                line-height: 24px;
                                color: #555;
                                text-align: justify;
                                font-size: 2.5vh;
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
						</style>
					</head>
					<body class="body">
						
                        <header>
                            <h2>${pollSubject}</h2>
                            <span>${pollKey}</span>
                        </header>
                        
                        <session>
                            
                            ${options}
                            
                        </session>
						
					</body>
					</html>`,
            quality: 100,
            transparent: true,
        });

        let msg = await message.channel.send("", {
            files: [image],
        });

        let pollMessageId = msg.id;

        Poll.pollId = pollMessageId;

        fs.readFile(
            "./src/polls.json",
            "utf8",
            function readFileCallback(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    let jsonObj = JSON.parse(data);
                    jsonObj.push(Poll);
                    json = JSON.stringify(jsonObj);
                    fs.writeFile(
                        "./src/polls.json",
                        json,
                        "utf8",
                        function () {}
                    );
                }
            }
        );

        for (let i = 0; i < reactionsAmount; i++) {
            if (i == 0) msg.react("1️⃣");
            if (i == 1) msg.react("2️⃣");
            if (i == 2) msg.react("3️⃣");
            if (i == 3) msg.react("4️⃣");
            if (i == 4) msg.react("5️⃣");
        }

        let interval = setInterval(function () {
            expiration--;
            msg.edit(expiration + " segundos restantes");

            if (expiration <= 0) {
                clearInterval(interval);
                msg.edit("Votação finalizada");

                pollResult.execute(message, pollKey);
            }
        }, 1000);
    },
};
