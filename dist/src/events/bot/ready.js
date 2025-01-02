import Logger from "#utils/logger.ts";
import "colors";
export default {
    name: "ready",
    once: true,
    async init( /* client */) {
        Logger.info("Bot", "Ready!");
        //client.emit("cron-botStats", client);
    },
};
