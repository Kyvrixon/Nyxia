import { SlashCommandBuilder, ChannelType } from 'discord.js';
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
                .setName('list-cmds')
                .setDescription('🧰 List all the commands for me')
                .addUserOption(option =>
                    option.setName('number')
                        .setDescription('(optional) Number of commands to show per page')
                        .setRequired(false)
                )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName('cleanup')
                .setDescription('🧹 Cleanup messages in the channel')
                .addUserOption(x => x
                    .setName("target")
                    .setDescription("(optional) The user you wish to clean")
                )
                .addStringOption(x => x
                    .setName("amount")
                    .setDescription("(optional) Amount to delete. Max of 100")
                )
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
