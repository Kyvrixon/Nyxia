import { SlashCommandBuilder } from "discord.js";
import { basicEmbed } from "../utils/embeds.js";

export default {
	dev: false,
	owner: false,
	beta: false,

	data: new SlashCommandBuilder()
		.setName("dev")
		.setDescription("🔨 Developer Commands")

		.addSubcommand((x) =>
			x
				.setName("reload-cmds")
				.setDescription("🔁 Reload and recache commands")
		),

	async init(client, interaction) {
		// get optionsku
		// ...

		// log input and output to a channel
		// ...

		// final int. reply with output
		return interaction.reply({
			embeds: [basicEmbed()],
			ephemeral: true,
		});
	},
};
