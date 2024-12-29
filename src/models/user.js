import mongoose from 'mongoose';
import { userFlagValues } from '../utils/general.js';


const bannedFromSchema = new mongoose.Schema(
    {
        cmd: { type: String, required: true, trim: true },
        reason: { type: String, required: true, trim: true },
        appealable: { type: Boolean, required: true }
    },
    { _id: false }
);

const flagsSchema = [
    {
        type: String,
        enum: userFlagValues,
        required: true,
        trim: true
    }
];

const userSchema = new mongoose.Schema(
    {
        // Identifier
        user: { type: String, required: true, unique: true, index: true, trim: true },

        // Flags
        flags: {
            isBannedFrom: {
                type: [bannedFromSchema]
            },
            common: {
                type: [flagsSchema]
            }
        },

        // AFK
        afk: {
            message: { type: String, trim: true },
            time: { type: String }
        },

        // Economy
        eco: {
            inventory: {
                type: [Array]
            },
            cash: {
                bank: {
                    type: Number
                },
                pocket: {
                    type: Number
                }
            }
        }
    },
    {
        timestamps: false,
    }
);

export default mongoose.model('user', userSchema);
