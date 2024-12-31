import { SlashCommandBuilder } from "discord.js";
import { basicEmbed } from "../utils/embeds.js";

export default {
	dev: false,
	owner: false,
	beta: true,

	data: new SlashCommandBuilder()
		.setName("about")
		.setDescription("❓Learn about me!"),

	async init(client, interaction) {
		return interaction.reply({
			embeds: [
				basicEmbed(
					"AFK Set!",
					"> Your AFK has been successfully set, enjoy your break!",
					null,
					"Green",
					null,
					"Just a reminder your AFK affects ALL servers you share with me!",
					null,
					null,
					null
				),
			],
			ephemeral: true,
		});
	},
};
