import AFK from "./afk.js";
import { basicEmbed } from "../embeds.js";

export const afkHandler = async (client, message) => {
	if (message.author.id === client.user.id) {
		return;
	}

	let msg1;

	async function a() {
		// Self AFK check
		const isInAfk = await AFK.check(message.author);
		if (isInAfk.message) {
			try {
				msg1 = await message.channel.send({
					embeds: [
						basicEmbed(
							null,
							"You was AFK since <t:" +
								Math.floor(isInAfk.time / 1000) +
								":R> with the reason: **" +
								isInAfk.message +
								"**",
							null,
							"Green",
							{
								name:
									"Welcome back, " +
									message.author.username +
									"!",
								iconURL: message.author.displayAvatarURL({
									dynamic: true,
								}),
							},
							"This msg will autodelete in 15s",
							null,
							null,
							null
						),
					],
				});
			} catch {}

			await AFK.clear(message.author);

			if (msg1) {
				setTimeout(async () => {
					try {
						await msg1.delete();
					} catch {}
				}, 15000);
			}

			return;
		}
	}

	async function b() {
		let msg2;
		// Mentioned users AFK check
		for (const u of message.mentions.users.values()) {
			// prevent self pinging
			if (u.id === message.author.id) {
				continue;
			}

			if (
				!message.content.includes("@here") &&
				!message.content.includes("@everyone")
			) {
				const isAFK = await AFK.check(u);
				if (isAFK.message) {
					msg2 = await message.channel.send({
						embeds: [
							basicEmbed(
								null,
								`**Reason:** ${isAFK.message}\n**Since:** <t:${Math.floor(isAFK.time / 1000)}:R>`,
								null,
								"DarkButNotBlack",
								{
									name: u.username + " is currently AFK!",
									iconURL: u.displayAvatarURL({
										dynamic: true,
									}),
								},
								"This msg will autodelete in 15 seconds",
								new Date().now
							),
						],
					});

					if (msg2) {
						setTimeout(async () => {
							try {
								await msg2.delete();
							} catch (error) {
								console.error("Error deleting message:", error);
							}
						}, 15000);
					}
				}
			}
		}
	}

	await Promise.all([a(), b()]);
	return;
};
