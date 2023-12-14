const { CommandInteraction } = require("discord.js");
const { embedTemplate } = require("../../util/embedUtil");
const { elementsList, getWeaknesses, getResistances, getEmoji } = require("../../util/elementUtil");

const matchingElementStaggerField = { name: "Matching Element Stagger", value: "When a combatant makes a move that matches their element, their target gets a bonus effect. If the target is an ally, they are relieved of 1 Stagger. If the target is an enemy, they suffer 2 additional Stagger. Check the page on Stagger to learn more about Stagger and Stun." };
const allElements = elementsList();

/**
 * @param {CommandInteraction} interaction
 * @param {...unknown} args
 */
async function executeSubcommand(interaction, ...args) {
	switch (interaction.options.getString("topic")) {
		case "Tutorial":
			interaction.reply({
				embeds: [
					embedTemplate().setTitle("Prophets of the Labyrinth Tutorial")
						.setDescription("Prophets of the Labyrinth (or PotL) is a multiplayer roguelike dungeon crawl played directly on Discord. Each dungeon delve will start a new thread where players can discuss their strategies and votes.")
						.addFields([
							{ name: "Voting", value: "During an adventure, your team will explore deeper and deeper rooms of a labyrinth. After the events of each room, the party will vote on which room to explore next. The party must reach a consensus to continue (discussing your reasoning encouraged)." },
							{ name: "Combat", value: "If you encounter enemies (such as during the Final Battle in the last room), each player will be prompted to pick a move to do during the next turn. When everyone has selected their move, the game will report the results. Each character archetype starts with different gear and, importantly, predicts different information about the upcoming round. Make sure to share your relevant info with everyone!" },
							{ name: "Suggested Party Size", value: "Though the game has player count scaling, it is balanced primarily for groups of 3-6. Due to UI limitations, the max party size is 8. ***It is highly recommended that you play in a party.***" }
						])
				],
				ephemeral: true
			});
			break;
		case "Elements":
			interaction.reply({
				embeds: [
					embedTemplate().setTitle("Elements")
						.setDescription(`Each combatant is associated with one of the following elements: ${listifyEN(allElements.map(element => `${element} ${getEmoji(element)}`))}. Based on their element, damage they receive may be increased, decreased, or not changed depending on the element of the incoming damage.\n\nWhen a combatant receives damage they're weak to, damage is doubled. When a combatant receives damage they're resistant to, damage is halved. This change is calculated before block.`)
						.addFields(
							allElements.map(element => {
								const weaknesses = getWeaknesses(element);
								const resistances = getResistances(element);
								return { name: `${getEmoji(element)} ${element}`, value: `Opposite: ${getEmoji(getOpposite(element))}\nWeaknesses: ${weaknesses.length > 0 ? weaknesses.map(weakness => getEmoji(weakness)).join(" ") : "(none)"}\nResistances: ${resistances.length > 0 ? resistances.map(resistance => getEmoji(resistance)).join(" ") : "(none)"}` }
							}).concat(matchingElementStaggerField)
						)
				],
				ephemeral: true
			});
			break;
		case "Stagger":
			interaction.reply({
				embeds: [
					embedTemplate().setTitle("Stagger")
						.setDescription("Stagger stacks up on combatants when moves are used against them, leading to the combatant getting Stunned. Stagger promotes to Stun between rounds when a combatant's Stagger reaches their Poise (default 6 for delvers, varies for enemies). A stunned combatant misses their turn next round.")
						.addFields(matchingElementStaggerField)
				],
				ephemeral: true
			});
			break;
		case "Damage Cap":
			interaction.reply({
				embeds: [
					embedTemplate().setTitle("Damage Cap")
						.setDescription("The maximum amount of damage that can be done in one shot after block is 500. This cap is raised for each stack of Power Up a user has.")
				],
				ephemeral: true
			});
			break;
	}
};

module.exports = {
	data: {
		name: "glossary",
		description: "Get info about individual topics",
		optionsInput: [
			{
				type: "String",
				name: "topic",
				description: "Your topic of interest",
				required: true,
				choices: [
					{ name: "Tutorial", value: "Tutorial" },
					{ name: "Elements", value: "Elements" },
					{ name: "Stagger", value: "Stagger" },
					{ name: "Damage Cap", value: "Damage Cap" }
				]
			},
		]
	},
	executeSubcommand
};
