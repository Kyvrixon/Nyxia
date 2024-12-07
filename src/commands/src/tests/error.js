import { errEmbed } from '../../../utils/embeds.js';

export default async (client, interaction) => {
    let error = new Error("Test error");
    error.code = "TEST_ERROR_CODE"

    return interaction.reply({
        embeds: [errEmbed("Test error embed message", error, interaction, "Error title")]
    });
}
