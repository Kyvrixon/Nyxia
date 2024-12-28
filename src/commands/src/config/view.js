import { errEmbed } from '../../../utils/embeds.js';
import guildModel from '../../../models/guild.js';
import { EmbedBuilder } from 'discord.js';
import { createLeaderboard } from '../../../utils/functions.js';

export default async (client, interaction) => {
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setDescription("> Loading data... this may take a while")
                .setColor("DarkButNotBlack")
        ]
    })

    let config;
    const guildData = await guildModel.findOne({ guild: interaction.guild.id });
    if (!guildData) {
        const data = await guildModel.create({ guild: interaction.guild.id });
        config = data.config;
        return interaction.editReply({
            embeds: [
                errEmbed("No configuration data has been found for this server so default data has been created. Run the command again to see the changes.", null, interaction, "No data")
            ]
        })
    } else {
        config = guildData.config;
    }

    const listArray = [];
    let general = "";
    let confessions = "";
    
    // build fields
        general =
            "## General\n"+
            `**Main chat:** ${config.general?.main_chat ? `<#${config.general?.main_chat}>` : "`Not set`"}\n` +
            `**Main role:** ${config.general?.main_role ? `<@&${config.general?.main_role}>` : "`Not set`"}\n`
        ;

        confessions =
            "## Confessions\n"+
            `**Channel:** ${config?.confessions?.channel ? `<#${config.confessions.channel}>` : "`Not set`"}\n` +
            `**Log Channel:** ${config.confessions?.log ? `<#${config.confessions.log}>` : "`Not set`"}\n`
        ;

        listArray.push(general, confessions);

    return await createLeaderboard("Current Configurations", listArray, interaction, 1);
}
