import Logger from "../utils/logger.js";
import "colors";

export default async () => {
    process.on("unhandledRejection", (reason, promise) => {
        console.log(" ");
        console.log(reason)
        Logger.error("Unhandled Rejection", reason.toString().red, reason);
    });

    process.on("uncaughtException", async (err, origin) => {
        console.log(err);
        await Logger.error("Uncaught Exception", `Error: ${err.toString().red}`, err);
        if (origin) {
            await Logger.info("Exception Origin", origin);
        }
    });

    process.on("uncaughtExceptionMonitor", async (err, origin) => {
        await Logger.warn("Uncaught Exception Monitor", `Error: ${err.toString().yellow}`, err);
        if (origin) {
            await Logger.info("Exception Origin", origin);
        }
    });

    process.on("warning", async (warn) => {
        await Logger.warn("Warning", `Warning: ${warn.name} ${warn.message} ${warn.stack.yellow}`);
    });
};
