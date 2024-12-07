import mongoose from 'mongoose';
import Logger from "../utils/logger.js";
import model from "../models/user.js";

export default async () => {
    /*
    const connection = mongoose.connection;

    connection.on('connected', () => Logger.info('Database', 'Connected'));
    connection.on('open', () => Logger.info('Database', 'Connection open'));
    connection.on('disconnected', () => Logger.warn('Database', 'Disconnected'));
    connection.on('reconnected', () => Logger.info('Database', 'Reconnected'));
    connection.on('disconnecting', () => Logger.warn('Database', 'Disconnecting'));
    connection.on('close', () => Logger.info('Database', 'Connection closed'));
    */
    try {
        //Logger.info("Database", "Attempting connection...");
        await mongoose.connect(process.env.DB_URL);
        Logger.info("Database", "Connected!");
    } catch (e) {
        console.log(e);
        Logger.error("Database", "Failed to connect", e);
        process.exit(1);
    }
};
