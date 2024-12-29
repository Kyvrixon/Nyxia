import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { basicEmbed, errEmbed } from "../../../utils/embeds.js";
import { checkPermissions } from "../../../utils/functions.js";

export default async (client, interaction) => {
    if (!await checkPermissions(["ManageMessages"], ["Managemessages"], interaction, "both", "channel")) {
        return await interaction.reply({
            embeds: [
                errEmbed("Seems like you or I do not have permission to delete messages in this channel", null, interaction, "No permission")
            ],
            ephemeral: true
        });
    }

    const target = interaction.options.getUser("target");
    let amount = interaction.options.getString("amount");

    const amountStr = amount;
    if ((!/^[1-9][0-9]?$|^100$/.test(amountStr) && amount !== null) || !parseInt(amountStr)) {
        return interaction.reply({
            embeds: [
                errEmbed(
                    `Your amount must be a whole number between **1** and **100**. It cannot be \`${amountStr}\`.`,
                    null,
                    interaction,
                    "Invalid input"
                )
            ],
            ephemeral: true
        });
    }

    amount = parseInt(amountStr, 10);

    if (amount > 100 || amount < 1) {
        return interaction.reply({
            embeds: [
                errEmbed(
                    `Your amount must be between **1** and **100**. It cannot be \`${amount}\`.`,
                    null,
                    interaction,
                    "Invalid input"
                )
            ],
            ephemeral: true
        });
    }

    if (amount !== 0) {
        amount = 100;
    }

    await interaction.reply({
        embeds: [
            basicEmbed(
                undefined,
                "> Cleaning messages...",
                null,
                null,
                null,
                null,
                null,
                null,
                null
            )
        ]
    });

    let totalMsgs = 0, msgCount = 0;
    try {
        if (!target) {
            const fetchedMessages = await interaction.channel.messages.fetch({ limit: amount });
            const botMessages = await fetchedMessages.filter(msg => msg);
            totalMsgs = botMessages.size;

            if (botMessages.size > 0) {
                const done = await interaction.channel.bulkDelete(botMessages, true);
                msgCount = msgCount + done.size;
            }
        } else {
            const user = await client.users.fetch(target);
            const fetchedMessages = await interaction.channel.messages.fetch({ limit: amount });
            const targetMessages = fetchedMessages.filter(msg => msg.author.id === user.id);
            totalMsgs = targetMessages.size;

            if (targetMessages.size > 0) {
                const done = await interaction.channel.bulkDelete(targetMessages, true);
                msgCount = msgCount + done.size;
            }
        }

        const confirmationMsg = await interaction.channel.send({
            embeds: [
                basicEmbed(
                    "Cleanup Completed!",
                    `${totalMsgs ? `Done! I have cleared \`${msgCount}/${totalMsgs}\` messages!` : "Hm, no messages for me to clear here!"}`,
                    null,
                    "Green",
                    null,
                    "I will auto delete in 5 seconds",
                    null,
                    null,
                    null
                )
            ]
        });

        setTimeout(async () => {
            try {
                await confirmationMsg.delete();
            } catch (err) {
                console.error("Failed to delete confirmation message:", err);
            }
        }, 5000);
    } catch (err) {
        console.error("Error clearing messages:", err);
        await interaction.followUp({
            embeds: [
                errEmbed("An error occurred while clearing messages.", null, interaction, "Error")
            ],
            ephemeral: true
        });
    }
};