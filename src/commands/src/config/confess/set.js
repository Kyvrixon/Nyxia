import { basicEmbed, errEmbed } from "#utils/embeds.js";
import guildModel from "#models/guild.js";
import { checkPermissions, getEmoji } from "#utils/functions.js";
import { MessageFlags } from "discord.js";

export default async (client, interaction) => {
	if (
		!(await checkPermissions(
			[],
			["ManageGuild"],
			interaction,
			"user",
			"self",
			null
		))
	) {
		return await interaction.reply({
			embeds: [
				errEmbed(
					"You do not have permission to use this command! You must have **ManageGuild** or admininstrator!",
					null,
					interaction,
					"No permission"
				),
			],
			flags: MessageFlags.Ephemeral,
		});
	}

	let data = await guildModel.findOne({ guild: interaction.guild.id });
	const type = interaction.options.getString("type");
	const channel = interaction.options.getChannel("channel").id;

	if (
		!(await checkPermissions(
			["SendMessages", "ViewChannel", "ReadMessageHistory"],
			[],
			interaction,
			"user",
			"self",
			channel
		))
	) {
		return interaction.reply({
			embeds: [
				errEmbed(
					`I need **SendMessages**, **ViewChannel** and **ReadMessageHistory** permissions in <#${channel}>! I am missing one, two or all 3 of those permissions!`
				),
			],
		});
	}

	const logsEnabled = interaction.options.getBoolean("logs-enabled") || true;

	if (!data) {
		data = new guildModel({
			guild: interaction.guild.id,
			configs: {
				confess: {},
			},
		});
	}

	if (type === "main") {
		data.configs.confess.channel = channel;
	} else if (type === "logs") {
		data.configs.confess.logs.channel = channel;
		data.configs.confess.logs.enabled = logsEnabled;
	}

	await data.save();

	const desc =
		`**Target Channel:** <#${data.configs.confess.channel}>\n` +
		`**Logs:** ${data.configs.confess.logs.channel ? `<#${data.configs.confess.channel}>` : "`Not set`"} \`|\` ${data.configs.confess.logs.enabled ? `${data.configs.confess.logs.enabled}` : "`Not set`"}`;
	const embed = basicEmbed(
		getEmoji("cog") + " Confessions Set!",
		desc,
		null,
		"Green",
		null,
		null,
		null,
		null,
		null
	);

	return interaction.reply({
		embeds: [embed],
		flags: MessageFlags.Ephemeral,
	});
};
