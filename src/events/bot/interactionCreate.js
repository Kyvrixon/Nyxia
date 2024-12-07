import {
	EmbedBuilder
} from "discord.js";
import { errEmbed } from "../../utils/embeds.js";
import Logger from "../../utils/logger.js"

export default {
	name: "interactionCreate",
	once: false,

	async init(client, interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands?.get(interaction.commandName);
		if (!command) {
			return interaction.reply({
				embeds: [errEmbed("Hmm.. seems like this command does not exist", null, null, "interesting...")],
				ephemeral: true,
			});
		}

		try {
			await command.init(client, interaction);
		} catch (error) {
			Logger.error("interactionCreate", error.message, error)
			const replyOptions = { content: null, embeds: [errEmbed("I did my best but I couldn't find what caused this error :frowning2:", error, interaction)], ephemeral: false };
			
			try {
				if (interaction.replied) {
					// Interaction has already been replied to
					await interaction.followUp(replyOptions);
				} else if (interaction.deferred) {
					// Interaction has been deferred, but not yet replied
					await interaction.followUp(replyOptions);
				} else {
					// Interaction has not been replied to or deferred yet
					await interaction.reply(replyOptions);
				}
			} catch {
				await interaction.channel.send({
					embeds: [errEmbed("I did my best but I couldn't find what caused this error :frowning2:", error, interaction)]
				});
			}
		}
	},
};
