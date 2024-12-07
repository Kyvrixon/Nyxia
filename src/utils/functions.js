import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Discord from "discord.js";
import "colors";
import fs from "node:fs";
import user from "../models/user.js";
import Logger from './logger.js';
import { client } from "../bot.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", 'package.json'), 'utf-8'));

/**
 * Handles a command interaction.
 *
 * @param {Discord.Client} client - The client instance.
 * @param {Discord.ChatInputCommandInteraction} interaction - The interaction object.
 * @example
 * handleCmd(client, interaction, ...extra_args);
 */
export const handleCmd = async (client, interaction, ...args) => {
    const x = interaction.commandName;
			let z = null, y = null;
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
    if (x) filePath = path.join(filePath, x);
    if (z) filePath = path.join(filePath, z);
    if (y) filePath = path.join(filePath, y + ".js");
    else filePath = path.join(filePath, ".js");

    const cmd = await import("file://" + filePath);
    return cmd.default(client, interaction, ...args);
}

/**
 * Creates a paginated leaderboard embed with navigation buttons. Just remember that this handles the rest of the interactions so it should be final.
 *
 * @param {string} title - The title of the leaderboard.
 * @param {string[]} txt - The leaderboard data as an array of strings.
 * @param {Discord.Interaction|Discord.Message} interaction - The interaction or message that triggered the leaderboard creation.
 * @param {boolean} [single=false] - (optional) Whether to display a single item per page.
 * @param {number} [pageCount=10] - (optional) Number of items to display per page.
 * @param {Discord.ActionRowBuilder} extra_components - (optional) Extra components to add to
 * @param {string} footerText - (optional) text to add on the footer
 * @returns {nothing} Does not return anything
 */
