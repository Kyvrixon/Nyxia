import chalk from "chalk";

const Logger = {
  /**
   * Log a success message.
   *
   * @param {String} title - Title of the log
   * @param {String} message - Message to log
   */
  success: async (title: string, message: string) => {
    console.log(
      chalk.bold.cyan(`[${title}]`) + chalk.grey(" -> ") + chalk.bold.green(`${message}`)
    );
    return;
  },

  /**
   * Log a warning message.
   *
   * @param {String} title - Title of the log
   * @param {String} message - Message to log
   */
  warn: async (title: string, message: string) => {
    console.warn(
      chalk.bold.yellow(`[${title}]`) + chalk.grey(" -> ") + chalk.bold.yellow(`${message}`)
    );
    return;
  },

  /**
   * Log an info message.
   *
   * @param {String} title - Title of the log
   * @param {String} message - Message to log
   */
  info: async (title: string, message: string) => {
    console.log(
      chalk.bold.blue(`[${title}]`) + chalk.grey(" -> ") + chalk.bold.white(`${message}`)
    );
    return;
  },

  /**
   * Log a debug message if debug is enabled.
   *
   * @param {String} title - Title of the log
   * @param {String} message - Message to log
   */
  debug: async (title: string, message: string) => {
    if (
      !process.env.debug ||
      (process.env.debug !== "yes" && process.env.debug !== "true")
    ) {
      return;
    }
    console.debug(
      chalk.bold.magenta(`[Debug - ${title}]`) +
        chalk.grey(" -> ") +
        chalk.bold.magenta(`${message}`)
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
  error: async (title: string, message: string, error: Error) => {
    console.error(
      chalk.bold.red(`[${title}]`) + chalk.grey(" -> ") + chalk.bold.red(`${message}`)
    );
    return;
  },
};

export default Logger;
