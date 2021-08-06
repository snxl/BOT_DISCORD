import path from "path";
import nodeHtmlToImage from "node-html-to-image";

const imagePath = path.resolve(__dirname, "image.png");

const colors = ["blue", "red", "green", "purple"];
const alphabet = ["A", "B", "C", "D", "E"];

export default async (title: string, options: { name: string; count: number }[]): Promise<string> => {

	// const options = [
	// 	{ name: "Opção 1", count: 1 },
	// 	{ name: "Opção 2", count: 0 },
	// 	{ name: "Opção 3", count: 1 },
	// 	{ name: "Opção 4", count: 1 },
	// ];

	const totalVotes = Object.values(options).reduce(
		(acc, curr) => acc + curr.count,
		0
	);
	const getPercentage = (value: number) => ((value * 100) / totalVotes).toFixed() + "%";

	// templates -----------------------------------
	// const title = "Qual opção escolher?";

	const headTemplate = `<head>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Georama:wght@400;600&display=swap');
    html {
        font-size: 62.5%;
    }
    
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    
    body {
        font-family: 'Georama', sans-serif;
        width: fit-content;
        height: fit-content;
    }
    
    .content {
        min-height: 200px;
        min-width: 300px;
        height: fit-content;
        width: fit-content;
        padding: 3rem;
        display: flex;
        flex-direction: column;
        background-color: white;
    }
    
    .content h1 {
        font-size: 2rem;
        text-align: center;
        color: rgb(93 97 239);
    }
    
    .content ul {
        margin-top: 2rem;
        font-size: 1.5rem;
        text-align: start;
    }
    
    .content ul li {
        list-style: none;
        margin: 1.5rem 0;
        display: flex;
        flex-wrap: wrap;
    }
    
    .content ul li div:first-child span {
        display: inline-block;
        background-color: rgb(224, 224, 224);
        color: blue;
        width: 3ch;
        height: 3ch;
        border-radius: 50%;
        padding: .5rem;
        text-align: center;
        font-weight: bold;
        margin-right: 1rem;
    }
    
    .content ul li div:first-child {
        width: 30%;
        display: flex;
        align-items: center;
        width: fit-content;
    }
    
    .content ul li div:nth-child(2) {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: end;
        width: 70%;
        width: fit-content;
        display: block;
        color: blue;
        margin: auto 0 auto auto;
    }
    
    .content ul li div:nth-child(3) {
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
            <div><span style="color: ${colors[i]};">${alphabet[i]}</span>${
                        option.name
                    }</div>
            <div style="color: ${colors[i]};">${totalVotes ? getPercentage(option.count) : 0}</div>
            <div style="background-color: ${colors[i]}; margin-right: ${totalVotes ? `calc(100% - ${getPercentage(option.count)})` : "0"};"></div>
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
