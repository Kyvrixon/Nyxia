import { SlashCommandBuilder } from "discord.js";
import { errEmbed } from "#utils/embeds.js";
import { devCheck, handleCmd } from "#utils/functions.js";
export default {
    dev: false,
    owner: false,
    beta: false,
    data: new SlashCommandBuilder()
        .setName("dev")
        .setDescription("🔨 Developer Commands")
        .addSubcommand((x) => x
        .setName("ban")
        .setDescription("💥 Ban a user or a server")
        .addStringOption((x) => x
        .setName("type")
        .setDescription("the type of ban")
        .addChoices({ name: "Server", value: "guild" }, { name: "User", value: "user" })
        .setRequired(true))
        .addStringOption((x) => x
        .setName("id")
        .setDescription("ID of the user or server")
        .setRequired(true))
        .addStringOption((x) => x
        .setName("cmd-name")
        .setDescription("e.g. /confess send")
        .setRequired(false))
        .addStringOption((x) => x
        .setName("reason")
        .setDescription("reason for the ban")
        .setRequired(true))),
    async init(client, interaction) {
        if (!(await devCheck(interaction.user.id))) {
            return interaction.reply({
                embeds: [
                    errEmbed("You must be a developer to use these commands!", null, interaction, "Unauthorised"),
                ],
            });
        }
        try {
            await handleCmd(client, interaction);
            return;
        }
        catch (e) {
            console.log(e);
            return interaction.reply({
                embeds: [
                    errEmbed("Something went wrong while executing this command", e, interaction),
                ],
            });
        }
    },
};
