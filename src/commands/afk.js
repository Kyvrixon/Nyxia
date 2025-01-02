import { SlashCommandBuilder, MessageFlags } from "discord.js";
import { basicEmbed } from "#utils/embeds.js";
import AFK from "#utils/afk.js";

export default {
	dev: false,
	owner: false,
	beta: false,

	data: new SlashCommandBuilder()
		.setName("afk")
		.setDescription("💤 Set your AFK status!")

		.addStringOption((x) =>
			x.setName("message").setDescription("what is your AFK message?")
		),

	async init(client, interaction) {
		await AFK.set(
			interaction.user,
			Date.now(),
			interaction.options.getString("message") || "None given."
		);

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
			flags: MessageFlags.Ephemeral,
		});
	},
};
