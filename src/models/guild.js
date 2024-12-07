import mongoose from 'mongoose';

const guildSchema = new mongoose.Schema(
    {
        guild: { type: String, index: true, required: true },

        flags: {
            isBannedFrom: { type: [String] },
            isPremium: { type: Boolean }
        },

        config: {
            general: {
                main_chat: { type: String },
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

export default mongoose.model('Guild', guildSchema);