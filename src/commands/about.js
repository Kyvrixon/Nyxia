import { SlashCommandBuilder } from "discord.js";
import { basicEmbed } from "#utils/embeds.js";

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
					null,
					"sDUIFgsifgEIFGoegfOUEWGFOUwgef",
					null,
					"Yellow",
					null,
					null,
					null,
					null,
					null
				),
			],
			ephemeral: true,
		});
	},
};
