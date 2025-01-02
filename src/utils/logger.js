/* eslint-disable no-console */
import chalk from "chalk";

const Logger = {
	/**
	 * Log a success message.
	 *
	 * @param {string} title - Title of the log
	 * @param {string} message - Message to log
	 */
	success: (title, message) => {
		console.log(
			chalk.bold.cyan(`[${title}]`) +
				chalk.grey(" > ") +
				chalk.bold.green(message)
		);
		return;
	},

	/**
	 * Log a warning message.
	 *
	 * @param {string} title - Title of the log
	 * @param {string} message - Message to log
	 */
	warn: (title, message) => {
		console.warn(
			chalk.bold.yellow(`[${title}]`) +
				chalk.grey(" > ") +
				chalk.bold.yellow(message)
		);
		return;
	},

	/**
	 * Log an info message.
	 *
	 * @param {string} title - Title of the log
	 * @param {string} message - Message to log
	 */
	info: (title, message) => {
		console.log(
			chalk.bold.blue(`[${title}]`) +
				chalk.grey(" > ") +
				chalk.bold.white(message)
		);
		return;
	},

	/**
	 * Log a debug message if debug is enabled.
	 *
	 * @param {string} title - Title of the log
	 * @param {string} message - Message to log
	 */
	debug: (title, message) => {
		if (
			!process.env.debug ||
			(process.env.debug !== "yes" && process.env.debug !== "true")
		) {
			return;
		}
		console.log(
			chalk.bold.magenta(`[Debug - ${title}]`) +
				chalk.grey(" > ") +
				chalk.bold.magenta(message)
		);
		return;
	},

	/**
	 * Log an error message.
	 *
	 * @param {string} title - Title of the log
	 * @param {string} message - Message to log
	 * @param {Error | null} error - The error object to log
	 */
	error: (title, message, error) => {
		// ill prob do somethin with the error anyway prob
		// send to my api to log for later debugging idk

		if (!error) {
			console.error(
				chalk.bold.red("[Logger]") +
					chalk.grey(" > ") +
					chalk.bold.red("No error object was provided")
			);
			return Promise.reject("No error object provided");
		} else if (!(error instanceof Error)) {
			console.error(
				chalk.bold.red("[Logger]") +
					chalk.grey(" > ") +
					chalk.bold.red(
						"Provided error object is not an instance of Error"
					)
			);
			return Promise.reject(
				"Provided error object is not an instance of Error"
			);
		}

		console.error(
			chalk.bold.red(`[${title}]`) +
				chalk.grey(" > ") +
				chalk.bold.red(message)
		);
		return;
	},
};

export default Logger;
