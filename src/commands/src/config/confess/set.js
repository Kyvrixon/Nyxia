import { errEmbed } from "../../../utils/embeds.js";
import guildModel from "../../../models/guild.js";
import { checkPermissions } from "../../../utils/functions.js";

export default async (client, interaction) => {
	if (
		!(await checkPermissions(
			[],
			["ManageGuild"],
			interaction,
			"user",
			"self"
		))
	) {
		return await interaction.reply({
			embeds: [
				errEmbed(
					"You do not have permission to use this command! You must have **ManageGuild** or higher.",
					null,
					interaction,
					"No permission"
				),
			],
			ephemeral: true,
		});
	}

	const data = await guildModel.findOne({ guild: interaction.guild.id });
	if (!data.configs.confess.channel) {
		data.configs.confess.channel =
			interaction.options.getChannel("channel");
	}
};
