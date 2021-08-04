export const getArgsFromMsg = (content: string) =>
	content
		.slice(1)
		.split(" ")
		.map((v) => v.trim());
