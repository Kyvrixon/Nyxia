import "discord.js";
import {Collection} from "discord.js"

declare module "discord.js" {
    interface Message {
        bot: Boolean;
    }

    interface Client {
        commands: Collection<string, string | object>
        emoji: Array<string>
    }
}