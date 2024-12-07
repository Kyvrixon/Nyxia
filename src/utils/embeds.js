import { ActionRowBuilder, BaseInteraction, ButtonBuilder, ButtonStyle, ChannelSelectMenuInteraction, CommandInteraction, ContextMenuCommandInteraction, EmbedBuilder, MentionableSelectMenuInteraction, Message, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";
import { client } from "../bot.js";
import { footer, getInvite } from "./functions.js";
import Logger from "./logger.js";

/**
 * Creates an error embed message.
 *
 * @param {string} message - The message content of the embed.
 * @param {Error} error - The error object. Is allowed to be null.
 * @param {object} source - The source object that triggered for example interaction or message.
 * @returns {import('discord.js').EmbedBuilder} EmbedBuiler instance.
 */
export const errEmbed = (message, e, s, title = "Oops.. something went wrong") => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 10; i++) {
    	code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    const embedReply = new EmbedBuilder()
        .setColor(e ? "Red" : "Orange")
		.setTitle(title)
		.setDescription(`> ${message}`)
		.setFooter(footer())

		if (e && s) {
			embedReply.setDescription(`\`\`\`\n${message}\`\`\``)
			embedReply.setAuthor({name: "Unique error ID: " + code})
			embedReply.addFields(
				{
					name: "__So, what to do now?__",
					value: "> If this error really impacts the functionality of this command please join our support server by clicking below, open a ticket and share the **Unique error ID** for the dev to further help!",
					inline: true
				},
				{
					name: "__Please note__",
					value: "> Depending on severity, a dev may join the server to further investigate the nature of this error! Please provide any permissions they may request.\n*You can also check if a user is a genuine dev of me by running \`/auth-check\`*",
					inline: true
				}
			);
		}

		sendLog(e, s);
		return embedReply;

	async function sendLog(error, source) {
		if (!error || !source) return;
		
		if (!source instanceof Message || !source instanceof BaseInteraction) {
			return Logger.error("function errEmbed", "Source object isnt of BaseInteraction or Message", error)
		}
		
		let cmdValueString = '';
		if (source instanceof CommandInteraction) {
			let group = null, sub = null;
			try {
				group = interaction.options.getSubcommandGroup();
			} catch {
				group = null;
			}
			try {
				sub = interaction.options.getSubcommand();
			} catch {
				sub = null;
			}

			const commandInfo = {
				subcommandGroup: group,
				subcommand: sub
			};
			cmdValueString = `> \`/${source.commandName} ${commandInfo.subcommandGroup ? `${commandInfo.subcommandGroup} ` : ''}${commandInfo.subcommand || ''}\``;

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
			cmdValueString = `> \`Unknown Interaction Type\``;
		}

		const embedLog = new EmbedBuilder()
		.setTitle("An error occurred")
		.setDescription(`__**Error Message:**__ \`\`\`\n${error?.message}\`\`\`\n__**Stack Trace:**__ \`\`\`\n${error?.stack}\`\`\``)
		.addFields(
			{
				name: `__Error Code__`,
				value: `> \`${code}\``,
				inline: true
			},
			{
				name: `__Server__`,
				value: `> \`${source?.guild?.name}\``,
				inline: true
			},
			{
				name: `__User__`,
				value: `> \`${(source instanceof Message ? source?.author?.username : source?.user?.username)}\``,
				inline: true
			},
			{
				name: `__Channel__`,
				value: `> \`${(source?.channel?.name || "Cannot find channel")}\`\n> <#${source?.channel?.id}>`,
				inline: true
			},
			{
				name: `__Timestamp__`,
				value: `> <t:${Math.floor(new Date().getTime() / 1000)}:f>`,
				inline: true
			},
			{
				name: `__Command/Interaction__`,
				value: cmdValueString,
				inline: true
			}
		)

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setURL(await getInvite(source.guild))
					.setLabel("Click to join the server")
			)

		const logChannel = client.channels.cache.get("1314851469551468634") || await client.channels.fetch("1314851469551468634")
		try {
			await logChannel.send({embeds: [embedLog], components: [row]});
		} catch (err) {
			Logger.error("function errEmbed", "Failed to log an error: " + err.message, err);
			return;
		}
	}
};