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
    //PermissionFlagsBits.PrioritySpeaker, 
    PermissionFlagsBits.ReadMessageHistory,
    //PermissionFlagsBits.RequestToSpeak,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.SendMessagesInThreads,
    PermissionFlagsBits.SendPolls, 
    //PermissionFlagsBits.SendTTSMessages,
    //PermissionFlagsBits.SendVoiceMessages, 
    PermissionFlagsBits.Speak,
    //PermissionFlagsBits.Stream,
    //PermissionFlagsBits.UseApplicationCommands,
    PermissionFlagsBits.UseEmbeddedActivities, 
    //PermissionFlagsBits.UseExternalApps,
    PermissionFlagsBits.UseExternalEmojis,
    //PermissionFlagsBits.UseExternalSounds,
    PermissionFlagsBits.UseExternalStickers, 
    //PermissionFlagsBits.UseSoundboard, 
    //PermissionFlagsBits.UseVAD,
    PermissionFlagsBits.ViewAuditLog,
    PermissionFlagsBits.ViewChannel,
    //PermissionFlagsBits.ViewCreatorMonetizationAnalytics,
    //PermissionFlagsBits.ViewGuildInsights
];

export const userFlagValues = [
    "dev", 
    "mod",
    "staff",
    "valued",
    "premium"
]

export default {
    permissions,
    userFlagValues
}