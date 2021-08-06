
import { Message, MessageAttachment } from 'discord.js';
import path from "path"
import { MessageEmbed } from 'discord.js';

const img = path.resolve(__dirname, "../utils/image.png")

export default {
    name: "image",
    description: "send some image",
    async run(message: Message) {  
        const file = new MessageAttachment(img);
        const embedImg: any = new MessageEmbed()
        .setImage('attachment://image.png');
        await message.channel.send({ embed: embedImg, files: [file] })
    }
}