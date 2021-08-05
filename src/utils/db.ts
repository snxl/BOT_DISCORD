import fs from "fs";
import path from 'path';

const pollsFilePath = path.resolve(__dirname, "polls.json")

type Poll = {
	msgId: string;
	question: string;
	options: { name: string; reactionIcon: string; count: number }[];
};

export const createPoll = (msgId: string) => {
	fs.writeFileSync(
		pollsFilePath,
		JSON.stringify([
			{
				msgId,
				question: "É verdade?",
				options: [
					{ name: "Sim", reactionIcon: "👍", count: 0 },
					{ name: "Não", reactionIcon: "👎", count: 0 },
				],
			},
		])
	);
};

export const pollExists = (msgId: string) => {
	if (!fs.existsSync(pollsFilePath)) return false;
	return (
		(JSON.parse(fs.readFileSync(pollsFilePath, 'utf-8')) as Poll[])?.some(
			(poll) => {
                console.log("From JSON:", poll.msgId)
                console.log("From MSG:", msgId)
                return poll.msgId === msgId
            }
		) ?? false
	);
};

export const updatePoll = (msgId: string, optionName: string): (Poll | undefined) => {
	const currentPolls: Poll[] = JSON.parse(
		fs.readFileSync(pollsFilePath, "utf-8")
	);

	let currentPoll;

	const updatedPolls = currentPolls.map((poll) => {
		if (poll.msgId === msgId) {
			poll.options = poll.options.map((option) =>
				option.name === optionName
					? { ...option, count: option.count + 1 }
					: option
			);

			currentPoll = poll;
			return poll;
		}
		return poll;
	});

	fs.writeFileSync(pollsFilePath, JSON.stringify(updatedPolls));
	return currentPoll;
};
