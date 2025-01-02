import { SlashCommandBuilder } from "discord.js";
import { handleCmd } from "#utils/functions.js";
import Logger from "#utils/logger";

export default {
	dev: true,
	owner: false,
	beta: true,
	desc: "Test commands for the bot",
	category: "Testing",

	data: new SlashCommandBuilder()
		.setName("tests")
		.setDescription("test commands")

		.addSubcommand((subcommand) =>
			subcommand.setName("lb").setDescription("description")
		)

		.addSubcommand((subcommand) =>
			subcommand.setName("error").setDescription("description")
		),

	async init(client, interaction) {
		try {
			await handleCmd(client, interaction);
			return;
		} catch (e) {
			Logger.error("/tests", "Failed to run command: " + e.message, e);
			return interaction.reply("something went wrong");
		}
	},
};
