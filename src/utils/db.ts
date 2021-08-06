import fs from "fs";
import path from "path";

const pollsFilePath = path.resolve(__dirname, "polls.json");

export type OptionsObj = { name: string; reactionEmoji: string; count: number }[];
type Poll = {
	msgId: string;
	title: string;
	options: OptionsObj;
	voters?: string[]
};

export const createPoll = (
	msgId: string,
	title: string,
	options: OptionsObj
) => {
	const currentPolls: Poll[] =
		JSON.parse(fs.readFileSync(pollsFilePath, "utf-8")) ?? [];
	const newPoll: Poll = {
		msgId,
		title,
		options,
	};

	fs.writeFileSync(pollsFilePath, JSON.stringify([...currentPolls, newPoll]));
};

export const pollExists = (msgId: string): boolean => {
	if (!fs.existsSync(pollsFilePath)) return false;
	return (
		(JSON.parse(fs.readFileSync(pollsFilePath, "utf-8")) as Poll[])?.some(
			(poll) => poll.msgId === msgId
		) ?? false
	);
};

export const vote = (
	msgId: string,
	userId: string,
	reactionEmoji: string
): [Poll, (newMsgId: string) => void] => {
	const currentPolls: Poll[] =
		JSON.parse(fs.readFileSync(pollsFilePath, "utf-8")) ?? [];

	const poll = currentPolls.find((poll) => poll.msgId === msgId);

	const updatedPoll: any = {
		...poll,
		voters: poll?.voters ? [...poll.voters, userId] : [userId],
		options: poll?.options.map((option) => {
			return option.reactionEmoji === reactionEmoji
				? { ...option, count: option.count + 1 }
				: option;
		}),
	};
	return [
		updatedPoll,
		(newMsgId) => {
			const updatedPolls: any = currentPolls.map((poll) => {
				if (poll.msgId === msgId) {
					return { ...updatedPoll, msgId: newMsgId };
				}
				return poll;
			});
			fs.writeFileSync(pollsFilePath, JSON.stringify(updatedPolls));
		},
	];
};

export const hasVoted = (msgId: string, userId: string): boolean => {
	const currentPolls: Poll[] =
		JSON.parse(fs.readFileSync(pollsFilePath, "utf-8")) ?? [];
	const poll = currentPolls.find((poll) => poll.msgId === msgId);
	return Boolean(poll?.voters?.includes(userId));
}
