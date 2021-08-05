import { Message } from "discord.js";
import { getArgsFromMsg } from "./utils/utils";
import fs from "fs";
import path from "path";

const commandsPath = path.resolve(__dirname, "./commands");
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".ts"));

type Command = {
	name: string;
	description: string;
	run: (message: Message) => Promise<void>;
};

export const commands: any = {
	has(name: string) {
		return Boolean(this[name]);
	},
};

commandFiles.forEach((fileName) => {
	const command = require(path.join(commandsPath, fileName))
	commands[fileName.slice(0, -3)] = { ...command.default};
});

export default async (message: Message) => {
	const args = getArgsFromMsg(message.content);
	const cmdName = args[0];

	if (!commands.has(cmdName))
		return await message.reply("comando não encontrado.");

	try {
		await (commands[cmdName] as Command).run(message);
	} catch (err) {
		console.log(err);
		await message.reply("algo deu errado.");
	}
};
