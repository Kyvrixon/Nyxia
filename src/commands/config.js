import { SlashCommandBuilder } from 'discord.js';
import { handleCmd } from "../utils/functions.js";
import { errEmbed } from "../utils/embeds.js"

export default {
    dev: false,
    owner: false,
    beta: true,
    desc: "Test commands for the bot",
    category: "Config",

    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('⚙️ Modify configurations')

        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('⚙️ View the current configurations')
        )
    ,
    async init(client, interaction) {
        try {
            await handleCmd(client, interaction);
            return;
        } catch (e) {
            console.log(e);
            return interaction.reply({
                embeds: [errEmbed("Something went wrong while executing this command", e, interaction)]
            })
        }
    }
};
