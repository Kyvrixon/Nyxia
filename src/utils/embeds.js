import {
	ActionRowBuilder,
	BaseInteraction,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ChannelSelectMenuInteraction,
	CommandInteraction,
	ContextMenuCommandInteraction,
	EmbedBuilder,
	MentionableSelectMenuInteraction,
	Message,
	ModalSubmitInteraction,
	RoleSelectMenuInteraction,
	StringSelectMenuInteraction,
	UserSelectMenuInteraction,
} from "discord.js";
import { client } from "../bot.js";
import { footer, getInvite, isValidColour } from "./functions.js";
import Logger from "./logger.js";

/**
 * Creates an error embed message.
 *
 * @param {string} message - The message content of the embed.
 * @param {Error} error - The error object. Is allowed to be null.
 * @param {object} source - The source object that triggered for example interaction or message.
 * @returns {import('discord.js').EmbedBuilder} EmbedBuiler instance.
 */
export const errEmbed = (
	message,
	e,
	s,
	title = "Oops.. something went wrong"
) => {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let code = "";
	for (let i = 0; i < 10; i++) {
		code += characters.charAt(
			Math.floor(Math.random() * characters.length)
		);
	}

	const embedReply = new EmbedBuilder()
		.setColor(e ? "Red" : "Orange")
		.setTitle(title)
		.setDescription(`> ${message}`)
		.setFooter(footer());

	if (e && s) {
		embedReply
			.setDescription(`\`\`\`\n${message}\`\`\``)
			.setAuthor({ name: `Error ID: ${code}` })
			.addFields({
				name: "__Error Help__",
				value: "> If the error affects functionality, join our support server, open a ticket, and share the **Error ID**. A dev may join to investigate, please grant necessary permissions they request. Use `/auth-check` to verify their identity first.",
				inline: false,
			});
	}

	sendLog(e, s);
	return embedReply;

	async function sendLog(error, source) {
		if (!error || !source) {
			return;
		}

		if (
			(!source) instanceof Message ||
			(!source) instanceof BaseInteraction
		) {
			return Logger.error(
				"function errEmbed",
				"Source object isnt of BaseInteraction or Message",
				error
			);
		}

		let cmdValueString = "";
		if (source instanceof CommandInteraction) {
			let group = null,
				sub = null;
			try {
				group = source.options.getSubcommandGroup();
			} catch {
				group = null;
			}
			try {
				sub = source.options.getSubcommand();
			} catch {
				sub = null;
			}

			const commandInfo = {
				subcommandGroup: group,
				subcommand: sub,
			};
			cmdValueString = `> \`/${source.commandName} ${commandInfo.subcommandGroup ? `${commandInfo.subcommandGroup} ` : ""}${commandInfo.subcommand || ""}\``;
		} else if (source instanceof ContextMenuCommandInteraction) {
			cmdValueString = `> \`/${source.commandName}\``;
		} else if (source instanceof ModalSubmitInteraction) {
			cmdValueString = `> \`Modal: ${source.customId}\``;
		} else if (
			source instanceof StringSelectMenuInteraction ||
			source instanceof UserSelectMenuInteraction ||
			source instanceof RoleSelectMenuInteraction ||
			source instanceof MentionableSelectMenuInteraction ||
			source instanceof ChannelSelectMenuInteraction
		) {
			cmdValueString = `> \`Select Menu: ${source.customId}\``;
		} else if (source instanceof ButtonInteraction) {
			cmdValueString = `> \`Button: ${source.customId}\``;
		} else {
			cmdValueString = "> `Unknown Interaction Type`";
		}

		const embedLog = new EmbedBuilder()
			.setTitle("An error occurred")
			.setDescription(
				`__**Error Message:**__ \`\`\`\n${error?.message}\`\`\`\n__**Stack Trace:**__ \`\`\`\n${error?.stack}\`\`\``
			)
			.addFields(
				{
					name: "__Error Code__",
					value: `> \`${code}\``,
					inline: true,
				},
				{
					name: "__Server__",
					value: `> \`${source?.guild?.name}\``,
					inline: true,
				},
				{
					name: "__User__",
					value: `> \`${source instanceof Message ? source?.author?.username : source?.user?.username}\``,
					inline: true,
				},
				{
					name: "__Channel__",
					value: `> \`${source?.channel?.name || "Cannot find channel"}\`\n> <#${source?.channel?.id}>`,
					inline: true,
				},
				{
					name: "__Timestamp__",
					value: `> <t:${Math.floor(new Date().getTime() / 1000)}:f>`,
					inline: true,
				},
				{
					name: "__Command/Interaction__",
					value: cmdValueString,
					inline: true,
				}
			);

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setURL(await getInvite(source.guild, source.channel))
				.setLabel("Click to join the server")
		);

		const logChannel =
			client.channels.cache.get("1322722379113300018") ||
			(await client.channels.fetch("1322722379113300018"));
		try {
			await logChannel.send({ embeds: [embedLog], components: [row] });
		} catch (err) {
			Logger.error(
				"function errEmbed",
				"Failed to log an error: " + err.message,
				err
			);
			return;
		}
	}
};

/**
 * Creates a basic embed
 *
 * @param {string} [title=null] - title
 * @param {string} [description=" "] - description
 * @param {Array<Object>} [fields=[]] - array of fields
 * @param {string} [colour="DarkButNotBlack"] - colour
 * @param {Object|null} [author=null] - author
 * @param {string|null} [footerText=null] - (optional) footer text
 * @param {boolean} [timestamp=null] - timestamp
 * @param {string|null} [thumbnail=null] - thumbnail
 * @param {string|null} [image=null] - image
 * @returns {EmbedBuilder} - embed object
 */
export const basicEmbed = (
	title,
	description,
	fields,
	colour,
	author,
	footerText,
	timestamp,
	thumbnail,
	image
) =>
	new EmbedBuilder()
		.setAuthor(author || null)
		.setTitle(title || null)
		.setDescription(description || " ")
		.setFooter(footer(footerText))
		.addFields(Array.isArray(fields) ? fields : [])
		.setColor(isValidColour(colour) ? colour : "DarkButNotBlack")
		.setTimestamp(timestamp)
		.setThumbnail(thumbnail || null)
		.setImage(image || null);
