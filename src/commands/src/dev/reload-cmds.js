import { basicEmbed } from "../../../utils/embeds";

export default async (client, interaction) => {
	await interaction.reply({
		embeds: [
			basicEmbed(
				null,
				client.emoji["loading"] + " *Reloading commands...*",
				null,
				"DarkButNotBlack",
				null,
				"⚠️ This may break",
				null,
				null,
				null
			),
		],
	});
};
