const fs = require("fs");
const { CommandInteraction } = require("discord.js");
const { embedTemplate } = require("../../util/embedUtil");
const { elementsList, getWeaknesses, getResistances, getEmoji, getOpposite } = require("../../util/elementUtil");
const { listifyEN } = require("../../util/textUtil");

const allElements = elementsList();

/**
 * @param {CommandInteraction} interaction
 * @param {...unknown} args
 */
async function executeSubcommand(interaction, ...args) {
	fs.promises.stat("./source/commands/manual/topicelements.js").then(stats => {
		interaction.reply({
			embeds: [
				embedTemplate().setTitle("Elemental Affinity")
					.setDescription(`Each combatant is associated with one of the following elements: ${listifyEN(allElements.map(element => `${element} ${getEmoji(element)}`), true)}. Based on their element, damage they receive may be increased, decreased, or not changed depending on the element of the incoming damage.\n\nWhen a combatant receives damage they're weak to, damage is doubled. When a combatant receives damage they're resistant to, damage is halved. This change is calculated before protection.`)
					.addFields(
						allElements.map(element => {
							const weaknesses = getWeaknesses(element);
							const resistances = getResistances(element);
							return { name: `${getEmoji(element)} ${element}`, value: `Opposite: ${getEmoji(getOpposite(element))}\nWeaknesses: ${weaknesses.length > 0 ? weaknesses.map(weakness => getEmoji(weakness)).join(" ") : "(none)"}\nResistances: ${resistances.length > 0 ? resistances.map(resistance => getEmoji(resistance)).join(" ") : "(none)"}` }
						}).concat({ name: "Matching Element Stagger", value: "When a combatant makes a move that matches their element, their target gets a bonus effect. If the target is an ally, they are relieved of 1 Stagger. If the target is an enemy, they suffer 2 additional Stagger. Check the page on Stagger to learn more about Stagger and Stun." })
					).setTimestamp(stats.mtime)
			],
			ephemeral: true
		});
	})
};

module.exports = {
	data: {
		name: "elemental-affinity",
		description: "Get details about the effects of Combatant's Elemental Affinities"
	},
	executeSubcommand
};
