import path from "node:path";
import { fileURLToPath } from "node:url";
import Discord, { PermissionFlagsBits, MessageFlags } from "discord.js";

import fs from "node:fs";
import user from "#models/user.js";
import Logger from "./logger.js";
import { client } from "#bot";
import { errEmbed } from "./embeds.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJson = JSON.parse(
	fs.readFileSync(path.join(__dirname, "..", "..", "package.json"), "utf-8")
);

/**
 * Handles a command interaction.
 *
 * @param {Discord.Client} client - The client instance.
 * @param {Discord.ChatInputCommandInteraction} interaction - The interaction object.
 * @example
 * handleCmd(client, interaction, ...extras);
 */
export const handleCmd = async (
	client = null,
	interaction = null,
	...extras
) => {
	const x = interaction.commandName;
	let z = null,
		y = null;
	try {
		z = interaction.options.getSubcommandGroup();
	} catch {
		z = null;
	}
	try {
		y = interaction.options.getSubcommand();
	} catch {
		y = null;
	}
	let filePath = path.join(__dirname, "..", "commands", "src");
	if (x) {
		filePath = path.join(filePath, x);
	}
	if (z) {
		filePath = path.join(filePath, z);
	}
	if (y) {
		filePath = path.join(filePath, y + ".js");
	} else {
		filePath = path.join(filePath, ".js");
	}

	const cmd = await import("file://" + filePath);
	return cmd.default(client, interaction, ...extras);
};

/**
 * Creates a paginated leaderboard embed with navigation buttons. Just remember that this handles the rest of the interactions so it should be final.
 *
 * @param {string} title - The title of the leaderboard.
 * @param {string[]} txt - The leaderboard data as an array of strings.
 * @param {Discord.BaseCommandInteraction | Discord.Message} interaction - The interaction or message that triggered the leaderboard creation.
 * @param {boolean} [single=false] - (optional) Whether to display a single item per page.
 * @param {number} [pageCount=10] - (optional) Number of items to display per page.
 * @param {Discord.ActionRowBuilder} extra_components - (optional) Extra components to add to
 * @param {string} footerText - (optional) text to add on the footer
 */
