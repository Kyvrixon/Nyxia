import { basicEmbed, errEmbed } from "#utils/embeds.js";
import Logger from "#utils/logger.ts";
import { getCmdPath, handleCmd } from "#utils/functions.js";
import userModel from "#models/user.js";
import { ActionRowBuilder, ButtonStyle, ButtonBuilder } from "discord.js";
export default {
    name: "interactionCreate",
    once: false,
    async init(client, interaction) {
        if (!interaction.isChatInputCommand() || !client || !interaction) {
            return;
        }
        try {
            const command = client.commands?.get(interaction.commandName);
            if (!command) {
                await handleCmd(client, interaction);
                return interaction?.channel?.send({
                    embeds: [
                        errEmbed(`Failed to run command ${interaction?.commandName ?? undefined}. Please contact the developer.`, e, interaction, "Failed to initiate command"),
                    ],
                });
            }
            // safeguard incase
            if (command.beta &&
                interaction.guild.id !== "1125196330646638592") {
                return interaction.reply({
                    embeds: [
                        errEmbed("You aren't authorised to use this command", null, interaction, "Unauthorised"),
                    ],
                    ephemeral: true,
                });
            }
            const cmdPath = getCmdPath(interaction);
            const isBanned = await userModel.findOne({
                user: interaction.user.id,
                'flags.isBannedFrom': { $elemMatch: { cmd: cmdPath } }
            });
            const banData = isBanned.flags.isBannedFrom.some(ban => ban.cmd === cmdPath);
            const button = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel("Appeal here")
                .setURL());
            if (isBanned) {
                return interaction.reply({
                    embeds: [
                        basicEmbed("No Access", "Unfortunately, it seems like you have been banned from this command :(", [
                            {
                                name: "__Reason__",
                                value: banData.reason,
                                inline: false
                            },
                            {
                                name: "__Appealable?__",
                                value: banData.appealable ? "`✅`" : "`❌`",
                                inline: false
                            },
                        ], "Red", null, null, null, null, null)
                    ],
                    components: button,
                    ephemeral: true
                });
            }
            return await command.init(client, interaction);
        }
        catch (error) {
            if (error.message === "Unknown Message") {
            }
            Logger.error("interactionCreate", error.message, error);
        }
    },
};
