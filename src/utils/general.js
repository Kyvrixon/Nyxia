import { PermissionFlagsBits } from "discord.js";

export const permissions = [
    PermissionFlagsBits.AddReactions,
    PermissionFlagsBits.AttachFiles,
    PermissionFlagsBits.BanMembers,
    PermissionFlagsBits.ChangeNickname,
    PermissionFlagsBits.Connect,
    PermissionFlagsBits.CreateEvents,
    PermissionFlagsBits.CreateGuildExpressions,
    PermissionFlagsBits.CreateInstantInvite,
    PermissionFlagsBits.CreatePrivateThreads,
    PermissionFlagsBits.CreatePublicThreads,
    PermissionFlagsBits.DeafenMembers,
    PermissionFlagsBits.EmbedLinks,
    PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.ManageEvents,
    PermissionFlagsBits.ManageGuild,
    PermissionFlagsBits.ManageGuildExpressions,
    PermissionFlagsBits.ManageMessages,
    PermissionFlagsBits.ManageNicknames,
    PermissionFlagsBits.ManageRoles,
    PermissionFlagsBits.ManageThreads,
    PermissionFlagsBits.ManageWebhooks,
    PermissionFlagsBits.MentionEveryone,
    PermissionFlagsBits.ModerateMembers,
    PermissionFlagsBits.MoveMembers,
    PermissionFlagsBits.MuteMembers,
    PermissionFlagsBits.ReadMessageHistory,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.SendMessagesInThreads,
    PermissionFlagsBits.SendPolls,
    PermissionFlagsBits.Speak,
    PermissionFlagsBits.UseEmbeddedActivities,
    PermissionFlagsBits.UseExternalEmojis,
    PermissionFlagsBits.UseExternalStickers,
    PermissionFlagsBits.ViewAuditLog,
    PermissionFlagsBits.ViewChannel,
];

export const userFlagValues = [
    "dev",
    "mod",
    "staff",
    "valued",
    "premium"
];

// These get uploaded. Use client.emoji[name] to reference
export const emojisList = {
    cleaning: "https://cdn3.emoji.gg/emojis/8223-cleaningthatcringe.gif",
    bored: "https://cdn3.emoji.gg/emojis/7899-blob-bored.gif",
    loading: "https://cdn3.emoji.gg/emojis/78444-pinkcherryblossom.gif",
    rage: "https://cdn3.emoji.gg/emojis/2977-gamerrage.gif",
    cog: "https://cdn3.emoji.gg/emojis/9733-aesthetic-settings.png",
    arrow_left: "https://cdn3.emoji.gg/emojis/81985-left.png",
    arrow_right: "https://cdn3.emoji.gg/emojis/61991-right.png"
}

export default {
    permissions,
    userFlagValues,
    emojisList
}