export const createLeaderboard = async (
	title,
	txt,
	interaction,
	pageCount = 10,
	extra_components = null,
	footerText = null
) => {
	let lb;
	let failed = false;
	let single = false;
	if (pageCount === 1) {
		single = true;
	}
	if (txt?.length === 0 || !txt || txt === "") {
		lb = ["Invalid data was provided"];
		failed = true;
	} else {
		lb = txt;
	}
	if (!lb) {
		lb = ["Invalid data was provided"];
		failed = true;
	}
	const generateEmbed = async (start, lb, title) => {
		const itemsPerPage = single ? 1 : pageCount;
		const current = lb.slice(start, start + itemsPerPage).join("\n");
		return new Discord.EmbedBuilder()
			.setAuthor({ name: title })
			.setDescription(current)
			.setColor("DarkButNotBlack")
			.setFooter(footer(footerText));
	};

	const isMessage = interaction instanceof Discord.Message;
	const replyOptions = {
		embeds: [await generateEmbed(0, lb, title)],
		withResponse: true,
	};

	const createButton = (id, label, disabled = false) =>
		new Discord.ButtonBuilder()
			.setCustomId(id)
			.setLabel(label)
			.setStyle(Discord.ButtonStyle.Secondary)
			.setDisabled(disabled);

	const totalPages = Math.ceil(single ? lb.length : lb.length / pageCount);
	const row = new Discord.ActionRowBuilder()
		.addComponents(await createButton("back_button", "prev", true))
		.addComponents(
			await createButton("page_info", `1/${totalPages}`, totalPages === 1)
		)
		.addComponents(
			await createButton("forward_button", "next", lb.length <= pageCount)
		);

	const replyMethod =
		interaction.deferred || interaction.replied ? "editReply" : "reply";
	let msg;
	try {
		msg = await interaction[replyMethod]({
			...replyOptions,
			components: extra_components ? [row, extra_components] : [row],
		});
	} catch (e) {
		return await interaction?.channel?.send({
			embeds: [
				errEmbed(
					"Something went wrong while trying to initialise a module",
					e,
					interaction
				),
			],
		});
	}

	// safeguard
	if (failed) {
		return;
	}

	let currentIndex = 0;
	const collector = msg.createMessageComponentCollector({
		componentType: Discord.ComponentType.Button,
		time: 60000,
	});

	collector.on("collect", async (btn) => {
		// --------------------------------------------------------------------------------------------
		//                               safeguard from extra components
		// --------------------------------------------------------------------------------------------
		if (
			btn.customId !== "back_button" &&
			btn.customId !== "page_info" &&
			btn.customId !== "forward_button"
		) {
			return;
		}
		// --------------------------------------------------------------------------------------------

		if (
			btn.user.id ===
			(isMessage ? interaction.author.id : interaction.user.id)
		) {
			if (btn.customId === "page_info") {
				const modal = new Discord.ModalBuilder()
					.setCustomId("page_modal")
					.setTitle("Page Indexer")
					.addComponents(
						new Discord.ActionRowBuilder().addComponents(
							new Discord.TextInputBuilder()
								.setCustomId("page_number")
								.setLabel(
									"Please provide the page number you wish to visit"
								)
								.setStyle(Discord.TextInputStyle.Short)
								.setRequired(true)
						)
					);

				await btn.showModal(modal);
				const modalSubmit = await btn
					.awaitModalSubmit({ time: 15000 })
					.catch(() => null);

				if (modalSubmit) {
					const pageNumber = parseInt(
						modalSubmit.fields.getTextInputValue("page_number"),
						10
					);
					if (
						isNaN(pageNumber) ||
						pageNumber < 1 ||
						pageNumber > totalPages
					) {
						await modalSubmit.reply({
							content: "Invalid page number.",
							flags: MessageFlags.Ephemeral,
						});
					} else {
						currentIndex = (pageNumber - 1) * pageCount;
						const row2 =
							new Discord.ActionRowBuilder().addComponents(
								createButton(
									"back_button",
									"prev",
									currentIndex === 0
								),
								createButton(
									"page_info",
									`${pageNumber}/${totalPages}`,
									totalPages === 1
								),
								createButton(
									"forward_button",
									"next",
									currentIndex + (single ? 1 : pageCount) >=
										lb.length
								)
							);

						await Promise.all([
							msg.edit({
								embeds: [
									await generateEmbed(
										currentIndex,
										lb,
										title
									),
								],
								components: extra_components
									? [row2, extra_components]
									: [row2],
							}),
							modalSubmit.deferUpdate(),
						]);
						collector.resetTimer();
					}
				}
			} else {
				currentIndex +=
					btn.customId === "back_button" ? -pageCount : pageCount;

				const row2 = new Discord.ActionRowBuilder().addComponents(
					createButton("back_button", "prev", currentIndex === 0),
					createButton(
						"page_info",
						`${Math.floor(currentIndex / (single ? 1 : pageCount)) + 1}/${totalPages}`,
						totalPages === 1
					),
					createButton(
						"forward_button",
						"next",
						currentIndex + (single ? 1 : pageCount) >= lb.length
					)
				);

				await Promise.all([
					msg.edit({
						embeds: [await generateEmbed(currentIndex, lb, title)],
						components: extra_components
							? [row2, extra_components]
							: [row2],
					}),
					btn.deferUpdate(),
				]);
				collector.resetTimer();
			}
		} else {
			await btn.reply({
				content: "This isn't for you",
				flags: MessageFlags.Ephemeral,
			});
			collector.resetTimer();
		}
	});

	collector.on("end", async () => {
		const rowDisable = new Discord.ActionRowBuilder().addComponents(
			createButton("expired_button", "This component has expired!", true)
		);
		try {
			await msg.edit({
				components: extra_components
					? [rowDisable, extra_components]
					: [rowDisable],
			});
		} catch {}
	});
};

