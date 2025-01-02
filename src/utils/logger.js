import "colors";

const Logger = {
	/**
	 * Log a success message.
	 *
	 * @param {String} title - Title of the log
	 * @param {String} message - Message to log
	 */
	success: async (title, message) => {
		console.log(
			`[${title}]`.bold.cyan + " -> ".grey + `${message}`.bold.green
		);
		return;
	},

	/**
	 * Log a warning message.
	 *
	 * @param {String} title - Title of the log
	 * @param {String} message - Message to log
	 */
	warn: async (title, message) => {
		console.warn(
			`[${title}]`.bold.yellow + " -> ".grey + `${message}`.bold.yellow
		);
		return;
	},

	/**
	 * Log an info message.
	 *
	 * @param {String} title - Title of the log
	 * @param {String} message - Message to log
	 */
	info: async (title, message) => {
		console.log(
			`[${title}]`.bold.blue + " -> ".grey + `${message}`.bold.white
		);
		return;
	},

	/**
	 * Log a debug message if debug is enabled.
	 *
	 * @param {String} title - Title of the log
	 * @param {String} message - Message to log
	 */
	debug: async (title, message) => {
		if (
			!process.env.debug ||
			process.env.debug !== "yes" ||
			process.env.debug !== "true"
		) {
			return;
		}
		console.log(
			`[Debug - ${title}]`.bold.magenta +
				" -> ".grey +
				`${message}`.bold.magenta
		);
		return;
	},

	/**
	 * Log an error message.
	 *
	 * @param {String} title - Title of the log
	 * @param {String} message - Message to log
	 * @param {Error} error - The error object to log
	 */
	error: async (title, message, error) => {
		if (!error) {
			console.error(
				"[Logger]".bold.red +
					" -> ".grey +
					"No error object was provided".bold.red
			);
			return Promise.reject("No error object provided");
		} else if (!(error instanceof Error)) {
			console.error(
				"[Logger]".bold.red +
					" -> ".grey +
					"Provided error object is not an instance of Error".bold.red
			);
			return Promise.reject(
				"Provided error object is not an instance of Error"
			);
		}

		console.error(
			`[${title}]`.bold.red + " -> ".grey + `${message}`.bold.red
		);
		return;
	},
};

export default Logger;
