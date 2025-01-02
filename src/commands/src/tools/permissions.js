import { EmbedBuilder, PermissionsBitField, MessageFlags } from "discord.js";
import { permissions } from "#utils/general.js";
import { errEmbed } from "#utils/embeds.js";
import { footer } from "#utils/functions.js";

const permissionNames = {
	AddReactions: "Add reactions",
	AttachFiles: "Attach files",
	BanMembers: "Ban members",
	ChangeNickname: "Change nickname",
	Connect: "Connect to vc's",
	CreateGuildExpressions: "Create server emojis",
	CreateInstantInvite: "Make an invite",
	CreatePrivateThreads: "Create private threads",
	CreatePublicThreads: "Create public threads",
	DeafenMembers: "Deafen members",
	EmbedLinks: "Embed links",
	KickMembers: "Kick members",
	ManageChannels: "Manage channels",
	ManageGuild: "Manage server",
	ManageGuildExpressions: "Manage server emojis",
	ManageMessages: "Manage messages",
	ManageNicknames: "Manage nicknames",
	ManageRoles: "Manage roles",
	ManageThreads: "Manage threads",
	ManageWebhooks: "Manage webhooks",
	ModerateMembers: "Timeout members",
	MoveMembers: "Move ppl in vc",
	MuteMembers: "Mute ppl in vc",
	ReadMessageHistory: "Read past messages",
	SendMessages: "Send messages",
	SendMessagesInThreads: "Send messages",
	Speak: "Speak in vc",
	ViewChannel: "View channel",
};

export default async (client, interaction) => {
	try {
		const clientMember =
			(await interaction.guild.members.cache.get(process.env.BOT_ID)) ||
			(await interaction.guild.members.fetch(process.env.BOT_ID));
		const requiredPermissions = new PermissionsBitField(permissions);

		const permissionsText = requiredPermissions
			.toArray()
			.map((permission) => {
				const hasPermission = clientMember
					.permissionsIn(interaction.channel.id)
					.has(permission);
				const permissionName =
					permissionNames[permission] || permission;

				return `\`${hasPermission ? "✅" : "❌"} ${permissionName}\``;
			});

		// bc yes
		permissionsText.push("`✅ Being absolutely awesome`");

		const embed = new EmbedBuilder()
			.setColor("DarkButNotBlack")
			.setTitle("Required Permissions")
			.setDescription(
				"> To ensure proper functionality, please verify that I have the necessary permissions listed below. Note that running this command in a different channel might produce varying results due to specific channel permissions, so if you are having problems then try running this in the channel!"
			)
			.setFooter(footer());

		const groups = 2;
		const chunks = splitIntoChunks(permissionsText, groups);

		chunks.forEach((chunk) => {
			embed.addFields({
				name: "\u200B",
				value: chunk.join("\n"),
				inline: true,
			});
		});

		function splitIntoChunks(array, groups) {
			const chunkSize = Math.ceil(array.length / groups);
			const chunks = [];

			for (let i = 0; i < array.length; i += chunkSize) {
				chunks.push(array.slice(i, i + chunkSize));
			}

			return chunks;
		}

		return interaction.reply({
			flags: MessageFlags.Ephemeral,
			embeds: [embed],
		});
	} catch (err) {
		interaction.reply({
			content: null,
			embeds: [
				errEmbed(
					"Something went wrong when executing this command",
					err,
					interaction,
					"Hmm..."
				),
			],
		});
	}
};