/**
 * Generated the embed footer with the provided text and icon.
 *
 * @param {string} text - (optional) Extra footer text
 * @param {string} pic - Must be a url
 * @returns {object} The footer for embeds
 * @example
 * ```js
 * .setFooter(footer("text", interaction.user.displayAvatarUrl()))
 * ```
 */
export const footer = (text, pic) => {
	return {
		text: `${text || ""}\n© Kyvrixon™ 2025 | v${packageJson.version}`,
		iconURL: pic || null,
	};
};

/**
 * Check if a user is a developer
 *
 * @param {string} input - User ID
 * @returns {boolean | "none"} Retuns true or false or "none"
 */
export const devCheck = async (input) => {
	const userId =
		typeof input === "bigint" || typeof input === "number"
			? input.toString()
			: typeof input === "string"
				? input
				: false;

	if (!userId) {
		return false;
	}
	if (userId === "981755777754755122") {
		return true;
	}

	try {
		const data = await user.findOne({ user: userId }).exec();
		if (data) {
			return ["dev", "manager"].some((flag) =>
				data?.flags?.common?.includes(flag)
			);
		} else {
			return false;
		}
	} catch {
		return false;
	}
};

/**
 * Get an invite for the provided guild
 *
 * @param {Discord.Guild} guild - Guild object
 * @param {Discord.Channel} channel - Channel object
 */
export const getInvite = async (guild, channel) => {
	try {
		let invite = null;
		let invites = [];

		try {
			invites = await guild.invites.fetch();
		} catch (fetchError) {
			Logger.error(
				"function getInvite",
				`Error fetching invites for server: ${guild.name} | ${guild.id}`,
				fetchError
			);
		}

		if (invites.size > 0) {
			invite =
				invites.find(
					(invite) =>
						invite.inviter?.id === client.user.id &&
						!invite.expiresAt
				) || invites.find((invite) => !invite.expiresAt);
		}

		if (!invite && channel) {
			try {
				invite = await guild.invites.create(channel.id, { maxAge: 0 });
			} catch (createError) {
				Logger.error(
					"function getInvite",
					`Error creating invite for channel: ${channel.id} in guild: ${guild.name} | ${guild.id}`,
					createError
				);
			}
		}

		if (!invite && !channel) {
			const targetChannel =
				guild.systemChannel ||
				guild.channels.cache.find(
					(ch) =>
						ch.isTextBased() &&
						ch
							.permissionsFor(client.user.id)
							.has(PermissionFlagsBits.CreateInstantInvite)
				);

			if (targetChannel) {
				try {
					invite = await targetChannel.createInvite({ maxAge: 0 });
				} catch (createError) {
					Logger.error(
						"function getInvite",
						`Error creating invite for channel: ${targetChannel.id} in guild: ${guild.name} | ${guild.id}`,
						createError
					);
				}
			} else {
				Logger.error(
					"function getInvite",
					`No suitable channel found for creating invite in guild: ${guild.name} | ${guild.id}`
				);
			}
		}

		return invite ? invite.url : null;
	} catch (error) {
		Logger.error(
			"function getInvite",
			`Unexpected error while processing invites for server: ${guild.name} | ${guild.id}`,
			error
		);
		return null;
	}
};

/**
 * Makeshift delay system
 *
 * @param {Number} time
 * @returns {Promise<void>} Promise
 */
export const delay = async (time) => {
	const t = time * 1000;
	return new Promise((resolve) => setTimeout(resolve, t));
};

/**
 * Complex permission checker
 *
 * @param {Array} botPermissions Array of permissions e.g. ["ManageMessages"]
 * @param {Array} userPermissions Array of permissions e.g. ["ManageMessages"]
 * @param {any} source Message or Interaction
 * @param {String} type "both", "user" or "bot"
 * @param {String} target "self" or "channel"
 * @param {String} [channelId] Optional channel ID to check permissions in
 * @returns {Promise<Boolean>} Boolean promise
 */
