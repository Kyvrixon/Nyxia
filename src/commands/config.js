import { SlashCommandBuilder, ChannelType } from "discord.js";
import { handleCmd } from "#utils/functions.js";
import { errEmbed } from "#utils/embeds.js";
import Logger from "../utils/logger";

export default {
	dev: false,
	owner: false,
	beta: true,
	desc: "Test commands for the bot",
	category: "Config",

	data: new SlashCommandBuilder()
		.setName("config")
		.setDescription("⚙️ Modify configurations")

		.addSubcommand((subcommand) =>
			subcommand
				.setName("view")
				.setDescription("⚙️ View the current configurations")
		)

		.addSubcommandGroup((x) =>
			x
				.setName("confess")
				.setDescription("Config the confession system")

				.addSubcommand((x) =>
					x
						.setName("set")
						.setDescription("Set a value in the confessions system")

						.addStringOption((x) =>
							x
								.setName("type")
								.setDescription("What type?")
								.addChoices(
									{ name: "Target Channel", value: "target" },
									{ name: "Log Channel", value: "logs" }
								)
								.setRequired(true)
						)

						.addChannelOption((x) =>
							x
								.setName("channel")
								.setDescription("Channel")
								.addChannelTypes(ChannelType.GuildText)
								.setRequired(true)
						)
				)
		),
	async init(client, interaction) {
		try {
			await handleCmd(client, interaction);
			return;
		} catch (e) {
			Logger.error("/config", "Failed to run command: " + e.message, e);
			return interaction.reply({
				embeds: [
					errEmbed(
						"Something went wrong while executing this command",
						e,
						interaction
					),
				],
			});
		}
	},
};
