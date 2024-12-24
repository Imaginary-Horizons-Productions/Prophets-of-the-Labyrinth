const fs = require("fs");
const { CommandInteraction } = require("discord.js");
const { embedTemplate } = require("../../util/embedUtil");
const { essenceList, getEmoji, getOpposite } = require("../../util/essenceUtil");
const { listifyEN } = require("../../util/textUtil");
const { getCounteredEssences } = require("../../util/essenceUtil");

const allEssences = essenceList();

/**
 * @param {CommandInteraction} interaction
 * @param {...unknown} args
 */
async function executeSubcommand(interaction, ...args) {
	fs.promises.stat("./source/commands/manual/topicessences.js").then(stats => {
		interaction.reply({
			embeds: [
				embedTemplate().setTitle("Essences")
					.setDescription("Delvers, enemies, labyrinth rooms, and even damage each align with an elemental essence. The essences and their relationships are as follows:")
					.addFields(
						allEssences.map(essence => {
							const counteredEssences = getCounteredEssences(essence);
							return { name: `${getEmoji(essence)} ${essence}`, value: `Opposite: ${getEmoji(getOpposite(essence))}\nCounters: ${counteredEssences.length > 0 ? counteredEssences.map(essence => getEmoji(essence)).join(" ") : "(none)"}`, inline: true }
						}).concat(
							{ name: "Essence Counters", value: `When a combatant takes damage that has an essence that counters their own, they take increased damage based on the assailant's level (this increase is calculated before protection). For example, an Earth ${getEmoji("Earth")} combatant is said to be "countered by" Darkness ${getEmoji("Darkness")} and Fire ${getEmoji("Fire")} because those types of damage are increased against the combatant. Essence Counter damage is equal to <40 + (10 * assailant's level)>, which can then be doubled by Resonance or halved by Dissonance.` },
							{ name: "Essence Opposites", value: `Each essence has an opposite. Essences counter the opposite essences of their opposite (eg Light ${getEmoji("Light")} counters the opposites of Darkness ${getEmoji("Darkness")}'s counters).` },
							{ name: "Essence Match Stagger", value: "When a combatant makes a move that matches their essence, their target gets a bonus effect. If the target is an ally, they are relieved of 1 Stagger. If the target is a foe, they suffer 2 additional Stagger. Check the page on Stagger to learn more about Stagger and Stun." }
						)
					).setTimestamp(stats.mtime)
			],
			ephemeral: true
		});
	})
};

module.exports = {
	data: {
		name: "essences",
		description: "Get details about the Essence Counter and Essence Match Stagger mechanics"
	},
	executeSubcommand
};
