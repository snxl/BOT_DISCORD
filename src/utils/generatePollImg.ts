import path from "path";
import nodeHtmlToImage from "node-html-to-image";

const imagePath = path.resolve(__dirname, "image.png");

const colors = ["#EF476F", "#77dd77", "#06D6A0", "#118AB2", "#89cff0", "#F5D6BA", "#836953", "#B39EB5", "#B2FBA5", "#AAF0D1"];
const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

export default async (title: string, options: { name: string; count: number }[]): Promise<string> => {
	const totalVotes = Object.values(options).reduce(
		(acc, curr) => acc + curr.count,
		0
	);
	const getPercentage = (value: number) => ((value * 100) / totalVotes).toFixed() + "%";

	const headTemplate = `<head>
    <style>
    html {
        font-size: 62.5%;
    }

    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Roboto', sans-serif;
        width: fit-content;
        height: fit-content;
    }

    .content {
        min-height: 200px;
        width: 300px;
        height: fit-content;
        padding: 3rem;
        display: flex;
        flex-direction: column;
        background-color: white;
    }

    .content h1 {
        font-size: 2rem;
        text-align: center;
    }

    .content ul {
        margin-top: 2rem;
        font-size: 1.5rem;
        text-align: start;
    }

    .content ul li {
        list-style: none;
        margin: 1.5rem 0 0 0;
        display: flex;
        flex-wrap: wrap;
    }

    .option {
        flex: 5;
        display: flex;
        align-items: center;
    }

    .index {
        align-self: flex-start;
        background-color: rgba(224, 224, 224, .6);
        color: blue;
        width: 3ch;
        height: 3ch;
        aspect-ratio: 1;
        border-radius: 50%;
        padding: .5rem;
        text-align: center;
        font-weight: bold;
        margin-right: 1rem;
    }

    .percentage {
        flex: 1;
        width: fit-content;
        display: block;
        color: blue;
        margin: auto 0 0 .5rem;
    }

    .bar {
        display: block;
        width: 100%;
        margin-top: .3rem;
        height: .5em;
        background-color: blue;
        border-radius: .5em;
    }
</style>
    </head>`;

	const optionsTemplate = options
		.map(
			(option, i) => `
        <li>
            <div class="option">
                <div class="index" style="color: ${colors[i]};">${alphabet[i]}</div>
                <div class="option">${option.name}</div>
                <div class="percentage" style="color: ${colors[i]};">${totalVotes ? getPercentage(option.count) : ""}</div>
            </div>
            <div class="bar" style="background-color: ${colors[i]}; margin-right: ${totalVotes ? `calc(100% - ${getPercentage(option.count)})` : "100%"};"></div>
        </li>`
		)
		.join("");

	try {
        await nodeHtmlToImage({
            output: imagePath,
            html: `
        <html>
        ${headTemplate}
        <body>
            <div class="content">
                <h1>${title}</h1>
                <ul>
                    ${optionsTemplate}
                </ul>
            </div>
        </body>
        </html>`,
        })
        return imagePath
    } catch (err) {
        throw new Error("Algo deu errado na geração da imagem.")
    }    
};
