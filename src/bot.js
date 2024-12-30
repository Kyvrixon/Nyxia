import dotenv from "dotenv";
import "colors";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Logger from "./utils/logger.js";
import model from "./models/user.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const intCache = new Map();

export const client = new Client({
    partials: [
        Partials.Channel,
        Partials.Message,
    ],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
    ],
});

async function loadModules() {
    async function getAllFiles(dirPath, arrayOfFiles) {
        const files = fs.readdirSync(dirPath);
        arrayOfFiles = arrayOfFiles || [];
        for (const file of files) {
            if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
                arrayOfFiles = await getAllFiles(path.join(dirPath, file), arrayOfFiles);
            } else {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        }
        return arrayOfFiles;
    }
    const moduleFiles = await getAllFiles(path.join(__dirname, "modules"));
    for (const file of moduleFiles) {
        if (file.endsWith(".js") && !path.basename(file).startsWith("_") && !["database.js", "functions.js"].includes(path.basename(file))) {
            const module = await import(`file://${file}`);
            await module.default(client);
            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            await delay(100);
        }
    }
}

async function start() {
    console.clear();
    Logger.info("Init", "Starting...");

    const startTime = Date.now();
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf-8"));
    client.package = packageJson;
    const databaseModule = await import(`file://${path.join(__dirname, "modules", "database.js")}`);
    await databaseModule.default();
    await loadModules();
    const data = await model.findOne({
        user: "981755777754755122"
    }).exec();
    if (!data) {
        const newSave = new model(
            {
                user: "981755777754755122",
                flags: {
                    common: ["dev"]
                }
            }
        );
        await newSave.save();
    }

    await client.login(process.env.BOT_TOKEN);

    const endTime = Date.now();
    Logger.info("Init", "Completed in " + `${parseInt((endTime - startTime) / 1000)}s`.green);
}

start();
