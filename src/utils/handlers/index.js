import * as afkHandler from "./afkHandler.js";

const handler = {
	/**
	 * The AFK Handler.
	 *
	 * @param {import('discord.js').Client} client - the bot client, what else would it be?
	 * @param {import('discord.js').Message || import('discord.js').BaseInteraction} source
	 */
	afk: async (client, source) => {
		return await afkHandler(client, source);
	},
};

export default handler;
