import { EmbedBuilder, PermissionsBitField } from "discord.js";
import { permissions } from "#utils/general.js";
import { errEmbed } from "#utils/embeds.js";
import { footer } from "#utils/functions.js";

function convertCamelCaseToWords(text) {
	return text.replace(/([A-Z])/g, " $1").replace(/^./, (str) => {
		return str.toUpperCase().trim();
	});
}

export default async (client, interaction) => {
	try {
		const clientMember =
			(await interaction.guild.members.cache.get(
				"1309736362454421505"
			)) ||
			(await interaction.guild.members.fetch("1309736362454421505"));
		const requiredPermissions = new PermissionsBitField(permissions);

		const permissionsText = requiredPermissions
			.toArray()
			.map((permission) => {
				const hasPermission = clientMember
					.permissionsIn(interaction.channel.id)
					.has(permission);
				const permissionName = convertCamelCaseToWords(
					permission.replace(/_/g, " ")
				);

				return `\`${hasPermission ? "✅" : "❌"} ${permissionName}\``;
			});

		const embed = new EmbedBuilder()
			.setColor("DarkButNotBlack")
			.setTitle("Required Permissions")
			.setDescription(
				"> To ensure proper functionality, please verify that I have the necessary permissions listed below. Note that running this command in a different channel might produce varying results due to specific channel permissions."
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

		return interaction.reply({ ephemeral: false, embeds: [embed] });
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
