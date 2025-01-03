import guildModel from "#models/guild.js";
import { basicEmbed, errEmbed } from "#utils/embeds.js";
import {
	MessageFlags,
	ModalBuilder,
	TextInputBuilder,
	ActionRowBuilder,
	TextInputStyle,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import confessModel from "#models/confession.js";
import { generateId, getInvite } from "#utils/functions.js";
import Logger from "#utils/logger.js";

export default async (client, interaction) => {
	try {
		const genId = generateId(6);
		let confessMessage = "";
		let confessUrl = "";

		const [serverInvite, data] = await Promise.all([
			getInvite(interaction.guild, null),
			guildModel.findOne({ guild: interaction.guild.id }),
		]);

		if (!data || !data.configs.confess.channel) {
			return interaction.reply({
				embeds: [
					errEmbed(
						"Confessions haven't been setup in this server! Please contact a staff member.",
						null,
						interaction,
						"No Configuration"
					),
				],
				flags: MessageFlags.Ephemeral,
			});
		}

		const config = data.configs.confess;
		const channel =
			interaction.guild.channels.cache.get(config.channel) ||
			(await client.channels.fetch(config.channel).catch(() => null));
		const logChannel =
			client.channels.cache.get("1324563700631208079") ||
			(await client.channels.fetch("1324563700631208079"));

		if (!channel) {
			return interaction.reply({
				embeds: [
					errEmbed(
						"Hm, seems like the channel that was used to setup confessions doesn't exist anymore",
						null,
						interaction,
						"Invalid Channel"
					),
				],
				flags: MessageFlags.Ephemeral,
			});
		}

		const modal = new ModalBuilder()
			.setCustomId("confess_modal")
			.setTitle("Confession")
			.addComponents(
				new ActionRowBuilder().addComponents(
					new TextInputBuilder()
						.setCustomId("confession_msg")
						.setLabel("What is your confession?")
						.setStyle(TextInputStyle.Paragraph)
						.setPlaceholder("You have 5 minutes to type")
						.setRequired(true)
				)
			);

		await interaction.showModal(modal);
		const modalSubmit = await interaction
			.awaitModalSubmit({ time: 5 * 60 * 1000 })
			.catch(() => null);

		if (modalSubmit) {
			confessMessage =
				modalSubmit.fields.getTextInputValue("confession_msg");
			await modalSubmit.reply({
				embeds: [
					basicEmbed(
						null,
						"Confession sent!",
						null,
						"Green",
						null,
						null,
						null,
						null,
						null
					),
				],
				flags: MessageFlags.Ephemeral,
			});
			// await modalSubmit.deferUpdate(); 
		} else {
			return interaction.reply({
				embeds: [
					errEmbed(
						"You took too long!",
						null,
						interaction,
						"Component Expired"
					),
				],
				flags: MessageFlags.Ephemeral,
			});
		}

		const footertext =
			"ID: " + genId + ' | Use "/confess report" to report a confession!'; // eslint-disable-line quotes

		const embed = basicEmbed(
			"Confession",
			`${confessMessage}`,
			null,
			"#F3B3C3",
			null,
			footertext,
			null,
			null,
			null
		);

		try {
			const msg = await channel.send({ embeds: [embed] });
			confessUrl = msg?.url;
		} catch (e) {
			Logger.error(
				"/confess send",
				"Failed to send message: " + e.message,
				e
			);
			return interaction.editReply({
				embeds: [
					errEmbed(
						"There was a problem sending messages to the confession channel! Please contact a staff member, I might be missing permissions. If you cannot figure out the solution please join my support server.",
						null,
						interaction,
						"Oops.. something went wrong"
					),
				],
			});
		}

		const confessMetadata = new confessModel({
			guildId: interaction.guild.id,
			ID: genId,
			meta: {
				reported: false,
				deleted: false,
				url: confessUrl,
			},
		});

		await confessMetadata.save();

		const fields = [
			{
				name: "__Message__",
				value: confessMessage,
			},
		];

		const desc =
			`> - **ID:** ${genId}\n` +
			`> - **Where:** [${interaction.guild.name}]( ${serverInvite} )`;

		const logEmbed = basicEmbed(
			"Confession",
			desc,
			...fields,
			"#2f3136",
			{
				name: (
					interaction.user.username +
					" | " +
					interaction.user.id
				).toString(),
				iconURL: interaction.user.displayAvatarURL() || null,
			},
			null,
			null,
			null,
			null
		);

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel("Jump to message")
				.setURL(confessUrl),
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel("Join server")
				.setURL(serverInvite)
		);
		await logChannel.send({
			embeds: [logEmbed],
			components: [row],
		});

		return;
	} catch (e) {
		Logger.error("/confess send", "Something went wrong: " + e.message, e);
		console.error(e.stack); // eslint-disable-line no-console
		return;
	}
};
