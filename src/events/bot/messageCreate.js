export default {
	name: "messageCreate",
	once: false,

	async init(client, message) {
        if (!message || message.bot || !message.guild) return;
    }
}