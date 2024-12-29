import userModel from "../../models/user.js";

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
        } else
            if (data && data.afk) {
                return true;
            }
    },

    /**
     * Set the AFK status for a user
     * 
     * @param {Object} user - User object
     */
    set: async (user, time, msg) => {
        const data = await userModel.findOne({ user: user.id });

        if (!data) {
            const newData = new userModel({
                user: user.id,
                afk: {
                    message: msg,
                    time: time
                }
            });
            await newData.save();
        } else
            if (data) {
                data.afk = {
                    message: msg,
                    time: time
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
        const data = await userModel.findOne({ user: user.id });

        if (!data || !data.afk) {
            return;
        }

        data.afk = {};
        await data.save();

        return;
    }
};

export default AFK;
