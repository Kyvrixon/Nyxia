import mongoose from 'mongoose';

const affiliates = new mongoose.Schema(
    {
        ID: {
            type: String,
            required: true
        },

        meta: {
            addedAt: {
                type: String,
                required: true
            },
            desc: {
                type: String,
                required: true
            }
        },

        // servers who wish to opt out
        optedOutGuilds: {
            type: [String]
        }
    }
)

const guildSchema = new mongoose.Schema(
    {
        ads: {
            affiliates: [affiliates]
        },

        counts: {
            guilds: {
                type: Number, 
                default: 0
            },
            users: {
                type: Number, 
                default: 0
            }
        }
    }
);

export default mongoose.model('Guild', guildSchema);