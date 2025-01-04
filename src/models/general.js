import mongoose from "mongoose";

const affiliates = new mongoose.Schema({
	ID: {
		type: String,
		required: true,
	},

	meta: {
		addedAt: {
			type: String,
			required: true,
		},
		desc: {
			type: String,
			required: true,
		},
	},

	// servers who wish to opt out
	optedOutGuilds: {
		type: [String],
	},
});

const banSchema = new mongoose.Schema({
	ID: { type: String, required: true, index: true },
	reason: { type: String, required: true },
	appealable: { type: Boolean, required: true },
});

const Schema = new mongoose.Schema({
	ads: {
		affiliates: [affiliates],
	},

	guildBans: {
		type: [banSchema],
		default: [],
	},
});

export default mongoose.model("generalModel", Schema);
