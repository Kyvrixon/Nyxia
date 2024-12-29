import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Discord from 'discord.js';
import Logger from "../utils/logger.js";
import 'colors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (client) => {
    try {
        client.commands = new Discord.Collection();

        let count = 0;
        let errored = 0;
        const commands = [];
        const betaCommands =[];
        const commandsPath = path.join(__dirname, "..", "commands");
        const readCommandFiles = (dirPath) => {
            return fs.readdirSync(dirPath).filter(file => {
                const filePath = path.join(dirPath, file);
                const stat = fs.statSync(filePath);
                return stat.isFile() && file.endsWith('.js') && !file.startsWith('_');
            }).map(file => path.join(dirPath, file));
        };

        const commandFiles = readCommandFiles(commandsPath);

        for (const filePath of commandFiles) {
            try {
                const commandModule = await import("file://" + filePath);
                const command = commandModule.default;
                if (command.data && command.init) {

                    if (command.beta === true) {
                        betaCommands.push(command.data.toJSON());
                        client.commands.set(command.data.name, command);
                        count++;
                        continue;
                    };

                    client.commands.set(command.data.name, command);
                    commands.push(command.data.toJSON());
                    count++;

                } else {
                    throw new Error('Command is not set up correctly');
                }
            } catch (error) {
                console.error(error);
                const location = filePath.replace(commandsPath, '').replace(/\\/g, ' > ').replace(/^ > /, '');
                Logger.warn('Cmd Loader', `"${location}" isn't setup correctly`.red);
                errored++;
            };
        };

        Logger.info('Cmd Loader', `Loaded ${count.toString().green} of ${commandFiles.length.toString().green} (${errored.toString().red} errored)`);

        const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

        try {
            //const emptyArray = [];
            if (!process.env.dev) {
                await rest.put(
                    Routes.applicationCommands("1309736362454421505"),
                    { body: commands }
                );
            } else if (process.env.dev) {
                await rest.put(
                    Routes.applicationGuildCommands(process.env.BOT_ID, "1125196330646638592"),
                    { body: betaCommands }
                );
            }
        return;

        } catch (error) {
            console.log(error)
            Logger.error('Cmd Loader', 'Failed to register', error);
            process.exit(1);
        }
    } catch (error) {
        Logger.error('Cmd Loader', error.message, error);
        process.exit(1);
    }
};
