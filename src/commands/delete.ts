import { Message } from 'discord.js';

export default {
    name: "delete",
    description: "Delete the sent message",
    async run(message: Message) {
       await message.delete();
    }
}