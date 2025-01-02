import { EmbedBuilder, MessageFlags } from "discord.js";
import { footer } from "#utils/functions.js";
import { errEmbed } from "#utils/embeds.js";
import model from "#models/user.js";
import Logger from "#utils/logger.js";

export default async (client, interaction) => {
	const target = interaction.options.getUser("user");
	const member =
		interaction.guild.members.cache.get(target) ||
		client.users.cache.get(target) ||
		(await client.users.fetch(target).catch(() => null));

	if (member.id === "1309736362454421505") {
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("User Authority Check")
					.setFooter(footer())
					.setColor("DarkButNotBlack")
					.setDescription(
						"> Hey thats me! I am the one who has the highest authority of myself, least I hope so..."
					),
			],
			flags: MessageFlags.Ephemeral,
			content: null,
		});
	}

	if (member?.bot) {
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("User Authority Check")
					.setFooter(footer())
					.setColor("DarkButNotBlack")
					.setDescription("> Why are you checking bots? Curiosity?"),
			],
			flags: MessageFlags.Ephemeral,
			content: null,
		});
	}

	try {
		const data = await model.findOne({
			user: target.id,
			"flags.common": { $in: ["manager", "dev", "assistant"] },
		});
		if (!data) {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("Authority Check")
						.setFooter(footer())
						.setColor("Red")
						.setDescription(
							"> The user, <@" +
								target +
								">, **does not** have high authority of me!\n\nIf this user is pretending to have authorship over me, I urge you to report this user via `/report`!"
						),
				],
				flags: MessageFlags.Ephemeral,
				content: null,
			});
		} else {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setFooter(footer())
						.setTitle("Authority Check")
						.setColor("Orange")
						.setDescription(
							"> The user, <@" +
								target +
								">, **does** have high authority of me!\n\n<@" +
								target +
								"> has authority to request stuff related to me such as investigating an error, report and more!"
						),
				],
				flags: MessageFlags.Ephemeral,
				content: null,
			});
		}
	} catch (e) {
		Logger.error("cmd auth-check", "An error occurred: " + e.message, e);
		return interaction.reply({
			embeds: [
				errEmbed("Unable to check data for this user", e, interaction),
			],
		});
	}
};