export const createLeaderboard = async (title, txt, interaction, pageCount = 10, extra_components = null, footerText = null) => {
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
            .setTitle(title)
            .setDescription(current)
            .setColor("DarkButNotBlack")
            .setFooter(footer(footerText));
    };

    const isMessage = interaction instanceof Discord.Message;
    const replyOptions = {
        embeds: [await generateEmbed(0, lb, title)],
        fetchReply: true,
    };

    const createButton = (id, label, disabled = false) => new Discord.ButtonBuilder().setCustomId(id).setLabel(label).setStyle(Discord.ButtonStyle.Secondary).setDisabled(disabled);

    const totalPages = Math.ceil(single ? lb.length : (lb.length / pageCount));
    const row = new Discord.ActionRowBuilder().addComponents(
        createButton("back_button", "prev", true),
        createButton("page_info", `1/${totalPages}`, totalPages === 1),
        createButton("forward_button", "next", lb.length <= pageCount)
    );

    let msg = isMessage ? await interaction.reply({ ...replyOptions, components: extra_components ? [row, extra_components] : [row] }) : (interaction.deferred || interaction.replied) ? await interaction.editReply({ ...replyOptions, components: extra_components ? [row, extra_components] : [row] }) : await interaction.reply({ ...replyOptions, components: extra_components ? [row, extra_components] : [row] });

    // safeguard
    if (failed) return;

    let currentIndex = 0;
    const collector = msg.createMessageComponentCollector({ componentType: Discord.ComponentType.Button, time: 60000 });

    collector.on("collect", async (btn) => {

        // --------------------------------------------------------------------------------------------
        //                               safeguard from extra components
        // --------------------------------------------------------------------------------------------
    if (btn.customId !== 'back_button' && btn.customId !== 'page_info' && btn.customId !== 'forward_button') return;
        // --------------------------------------------------------------------------------------------

        if (btn.user.id === (isMessage ? interaction.author.id : interaction.user.id)) {
            if (btn.customId === "page_info") {
                const modal = new Discord.ModalBuilder()
                    .setCustomId("page_modal")
                    .setTitle("Page Indexer")
                    .addComponents(
                        new Discord.ActionRowBuilder().addComponents(
                            new Discord.TextInputBuilder()
                                .setCustomId("page_number")
                                .setLabel(" ")
                                .setPlaceholder("Please provide the page number you wish to visit")
                                .setStyle(Discord.TextInputStyle.Short)
                                .setRequired(true)
                        )
                    );

                await btn.showModal(modal);
                const modalSubmit = await btn.awaitModalSubmit({ time: 15000 }).catch(() => null);

                if (modalSubmit) {
                    const pageNumber = parseInt(modalSubmit.fields.getTextInputValue("page_number"), 10);
                    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
                        await modalSubmit.reply({ content: "Invalid page number.", ephemeral: true });
                    } else {
                        currentIndex = (pageNumber - 1) * pageCount;
                        const row2 = new Discord.ActionRowBuilder().addComponents(
                            createButton("back_button", "prev", currentIndex === 0),
                            createButton("page_info", `${pageNumber}/${totalPages}`, totalPages === 1),
                            createButton("forward_button", "next", currentIndex + (single ? 1 : pageCount) >= lb.length)
                        );

                        await Promise.all([
                            msg.edit({ embeds: [await generateEmbed(currentIndex, lb, title)], components: extra_components ? [row2, extra_components] : [row2] }),
                            modalSubmit.deferUpdate()
                        ]);
                        collector.resetTimer();
                    }
                }
            } else {
                currentIndex += btn.customId === "back_button" ? -pageCount : pageCount;

                const row2 = new Discord.ActionRowBuilder().addComponents(
                    createButton("back_button", "prev", currentIndex === 0),
                    createButton("page_info", `${Math.floor(currentIndex / (single ? 1 : pageCount)) + 1}/${totalPages}`, totalPages === 1),
                    createButton("forward_button", "next", currentIndex + (single ? 1 : pageCount) >= lb.length)
                );

                await Promise.all([
                    msg.edit({ embeds: [await generateEmbed(currentIndex, lb, title)], components: extra_components ? [row2, extra_components] : [row2] }),
                    btn.deferUpdate()
                ]);
                collector.resetTimer();
            }
        } else {
            await btn.reply({ content: "This isn't for you", ephemeral: true });
            collector.resetTimer();
        }
    });

    collector.on("end", async () => {
        const rowDisable = new Discord.ActionRowBuilder().addComponents(
            createButton("expired_button", "This component has expired!", true),
        );
        try {
            await msg.edit({ components: extra_components ? [rowDisable, extra_components] : [rowDisable] });
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
        text: `${text ? `${text}\n` : ''}© Dreamwxve 2024 | ${packageJson.version}`,
        iconURL: pic || null
    }
};

/**
 * Check if a user is a developer
 *
 * @param {string} input - User ID
 * @returns {boolean | "none"} Retuns true or false or "none"
 */
export const devCheck = async (input) => {
    const userId = 
        (typeof input === "bigint" || typeof input === "number") ? input.toString() 
        : typeof input === "string" ? input 
        : null;

    if (!userId || userId === "981755777754755122") return userId === "981755777754755122";

    try {
        const data = await user.findOne({ user: userId }).exec();
        if (data) {
        return ["head_dev", "assistant", "manager"].some((flag) => data?.flags?.common?.includes(flag));
        } else {
            return "none"
        }
    } catch (err) {
        Logger.error("function isDev", "Error fetching user data: " + err.message, err);
        return "none";
    }
};

/**
 * Get an invite for the provided guild
 *
 * @param {Discord.Guild} guild - Guild object
 */
export const getInvite = async (guild) => {
    try {
        const invites = await guild.invites.fetch();
        
        let invite = invites.find(invite => invite.inviter && invite.inviter.id === client.user.id && !invite.expiresAt);
        
        if (!invite) {
            invite = invites.find(invite => !invite.expiresAt);
        }

        if (!invite) {
            invite = await guild.createInvite({ maxAge: 0 });
        }

        return invite.url;
    } catch (error) {
        Logger.error("function getInvite", "Unable to get an invite for the server: " + guild.name, error)
        return 'No permission';
    }
}

//===================
export default {
    handleCmd,
    createLeaderboard,
    footer,
    devCheck,
    getInvite
}