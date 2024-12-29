import { EmbedBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder } from "discord.js";
import { errEmbed } from "../../../utils/embeds.js";
import { footer } from "../../../utils/functions.js";
import Logger from "../../../utils/logger.js";
import guildModel from "../../../models/guild.js";

export default async (client, interaction) => {
    try {
        const modal = new ModalBuilder()
            .setCustomId("confess_send_modal")
            .setTitle("Confession")
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("confess_msg")
                        .setLabel("What is your confession?")
                        .setStyle(TextInputStyle.Paragraph)
                        .setMaxLength(2000)
                        .setRequired(true)
                )
            );

        await interaction.showModal(modal);

        const modalSubmit = await interaction.awaitModalSubmit({ time: 300000 }).catch(() => null);

        if (!modalSubmit) {
            return interaction.reply({ content: "You took too long to respond!", ephemeral: true });
        }

        const confess_msg = modalSubmit.fields.getTextInputValue("confess_msg");

        const guildData = await guildModel.findOne({ guild: interaction.guild.id });
        if (!guildData?.config?.confess?.channel) {
            return modalSubmit.reply({
                embeds: [
                    errEmbed(
                        "Confession channel is not set up! Please ask the server administrator to set up the confession channel.",
                        null,
                        interaction,
                        "Setup needed"
                    )
                ],
                ephemeral: true,
                content: null
            });
        }

        await modalSubmit.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Confession")
                    .setDescription(confess_msg)
                    .setFooter(footer())
                    .setColor("Random")
            ]
        });

    } catch (e) {
        console.log(e);
        Logger.error("confess/send", e.message, e);
        return interaction.reply({
            embeds: [errEmbed("Something went wrong while executing this command", e, interaction)],
            ephemeral: true
        });
    }
};