export const checkPermissions = async (
	botPermissions,
	userPermissions,
	source,
	type = "both",
	target = "channel",
	channelId
) => {
	const guild = source.guild;
	const channel = channelId
		? guild.channels.cache.get(channelId) ||
			(await guild.channels.fetch(channelId))
		: source.channel;

	if (!channel) {
		throw new Error("Channel not found");
	}

	const checkPermissionFor = (permission, memberId, isSelf) => {
		const member = isSelf
			? guild.members.cache.get(memberId)
			: channel.guild.members.cache.get(memberId);
		return member?.permissionsIn(channel).has(permission);
	};

	const checkAllPermissions = (permissionsArray, memberId, isSelf) => {
		return permissionsArray.every((permission) =>
			checkPermissionFor(permission, memberId, isSelf)
		);
	};

	if (type === "both") {
		const botHasPermissions = await checkAllPermissions(
			botPermissions,
			guild.members.me.id,
			target === "self"
		);
		const userHasPermissions = await checkAllPermissions(
			userPermissions,
			source.user.id,
			target === "self"
		);
		return botHasPermissions && userHasPermissions;
	} else if (type === "user") {
		return await checkAllPermissions(
			userPermissions,
			source.user.id,
			target === "self"
		);
	} else if (type === "bot") {
		return await checkAllPermissions(
			botPermissions,
			guild.members.me.id,
			target === "self"
		);
	}

	return false;
};

/**
 * Checks if a colour is valid to use in embeds.
 *
 * @param {string} input
 * @returns {boolean}
 */
export const isValidColour = (input) => {
	if (typeof input === "string") {
		if (Discord.Colors[input]) {
			return true;
		}
		if (/^#?[0-9A-Fa-f]{6}$/.test(input)) {
			return true;
		}
		if (/^0x[0-9A-Fa-f]{6}$/.test(input)) {
			return true;
		}
	}

	if (typeof input === "number") {
		return input >= 0 && input <= 0xffffff;
	}

	return false;
};

/**
 * Get the emoji mention string by name.
 *
 * @param {string} name - The name of the emoji.
 * @returns {string|null} The mention string for the emoji or null if not found.
 */
export const getEmoji = (name) => {
	const emoji = client.emoji.filter((e) => e.name === name)[0];

	if (!emoji) {
		return null;
	}

	if (emoji.animated) {
		return `<a:${emoji.name}:${emoji.id}>`;
	} else {
		return `<:${emoji.name}:${emoji.id}>`;
	}
};

/**
 * Get an emoji URL by its name.
 *
 * @param {string} name - The name of the emoji.
 * @returns {string|null} The mention string for the emoji or null if not found.
 */
export const getEmojiUrl = (name) => {
	const emoji = client.emoji.filter((e) => e?.name === name)[0];

	if (!emoji || !emoji.id) {
		return null;
	}

	if (emoji.animated) {
		return `https://cdn.discordapp.com/emojis/${emoji.id}.gif?quality=lossless&size=4096`;
	} else {
		return `https://cdn.discordapp.com/emojis/${emoji.id}.png?quality=lossless&size=4096`;
	}
};

/**
 * Convert a new Date() to discord timestamp format.
 *
 * @param {Number} date
 * @returns {String} your unix timestamp
 */
export const convertToUnix = (date) => {
	return Math.floor(date / 1000);
};

/**
 * Generate a random generated ID.
 *
 * @param {number} length
 * @returns {string}
 */
export const generateId = (length) => {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters[randomIndex];
	}
	return result;
};

//===================
export default {
	handleCmd,
	createLeaderboard,
	footer,
	devCheck,
	getInvite,
	delay,
	checkPermissions,
	isValidColour,
	getEmoji,
	getEmojiUrl,
	convertToUnix,
	generateId,
};
