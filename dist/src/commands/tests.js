import { SlashCommandBuilder } from "discord.js";
import { handleCmd } from "#utils/functions.js";
export default {
    dev: true,
    owner: false,
    beta: true,
    desc: "Test commands for the bot",
    category: "Testing",
    data: new SlashCommandBuilder()
        .setName("tests")
        .setDescription("test commands")
        .addSubcommand((subcommand) => subcommand.setName("lb").setDescription("description"))
        .addSubcommand((subcommand) => subcommand.setName("error").setDescription("description")),
    async init(client, interaction) {
        try {
            await handleCmd(client, interaction);
            return;
        }
        catch (e) {
            console.log(e);
            return interaction.reply("something went wrong");
        }
    },
};
