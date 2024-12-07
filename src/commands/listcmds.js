import { errEmbed } from "../utils/embeds.js";
import { createLeaderboard } from "../utils/functions.js";
import { SlashCommandBuilder } from 'discord.js';

export default {
    dev: true,
    owner: false,

    data: new SlashCommandBuilder()
        .setName('list-cmds')
        .setDescription('🧰 List all my commands!')

        .addIntegerOption(x => x
            .setName("number")
            .setDescription("(optional) Results per page, default is 5")
            .setRequired(false)
        )        
,
    async init(client, interaction) {
        const cmdListArray = [];
        const completeArray = [];
        const guild = await client.guilds.fetch(interaction.guild.id);
        const rawCmds = await guild.commands.fetch();
        let resultsPerPage = interaction.options.getInteger('number') || 5;
        if (resultsPerPage > 10) {
            return interaction.reply({
                embeds: [
                    errEmbed("You can only have max of 10 per page and minimum of 1!", null, interaction, "oopsie...")
                ]
            })
        }
        if (resultsPerPage < 1) {
            return interaction.reply({
                embeds: [
                    errEmbed("You can only have max of 10 per page and minimum of 1!", null, interaction, "oopsie...")
                ]
            })
        }

        const processOptions = (command, parentName, options, baseId, groupName = '') => {
            for (const option of options) {
                if (option.type === 1) {
                    const fullName = groupName ? `${parentName} ${groupName} ${option.name}` : `${parentName} ${option.name}`;
                    const commandObject = {
                        title: fullName,
                        desc: option.description || "No description available",
                        id: baseId
                    };
                    cmdListArray.push(commandObject);

                    const commandMention = `</${commandObject.title}:${commandObject.id}>`;
                    const entry = 
                        `- ${commandMention}\n` +
                        `> \`${commandObject.desc}\`\n`;
                        
                    completeArray.push(entry);

                } else if (option.type === 2) {
                    processOptions(command, parentName, option.options || [], baseId, option.name);

                }
            }
        };

        for (const command of rawCmds.values()) {
            if (command.options && command.options.length > 0) {
                processOptions(command, command.name, command.options, command.id, '');

            } else {
                const commandObject = {
                    title: command.name,
                    desc: command.description,
                    id: command.id
                };
                cmdListArray.push(commandObject); 

                const commandMention = `</${commandObject.title}:${commandObject.id}>`;
                const entry =
                    `- ${commandMention}\n` +
                    `> \`${commandObject.desc}\`\n`;

                completeArray.push(entry);
            }
        }

        return createLeaderboard("Command List", completeArray, interaction, resultsPerPage, null);
    }
};