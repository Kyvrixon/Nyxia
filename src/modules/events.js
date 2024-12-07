import path from 'path';
import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import Logger from "../utils/logger.js";
import 'colors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (client) => {
    try {
        let count = 0;
        const eventsPath = path.join(__dirname, '../events');

        const readEventFiles = (dirPath) => {
            return fs.readdirSync(dirPath).reduce((files, file) => {
                const filePath = path.join(dirPath, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    return files.concat(readEventFiles(filePath));
                } else if (file.endsWith('.js') && !file.startsWith("_")) {
                    return files.concat(filePath);
                }
                return files;
            }, []);
        };

        const eventFiles = readEventFiles(eventsPath);
        let errored = 0;

        for (const filePath of eventFiles) {
            try {
                const event = await import(pathToFileURL(filePath).href);
                if (!event.default || !event.default.name || !event.default.init) {
                    const location = filePath.replace(eventsPath, "").replace(/\\/g, " > ").replace(/^ > /, "");
                    Logger.warn("Event Loader", `"${location}" isn't setup correctly`.red);
                    errored++;
                    continue;
                }

                count++;
                if (event.default.once) {
                    client.once(event.default.name, (...args) => event.default.init(client, ...args));
                } else {
                    client.on(event.default.name, (...args) => event.default.init(client, ...args));
                }
            } catch (error) {
                Logger.error("Event Loader", `${error.message}`.red, error);
                errored++;
            }
        }

        Logger.info("Event Loader", `Loaded ${count.toString().green} of ${eventFiles.length.toString().green} (${errored.toString().red} errored)`);
    } catch (e) {
        Logger.error("Event Loader", "An error occurred while loading events", e);
        process.exit(1);
    }
};
