import { SlashCommandBuilder } from "discord.js";
import { basicEmbed } from "../utils/embeds.js";

export default {
    dev: false,
    owner: false,
    beta: false,

    data: new SlashCommandBuilder()
        .setName("afk")
        .setDescription("💤 Set your AFK status!")

        .addStringOption(x=>x
            .setName("message")
            .setDescription("what is your AFK message?")
        )

    ,
    async init(client, interaction) {
        // get optionsku
        // ...


        // log input and output to a channel
        // ...


        // final int. reply with output
        return interaction.reply({
            embeds: [
                basicEmbed()
            ],
            ephemeral: true
        });
    }
};
