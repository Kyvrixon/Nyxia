import mongoose from "mongoose";

const guildSchema = new mongoose.Schema(
    {
        guild: { type: String, index: true, required: true },

        flags: {
            isPremium: { type: Boolean, default: false },
            isBanned: { type: Boolean, default: false }
        },

        configs: {
            general: {
                mainChat: { type: String },
                mainRole: { type: String }
            },
            confess: {
                channel: { type: String },
                logs: {
                    enabled: { type: Boolean },
                    channel: { type: String }
                }
            }
        }
    }
);

export default mongoose.model("guild", guildSchema);