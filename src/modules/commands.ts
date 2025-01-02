import { REST, Routes, Client } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Discord from "discord.js";
import Logger from "#utils/logger.ts";
import "colors";
import "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (client: Client, sfx: Boolean) => {
	try {
		client.commands = new Discord.Collection();

		let count = 0;
		let errored = 0;
		const commands = [];
		const commandsPath = path.join(__dirname, "..", "commands");
		const readCommandFiles = (dirPath: string) => {
			return fs
				.readdirSync(dirPath)
				.filter((file) => {
					const filePath = path.join(dirPath, file);
					const stat = fs.statSync(filePath);
					return (
						stat.isFile() &&
						file.endsWith(".js") &&
						!file.startsWith("_")
					);
				})
				.map((file) => path.join(dirPath, file));
		};

		const commandFiles = readCommandFiles(commandsPath);

		for (const filePath of commandFiles) {
			try {
				let fp = "";
				if (sfx) {
					const path = filePath + `?update=${new Date(Date.now())}`;
					fp = new URL(path, import.meta.url).href;
				} else {
					fp = filePath;
				}
				const commandModule = await import("file://" + fp);
				const command = commandModule.default;
				if (command.data && command.init) {
					await client.commands.set(command.data.name, command);
					commands.push(command.data.toJSON());
					count++;
				} else {
					throw new Error("Command is not set up correctly");
				}
			} catch (error) {
				console.error(error);
				const location = filePath
					.replace(commandsPath, "")
					.replace(/\\/g, " > ")
					.replace(/^ > /, "");
				Logger.warn(
					"Cmd Loader",
					`"${location}" isn't setup correctly`.red
				);
				errored++;
			}
		}

		if (sfx) {
			return true;
		}

		Logger.info(
			"Cmd Loader",
			`Loaded ${count.toString().green} of ${commandFiles.length.toString().green} (${errored.toString().red} errored)`
		);

		const rest = new REST({ version: "10" }).setToken(
			process.env.BOT_TOKEN as string
		);
		try {
			if (!process.env.dev) {
				await rest.put(Routes.applicationCommands(process.env.BOT_ID as string), {
					body: commands,
				});
				return;
			}

			await rest.put(
				Routes.applicationGuildCommands(
					process.env.BOT_ID as string,
					"1125196330646638592"
				),
				{ body: commands }
			);
			return;
		} catch (error) {
			console.log(error);
			Logger.error("Cmd Loader", "Failed to register", error);
			if (sfx && sfx !== true) {
				process.exit(1);
			} else {
				return false;
			}
		}
	} catch (error) {
		Logger.error("Cmd Loader", error.message, error);
		if (sfx && sfx !== true) {
			process.exit(1);
		} else {
			return false;
		}
	}
};
