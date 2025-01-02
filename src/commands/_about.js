import { SlashCommandBuilder, MessageFlags } from "discord.js";
import { basicEmbed } from "#utils/embeds.js";

export default {
	dev: false,
	owner: false,
	beta: true,

	data: new SlashCommandBuilder()
		.setName("about")
		.setDescription("❓Learn about me!"),

	async init(client, interaction) {
		// format desc
		const desc = "";
		const arrayFields = [
			{
				name: "",
				value: "",
				inline: true,
			},
		];

		return interaction.reply({
			embeds: [
				basicEmbed(
					"About me!",
					desc,
					arrayFields,
					"#f3b3c3",
					null,
					null,
					null,
					null,
					null
				),
			],
			flags: MessageFlags.Ephemeral,
		});
	},
};
