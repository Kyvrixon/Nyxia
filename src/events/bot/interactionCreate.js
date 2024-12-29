import { errEmbed } from "../../utils/embeds.js";
import Logger from "../../utils/logger.js";
import { handleCmd, devCheck } from "../../utils/functions.js";

export default {
	name: "interactionCreate",
	once: false,

	async init(client, interaction) {
		if (
			!interaction.isChatInputCommand() ||
			!client ||
			!interaction
		) return;

		try {
			const command = client.commands?.get(interaction.commandName);
			if (!command) {
				try {
					await handleCmd(client, interaction);
				} catch (e) {
					Logger.error("interactionCreate", "Failed to initiate command: " + interaction?.commandName, e);
					return interaction?.channel?.send({
						embeds: [
							errEmbed(`Failed to run command ${interaction?.commandName ?? undefined}. Please contact the developer.`, e, interaction, "Failed to initiate command")
						]
					})
				}
			}

			if (command.beta && interaction.guild.id !== "1125196330646638592") {
				return interaction.reply(
					{
						embeds: [
							errEmbed(
								"You aren't authorised to use this command",
								null,
								interaction,
								"Unauthorised"
							)
						],
						ephemeral: true
					}
				)
			}

			return await command.init(client, interaction);
		} catch (error) {
			if (error.message === "Unknown Message") {};
			Logger.error("interactionCreate", error.message, error);
		}
	}
};
