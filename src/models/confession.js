import mongoose from "mongoose";

const confessionSchema = new mongoose.Schema({
	guildId: { // guild ID
		type: String,
		required: true,
	},

	ID: { // unique confession ID
		type: String,
		required: true,
		index: true,
	},
 
	c: { // content
		type: String,
		required: true,
	},

	author: { // author ID
		type: String,
	},

	meta: { // important stuff
		reported: { // reported by a member?
			type: Boolean,
		},
		deleted: { // taken down by a dev?
			type: Boolean,
		},
		url: { // url of the msg
			type: String,
		},
	},

	createdAt: { 
		type: Date,
		default: Date.now,
		expires: '30d', // deletes the document after roughly 30 days
	},
});

// Export the model
export default mongoose.model("confessModel", confessionSchema);
