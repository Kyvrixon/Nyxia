import { SlashCommandBuilder, MessageFlags } from "discord.js";
import { basicEmbed } from "#utils/embeds.js";

export default {
	dev: false,
	owner: false,
	beta: false,

	data: new SlashCommandBuilder()
		.setName("dev")
		.setDescription("🔨 Developer Commands")

		// rlly dunno if this command is needed at all
		.addSubcommand((x) =>
			x
				.setName("reload-cmds")
				.setDescription("🔁 Reload and recache commands")
		),

	async init(client, interaction) {
		// check if user is dev. if not errEmbed(..., null, ...)

		// final int. reply with output
		return interaction.reply({
			embeds: [basicEmbed()],
			flags: MessageFlags.Ephemeral,
		});
	},
};
