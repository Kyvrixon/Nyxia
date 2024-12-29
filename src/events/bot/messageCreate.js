import userModel from "../../models/user.js";
import { basicEmbed } from "../../utils/embeds.js";
import AFK from "../../utils/handlers/afk";

export default {
	name: "messageCreate",
	once: false,

	async init(client, message) {
		if (!message || message.bot || !message.guild) return;

		checkAfk();











		async function checkAfk() {
			const isInAfk = await AFK.check(message.user);
			if (isInAfk) {
				try {
					await message.channel.send(
						{
							embeds: [
								basicEmbed(
									null,
									"> Welcome back! Your AFK has been removed!",
									null,
									"Green",
									null,
									null,
									null,
									null,
									null
								)
							]
						}
					)
				} catch { };

				await userModel.updateOne(
					{ user: message.author.id },
					{ $unset: { afk: 1 } }
				);
			}
		}
	}
}