import { emojisList } from "../utils/general.js";
import Logger from "../utils/logger.js";

export default async (client) => {
  Logger.info("Emoji Uploader", "Began uploading emojis...");

  try {
    const response = await fetch(`https://discord.com/api/v10/applications/${process.env.BOT_ID}/emojis`, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      Logger.error("Emoji Uploader", "Failed to fetch emojis: " + error.message, error);
      return;
    }

    const existingEmojisResponse = await response.json();
    const existingEmojis = existingEmojisResponse.items || [];

    if (!Array.isArray(existingEmojis)) {
      Logger.error("Emoji Uploader", "Expected an array of emojis but got: " + JSON.stringify(existingEmojis));
      return;
    }

    if (existingEmojis.length === 0) {
      Logger.info("Emoji Uploader", "No existing emojis found. Uploading all emojis from emojisList.");
    }

    const existingNames = new Set(existingEmojis.map(emoji => emoji.name));
    const uniqueEmojis = {};

    if (existingEmojis.length > 0) {
      for (const emojiName in emojisList) {
        if (!existingNames.has(emojiName)) {
          uniqueEmojis[emojiName] = emojisList[emojiName];
        }
      }

    } else {
      Object.assign(uniqueEmojis, emojisList);

    }

    if (Object.keys(uniqueEmojis).length > 0) {
      for (const emojiName in uniqueEmojis) {
        const emojiUrl = uniqueEmojis[emojiName];

        try {
          const imageResponse = await fetch(emojiUrl);

          if (!imageResponse.ok) {
            Logger.error("Emoji Uploader", `Failed to fetch image for ${emojiName}: ${imageResponse.statusText}`);
            continue;
          }

          const imageBuffer = await imageResponse.arrayBuffer();
          const base64Image = Buffer.from(imageBuffer).toString('base64');

          const uploadResponse = await fetch(`https://discord.com/api/v10/applications/${process.env.BOT_ID}/emojis`, {
            method: 'POST',
            headers: {
              Authorization: `Bot ${process.env.BOT_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: emojiName,
              image: `data:image/png;base64,${base64Image}`,
            }),
          });

          if (!uploadResponse.ok) {
            const error = await uploadResponse.json();
            Logger.error("Emoji Uploader", `Failed to upload emoji ${emojiName}: ${error.message}`, error);
          }
        } catch (imageFetchError) {
          Logger.error("Emoji Uploader", `Failed to fetch image for ${emojiName}: ${imageFetchError.message}`, imageFetchError);
        }
      }
    }

    const response1 = await fetch(`https://discord.com/api/v10/applications/${process.env.BOT_ID}/emojis`, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
    });

    if (!response1.ok) {
      const error = await response1.json();
      Logger.error("Emoji Uploader", "Failed to fetch emojis: " + error.message, error);
      return;
    }

    const existingEmojisResponse1 = await response1.json();
    const existingEmojis1 = existingEmojisResponse1.items || [];

    client.emoji = existingEmojis1;

    Logger.info("Emoji Uploader", "All emojis uploaded successfully!");
  } catch (error) {
    Logger.error("Emoji Uploader", "An error occurred: " + error.message, error);
  }
};