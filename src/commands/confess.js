import { SlashCommandBuilder } from "discord.js";
import { handleCmd } from "../utils/functions.js";
import { errEmbed } from "../utils/embeds.js";

export default {
	dev: false,
	owner: false,
	beta: true,
	desc: "Test commands for the bot",
	category: "Config",

	data: new SlashCommandBuilder()
		.setName("confess")
		.setDescription("🤫 Have fun with confessions!")

		.addSubcommand((x) =>
			x.setName("send").setDescription("🤫 Send a confession")
		),
	async init(client, interaction) {
		try {
			await handleCmd(client, interaction);
			return;
		} catch (e) {
			try {
				return interaction.editReply({
					embeds: [
						errEmbed(
							"Something went wrong while executing this command",
							e,
							interaction
						),
					],
				});
			} catch {
				return interaction.channel.send({
					embeds: [
						errEmbed(
							"Something went wrong while executing this command",
							e,
							interaction
						),
					],
				});
			}
		}
	},
};
