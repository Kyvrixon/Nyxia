import { basicEmbed, errEmbed } from '../../../utils/embeds.js';
import guildModel from '../../../models/guild.js';
import { EmbedBuilder } from 'discord.js';
import { createLeaderboard, getEmoji } from '../../../utils/functions.js';

export default async (client, interaction) => {
    await interaction.reply({
        embeds: [
            basicEmbed(
                undefined,
                `${getEmoji("loading")} Loading data. This may take a while...`,
                undefined,
                undefined,
                undefined,
                undefined,
                false,
                undefined,
                undefined
            )
        ]
    })

    let config;
    const guildData = await guildModel.findOne({ guild: interaction.guild.id });
    if (!guildData) {
        const data = await guildModel.create({ guild: interaction.guild.id });
        config = data.configs;
        return interaction.editReply({
            embeds: [
                errEmbed("No configuration data has been found for this server so default data has been created. Run the command again to see the changes.", null, interaction, "No data")
            ]
        })
    } else {
        config = guildData.configs;
    }

    const listArray = [];
    let general = "";
    let confessions = "";
    
    // build entries
        general =
            "## General\n"+
            `**Main chat:** ${config.general?.mainChat ? `<#${config.general?.mainChat}>` : "`Not set`"}\n` +
            `**Main role:** ${config.general?.mainRole ? `<@&${config.general?.mainRole}>` : "`Not set`"}\n` +
            `**Timezone:** ${config.general.timezone ?? "`Not set`"}\n`
        ;

        confessions =
            "## Confessions\n"+
            `**Channel:** ${config?.confessions?.channel ? `<#${config.confessions.channel}>` : "`Not set`"}\n` +
            `**Log Channel:** ${config.confessions?.log ? `<#${config.confessions.log}>` : "`Not set`"}\n`
        ;

        listArray.push(general, confessions);

    return await createLeaderboard("Current Configurations", listArray, interaction, 1);
}
