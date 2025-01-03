import { EmbedBuilder, AttachmentBuilder } from "discord.js";
import userModel from "#models/user.js";
import { footer } from "#utils/functions.js";

export default async (client, interaction) => {
	const models = [
		userModel,
		//confessionsModel,
	];
	const value = interaction.user.id;
	const fileName = "user-" + interaction.user.id;

	async function downloadData(models, value) {
		const data = {};
		for (const model of models) {
			const documents = await model.find({ user: value }).exec();
			data[model.modelName] = documents;
		}
		return data;
	}

	async function createAttachment(data, name) {
		const json = JSON.stringify(data, null, 2);
		const buffer = Buffer.from(json, "utf-8");
		return new AttachmentBuilder(buffer, { name: name + ".json" });
	}

	await interaction.deferReply({ withResponse: true });
	await interaction.editReply(
		"Fetching data please wait...\n-# Please keep an eye on this message!"
	);

	const data = await downloadData(models, value);
	const attachment = await createAttachment(data, fileName);
	const embed = new EmbedBuilder()
		.setTitle("🗃️ Your User Data")
		.setDescription(
			"> Here is all of your user data that has been collected by the bot. This is confusing to read but this is all the data we have on you. If you would like to partially or completely delete this data, please contact us."
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
			"It appears your dms are closed. Please allow messages from server members before trying again!"
		);
		return;
	}
	await interaction.editReply("Please check your dms for your data!");
};
