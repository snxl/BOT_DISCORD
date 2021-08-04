import { Message } from "discord.js";
import { getArgsFromMsg } from "./utils/utils";

import test from "./commands/test";
import poll from "./commands/poll";

export default (message: Message) => {
	const args = getArgsFromMsg(message.content);
	const cmd = args[0];

	if (cmd === test.name) return test.run(message);
	if (cmd === poll.name) return poll.run(message);

	return message.reply("comando não encontrado.");
};
