import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { footer, handleCmd } from "../utils/functions.js";
import { errEmbed } from '../utils/embeds.js';
import model from "../models/user.js"
import Logger from '../utils/logger.js';

export default {
    dev: false,
    owner: false,
    desc: "Check if a user has authority over the bot",
    category: "Tools",

    data: new SlashCommandBuilder()
        .setName('auth-check')
        .setDescription('ℹ️ Check if a user has authority over me!')
        
        .addUserOption(x=>x
            .setName("user")
            .setDescription("The user you wish to check")
            .setRequired(true)
        )
        
,
    async init(client, interaction) {
        const target = interaction.options.getUser('user');
        try {
            const data = await model.findOne({
                user: target.id,
                "flags.common": { $in: ["head_dev" || "dev" || "assistant"] }
              });
            if (!data) {
                return interaction.reply(
                    {
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("User Authority Check")
                                .setFooter(footer())
                                .setColor("Orange")
                                .setDescription("> The user, <@" + target + ">, **does not** have high authority of me!\n\nIf this user is pretending to be a dev or someone similar, I urge you to report this user via `/report`!")
                        ],
                        ephemeral: true,
                        content: null
                    }
                )
            } else if (data) {
                return interaction.reply(
                    {
                        embeds: [
                            new EmbedBuilder()
                                .setFooter(footer())
                                .setTitle("User Authority Check")
                                .setColor("#89E894")
                                .setDescription("> The user, <@"+target+">, **does** have high authority of me!\n\n<@"+target+"> has authority to request stuff related to me such as investigating an error or report!")
                        ],
                        ephemeral: true,
                        content: null
                    }
                )
            }
        } catch (e) {
            Logger.error("cmd auth-check", "An error occured: " + e.message, e);
            return interaction.reply({
                embeds: [errEmbed("Unable to check data for this user", e, interaction)]
            });
        }
    }
};
