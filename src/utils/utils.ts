export const getArgsFromMsg = (content: string) =>
	content
		.slice(1)
		.split(" ")
		.map((v, i) => (i === 0 ? v.trim().toLowerCase() : v.trim()));

export const pollArgsToObj = (
	args: string[]
): { title: string; options: string[] } => {
	const splitted = args?.join(" ").split("?");
	const options = splitted[1].split(";").map(o => o.trim()).filter(f => f);
	return {
		title: splitted[0] + "?",
		options:
			options.length === 1
				? []
				: options.map((v) => v.trim()),
	};
};
