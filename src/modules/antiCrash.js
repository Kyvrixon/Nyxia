import Logger from "#utils/logger.js";

import chalk from "chalk";

export default async () => {
	process.on("unhandledRejection", (reason /*, promise */) => {
		Logger.error(
			"Unhandled Rejection",
			chalk.red(reason.toString()),
			reason
		);
	});

	process.on("uncaughtException", async (err, origin) => {
		Logger.error("Uncaught Exception", `Error: ${err.toString().red}`, err);
		if (origin) {
			Logger.info("Exception Origin", origin);
		}
	});

	process.on("uncaughtExceptionMonitor", async (err, origin) => {
		Logger.warn(
			"Uncaught Exception Monitor",
			`Error: ${err.toString().yellow}`,
			err
		);
		if (origin) {
			Logger.info("Exception Origin", origin);
		}
	});

	process.on("warning", async (warn) => {
		Logger.warn(
			"Warning",
			`Warning: ${warn.name} ${warn.message} ${warn.stack.yellow}`
		);
	});
};
