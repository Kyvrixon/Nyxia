import AFK from "../../utils/handlers/afk.js";
import afkHandler from "../../utils/handlers/afkHandler.js";

export default {
	name: "messageCreate",
	once: false,

	async init(client, message) {
		if (!message || message.bot || !message.guild) {
			return;
		}

		if (message.content === "ABC123") {
			await AFK.set(
				message.author,
				Date.now(),
				"testing afk reason message"
			);
			await message.reply("temp afk set");
			return;
		}

		afkHandler(client, message);
	},
};
