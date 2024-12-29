import guildModel from "../../models/guild.js";
import genModel from "../../models/general.js"
import { basicEmbed } from "../../utils/embeds.js";
import { ActionRowBuilder, ButtonStyle, ButtonBuilder } from "discord.js";
import { getInvite } from "../../utils/functions.js";

export default {
  name: "guildCreate",
  once: false,

  async init(client, guild) {
    try {
      const data = await guildModel.findOne({ guild: guild.id });
      if (!data) {
        await guildModel.create({ guild: guild.id });
      }
    } catch { };

    const data = await genModel.findOne({ "guildBans.ID": guild.id }).exec();
    if (data) {
      const banInfo = data.guildBans.find(ban => ban.ID === guild.id);
      try {
        const owner = await guild.members.fetch(guild.ownerId);
        if (owner) {
          await owner.send(
            {
              embeds: [
                basicEmbed(
                  "Your server is blacklisted",
                  "Oops.. seems like your server was blacklisted :( You can appeal by joining my support server and opening a ticket [here]( https://discord.gg/sJRAsZaYry ). I have left your server.\n**Reason:** " + banInfo.reason,
                  null,
                  "Red",
                  null,
                  banInfo.appealable ? "Your ban is appealable." : "Unfortunately, your ban is not appealable.",
                  true,
                  null,
                  null
                )
              ]
            }
          )
        }
      } catch { };

      await guild.leave();
    }

    const owner = await client.users.fetch(guild.ownerId);
    const embed = basicEmbed(
      null,
      `${guild.description ?? "No description for this server"}`,
      [
        {
          name: "Members",
          value: `${guild.memberCount}`,
          inline: true
        },
        {
          name: "Guild ID",
          value: `${guild.id}`,
          inline: true
        },
        {
          name: "Owner",
          value: `${owner}\n${owner.username}\n${owner.id}`,
          inline: true
        },
        {
          name: "Created At",
          value: `${guild.createdAt.toLocaleString()}`,
          inline: true
        },
        {
          name: "Verification Level",
          value: `${guild.verificationLevel}`,
          inline: true
        },
        {
          name: "Boost Level",
          value: `${guild.premiumTier}`,
          inline: true
        },
        {
          name: "Boosters",
          value: `${guild.premiumSubscriptionCount}`,
          inline: true
        },
        {
          name: "Guild Icon",
          value: guild.iconURL({ size: 4096 }) ? `[Click here](${guild.iconURL({ size: 4096 })})` : 'No Icon',
          inline: true
        },
        {
          name: "Guild Banner",
          value: guild.bannerURL({ size: 4096 }) ? `[Click here](${guild.bannerURL({ size: 4096 })})` : 'No Banner',
          inline: true
        }
      ],
      "Green",
      {
        name: guild.name,
        iconURL: guild.iconURL({ size: 4096 })
      },
      null,
      new Date,
      guild.iconURL({ size: 4096 }),
      guild.bannerURL({ size: 4096 })
    );
    const invite = await getInvite(guild, null)
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel("Join the server")
          .setURL(invite ?? "https://example.com")
      );

    const channel = await client.channels.cache.get("1322722447409152061") || await client.channels.fetch("1322722447409152061");
    await channel.send(
      {
        embeds: [embed],
        components: [row]
      }
    );
  },
};