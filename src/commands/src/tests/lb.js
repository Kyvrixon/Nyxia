import { createLeaderboard } from '../../../utils/functions.js';

export default async (client, interaction) => {
    try {
        const b = Array.from({ length: 1000 }, (_, i) => i + 1);
        await createLeaderboard("Numbers list", b, interaction, 5, null);
    } catch (e) {
        console.log(e);
    }
}















/*
        const banned = await interaction.guild.bans.fetch({ cache: false });
        const sortedBans = banned.sort((a, b) => b.user.createdTimestamp - a.user.createdTimestamp);
        let b = sortedBans.map(banUser => {
            return `- User: ${banUser.user} \n` +
               `  Tag: ${banUser.user.username} \n` +
               `  ID: ${banUser.user.id} \n` +
               `  Reason: ${banUser.reason ? banUser.reason : 'No reason was given'}\n`;
        });
*/