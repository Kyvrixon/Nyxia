import userModel from "../models/user.js";

const AFK = {
	/**
	 * Check the AFK status for a user
	 *
	 * @param {Object} user - User object
	 */
	check: async (user) => {
		const data = await userModel.findOne({ user: user.id });

		if (!data || !data.afk) {
			return false;
		} else if (data && data.afk) {
			return data.afk;
		}
	},

	/**
	 * Set the AFK status for a user.
	 *
	 * @param {Object} user - User object
	 * @param {Date} time - Date
	 * @param {String} - Message
	 */
	set: async (user, time, msg) => {
		const data = await userModel.findOne({ user: user.id });

		if (!data) {
			const newData = new userModel({
				user: user.id,
				afk: {
					message: msg,
					time: time,
				},
			});
			await newData.save();
		} else if (data && (data.afk || !data.afk)) {
			data.afk = {
				message: msg,
				time: time,
			};

			await data.save();
		}

		return;
	},

	/**
	 * Clear the AFK status for a user
	 *
	 * @param {Object} user - User object
	 */
	clear: async (user) => {
		await userModel.updateOne({ user: user.id }, { $unset: { afk: "" } });
		return;
	},
};

export default AFK;
