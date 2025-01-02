import { basicEmbed, errEmbed } from "#utils/embeds.js";
import guildModel from "#models/guild.js";
import {
	createLeaderboard,
	getEmoji,
	checkPermissions,
	delay,
} from "#utils/functions.js";
import { MessageFlags } from "discord.js";

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
					"You do not have permission to use this command! You must have **Manageguild** or higher.",
					null,
					interaction,
					"No permission"
				),
			],
			flags: MessageFlags.Ephemeral,
		});
	}

	await interaction.reply({
		embeds: [
			basicEmbed(
				null,
				`${getEmoji("loading")} Loading data. This may take a while...`,
				null,
				null,
				null,
				null,
				new Date(),
				null,
				null
			),
		],
	});

	let config;
	const guildData = await guildModel.findOne({ guild: interaction.guild.id });
	if (!guildData) {
		const data = await guildModel.create({ guild: interaction.guild.id });
		config = data.configs;
		return interaction.editReply({
			embeds: [
				errEmbed(
					"No configuration data has been found for this server so default data has been created. Run the command again to see the changes.",
					null,
					interaction,
					"No data"
				),
			],
		});
	} else {
		config = guildData.configs;
	}

	const listArray = [];
	let general = "";
	let confessions = "";

	// build entries
	general =
		"## General\n" +
		`**Main chat:** ${config.general?.mainChat ? `<#${config.general?.mainChat}>` : "`Not set`"}\n` +
		`**Main role:** ${config.general?.mainRole ? `<@&${config.general?.mainRole}>` : "`Not set`"}\n` +
		`**Timezone:** ${config.general.timezone ?? "`Not set`"}\n`;

	confessions =
		"## Confessions\n" +
		`**Channel:** ${config?.confessions?.channel ? `<#${config.confessions.channel}>` : "`Not set`"}\n` +
		`**Log Channel:** ${config.confessions?.log ? `<#${config.confessions.log}>` : "`Not set`"}\n`;

	listArray.push(general, confessions);

	await delay(Math.floor(Math.random() * 10) + 1);

	return await createLeaderboard(
		"Current Configurations",
		listArray,
		interaction,
		1
	);
};
