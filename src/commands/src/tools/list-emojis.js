import { createLeaderboard, getEmoji } from "../../../utils/functions.js";

export default async (client, interaction) => {

    const emojiArray = [];
    let currentString = "";
    
    for (const e of client.emoji) { 
        const emoji = getEmoji(e.name);
    
        if (currentString) {
            currentString += ` ${emoji}`; 
        } else {
            currentString = `${emoji}`;
        }
    
        if (currentString.split(" ").length === 5) {
            emojiArray.push(currentString);
            currentString = ""; 
        }
    }
    
    if (currentString) {
        emojiArray.push(currentString);
    }

    return createLeaderboard("Emoji List", emojiArray, interaction, 5, null);
};