import { SlashCommandBuilder } from 'discord.js';
import { handleCmd } from "../utils/functions.js";
import { errEmbed } from "../utils/embeds.js"

export default {
    dev: false,
    owner: false,

    data: new SlashCommandBuilder()
        .setName('tools')
        .setDescription('🧰 Use something in the toolbox')

        .addSubcommand(subcommand =>
            subcommand
                .setName('auth-check')
                .setDescription('👮 Check if a user has authority over the bot')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to check')
                        .setRequired(true)
                )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName('permissions')
                .setDescription('🔐 Check the permissions of the bot')
        )
,
    async init(client, interaction) {
        try {
            await handleCmd(client, interaction);
            return;
        } catch (e) {
            return interaction.reply({
                embeds: [errEmbed("Something went wrong while executing this command", e, interaction)]
            })
        }
    }
};
