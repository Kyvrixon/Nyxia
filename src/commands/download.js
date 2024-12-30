import { SlashCommandBuilder } from "discord.js";
import { handleCmd } from "../utils/functions.js";

export default {
    dev: false,
    owner: false,
    beta: true,
    desc: "Download user or server information from the database",
    category: "Utility",

    data: new SlashCommandBuilder()
        .setName("download")
        .setDescription("📂 Download data from the bot")
        .addSubcommand(subcommand =>
            subcommand
                .setName("user")
                .setDescription("📂 Download user data from the bot")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("server")
                .setDescription("📂 Download server data from the bot")
        )
    ,
    async init(client, interaction) {
        try {
            await handleCmd(client, interaction);
            return;
        } catch (e) {
            console.log(e);
            return interaction.reply("something went wrong: " + e.message).catch(e => {
                return interaction.editReply("something went wrong: " + e.message);
            });
        }
    }
};
