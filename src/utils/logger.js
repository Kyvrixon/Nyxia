import 'colors';

export default class Logger {
    
    static async success(title, message) {
        console.log(`[${title}]`.bold.cyan + " -> ".grey + `${message}`.bold.green);
        return Promise.resolve();
    }

    static async warn(title, message) {
        console.warn(`[${title}]`.bold.yellow + " -> ".grey + `${message}`.bold.yellow);
        return Promise.resolve();
    }

    static async info(title, message) {
        console.log(`[${title}]`.bold.blue + " -> ".grey + `${message}`.bold.white);
        return Promise.resolve();
    }

    static async debug(title, message) {
        if (!process.env.debug || process.env.debug !== "yes" || process.env.debug !== "true") return;

        console.log(`[Debug - ${title}]`.bold.magenta + " -> ".grey + `${message}`.bold.magenta);
        return Promise.resolve();
    }

    static async error(title, message, error) {

        if (!error) {
            console.error(`[Logger]`.bold.red + " -> ".grey + "No error object was provided".bold.red);
            return Promise.reject("No error object provided");
        } else if (!(error instanceof Error)) {
            console.error(`[Logger]`.bold.red + " -> ".grey + "Provided error object is not an instance of Error".bold.red);
            return Promise.reject("Provided error object is not an instance of Error");
        }

        console.error(`[${title}]`.bold.red + " -> ".grey + `${message}`.bold.red);

        return Promise.resolve();
    }
};
