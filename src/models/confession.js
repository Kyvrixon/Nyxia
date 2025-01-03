import mongoose from "mongoose";

const confessionSchema = new mongoose.Schema({
	guildId: {
		type: String,
		required: true,
	},

	ID: {
		type: String,
		required: true,
		index: true,
	},

	meta: {
		reported: {
			type: Boolean,
		},
		deleted: {
			type: Boolean,
		},
		url: {
			type: String,
		},
	},
});

export default mongoose.model("confessions", confessionSchema);
