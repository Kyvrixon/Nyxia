import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        user: { type: String, index: true, required: true },

        flags: {
            isBannedFrom: {
                type: [
                    {
                        cmd: { type: "String", required: true },
                        reason: { type: String, required: true },
                        appealable: { type: Boolean, required: true }
                    }
                ],
                default: undefined // This prevents assigning an empty array by default
            },
            common: { type: [String], default: undefined }
        },

        afk: {
            message: { type: String },
            time: { type: Date }
        }

    }
);

export default mongoose.model('User', userSchema);