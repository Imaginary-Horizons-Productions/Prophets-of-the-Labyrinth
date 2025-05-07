const fs = require("fs");
const { MessageFlags } = require("discord.js");
const { embedTemplate } = require("../../util/embedUtil");
const { SubcommandWrapper } = require("../../classes");

module.exports = new SubcommandWrapper("beginners-guide", "Learn or review the basics of the game!",
	async function executeSubcommand(interaction, ...args) {
		fs.promises.stat(__filename).then(stats => {
			interaction.reply({
				embeds: [
					embedTemplate().setTitle("Prophets of the Labyrinth Tutorial")
						.setDescription("Prophets of the Labyrinth (or PotL) is a multiplayer rogue-lite dungeon crawl played directly on Discord. Each dungeon delve will start a new thread where players can discuss their strategies and votes.")
						.addFields(
							{ name: "Suggested Party Size", value: "PotL is balanced primarily for groups of 3-5. Due to UI limitations, the max party size is 8. ***It is highly recommended that you play in a party.***\n\nExtra players bring an extra life and 50g to the party, but also increase enemy HP and reinforcements." },
							{ name: "Voting", value: "During an adventure, your team will explore deeper and deeper rooms of a labyrinth. After the events of each room, the party will vote on which room to explore next. The party must reach a consensus to continue (discussing your reasoning encouraged)." },
							{ name: "Combat", value: "When you encounter enemies, each player will be prompted to pick a move to do during the next turn. When everyone has selected their move, the game will report the results. Each character archetype starts with different gear and, importantly, predicts different information about the upcoming round (eg enemy HP or who's going to Critically Hit). Make sure to share your relevant info with everyone!" }
						).setTimestamp(stats.mtime)
				],
				flags: [MessageFlags.Ephemeral]
			});
		})
	}
);
