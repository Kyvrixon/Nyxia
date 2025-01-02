import { EmbedBuilder, AttachmentBuilder, MessageFlags } from "discord.js";
import guildModel from "#models/guild.js";
import { footer } from "#utils/functions.js";
import { errEmbed } from "#utils/embeds.js";

export default async (client, interaction) => {
	const model = [guildModel];
	const value = interaction.guild.id;
	const fileName = "server-" + interaction.guild.id;

	async function downloadData(models, value) {
		const data = {};
		for (const model of models) {
			const documents = await model.findOne({ guild: value }).exec();
			data[model.modelName] = documents;
		}
		return data;
	}

	async function createAttachment(data, name) {
		const json = JSON.stringify(data, null, 2);
		const buffer = Buffer.from(json, "utf-8");
		return new AttachmentBuilder(buffer, { name: name + ".json" });
	}

	if (interaction.guild.ownerId !== interaction.user.id) {
		return interaction.reply({
			embeds: [
				errEmbed(
					"You must be the server owner to use this!",
					null,
					interaction
				),
			],
			flags: MessageFlags.Ephemeral,
		});
	}

	await interaction.deferReply({ fetchReply: true });
	await interaction.editReply(
		"Fetching data please wait...\n-# Please keep an eye on this message!"
	);

	const data = await downloadData(model, value);
	const attachment = await createAttachment(data, fileName);
	const embed = new EmbedBuilder()
		.setTitle("🗃️ Your Server Data")
		.setDescription(
			"> Here is all of your server data that has been collected by the bot. This is confusing to read but this is all the data we have on you. If you would like to partially or completely delete this data, please contact us."
		)
		.setFooter(footer())
		.setColor("DarkButNotBlack");
	try {
		await interaction.user.send({
			content: null,
			embeds: [embed],
			files: [attachment],
		});
	} catch {
		await interaction.editReply(
			"I couldn't send you a DM, please make sure your DMs are open."
		);
		return;
	}
	await interaction.editReply("I have sent you a DM with the data.");
};
