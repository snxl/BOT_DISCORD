export const getArgsFromMsg = (content: string) =>
	content
		.slice(1)
		.split(" ")
		.map((v, i) => i === 0 ? v.trim().toLowerCase() : v.trim());
