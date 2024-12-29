import AFK from "./afk.js";
import { basicEmbed } from "../embeds.js";

export const afkHandler = async (client, message) => {
    if (message.author.id === client.user.id) return;

    let msg1;

    // Self AFK check
    const isInAfk = await AFK.check(message.author);
    if (isInAfk.message) {
        try {
            msg1 = await message.channel.send({
                embeds: [
                    basicEmbed(
                        null,
                        "> Welcome back! Your AFK has been removed!",
                        null,
                        "Green"
                    )
                ]
            });
        } catch (error) {
            console.error("Error sending welcome back embed:", error);
        }

        await AFK.clear(message.author);
        return;
    }

    // Mentioned users AFK check
    for (const u of message.mentions.users.values()) {
        if (!message.content.includes("@here") && !message.content.includes("@everyone")) {
            const isAFK = await AFK.check(u);
            if (isAFK) {
                msg1 = await message.channel.send({
                    embeds: [
                        basicEmbed(
                            null,
                            `**Reason:** ${isAFK.message}\n**Since:** <t:${Math.floor(isAFK.time / 1000)}:R>`,
                            null,
                            "DarkButNotBlack",
                            {
                                name: u.username + " is currently AFK!",
                                iconURL: u.displayAvatarURL({ dynamic: true }),
                            },
                            "This msg will autodelete in 5 seconds",
                            new Date().now
                        )
                    ]
                });
            }
        }
    }

    if (msg1) {
        setTimeout(async() => {
            try {
               await msg1.delete();
            } catch (error) {
                console.error("Error deleting message:", error);
            }
        }, 5000);
    }
}

export default afkHandler;