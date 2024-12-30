import { errEmbed } from "../../../utils/embeds.js";
import { createLeaderboard } from "../../../utils/functions.js";

export default async (client, interaction) => {
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
        });
    }
    if (resultsPerPage < 1) {
        return interaction.reply({
            embeds: [
                errEmbed("You can only have max of 10 per page and minimum of 1!", null, interaction, "oopsie...")
            ]
        });
    }

    const processSubcommands = (parentName, subcommands, baseId) => {
        for (const subcommand of subcommands) {
            // Construct full command name with subcommands/subcommand groups
            const fullName = `${parentName} ${subcommand.name}`;
            const commandObject = {
                title: fullName,
                desc: subcommand.description || "No description available",
                id: baseId
            };
            cmdListArray.push(commandObject);

            const commandMention = `</${commandObject.title}:${commandObject.id}>`;
            const entry =
                `- ${commandMention}\n` +
                `> \`${commandObject.desc}\`\n`;

            completeArray.push(entry);
        }
    };

    for (const command of rawCmds.values()) {
        // Check if the command has subcommands or subcommand groups
        if (command.options && command.options.some(option => option.type === 1 || option.type === 2)) {
            const subcommands = command.options.filter(option => option.type === 1);
            const subcommandGroups = command.options.filter(option => option.type === 2);

            // Process subcommands
            processSubcommands(command.name, subcommands, command.id);

            // Process subcommand groups and their subcommands
            for (const group of subcommandGroups) {
                processSubcommands(`${command.name} ${group.name}`, group.options || [], command.id);
            }

        } else {
            // Process commands without subcommands or subcommand groups
            const commandObject = {
                title: command.name,
                desc: command.description || "No description available",
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