const { ArchetypeTemplate } = require("../classes");
const { POTL_ICON_URL, ZERO_WIDTH_WHITESPACE } = require("../constants");
const { modifiersToString } = require("../util/combatantUtil");

module.exports = new ArchetypeTemplate("Trickster",
	["Bard", "Gambler", "Doomsayer", "Dancer"],
	"A Trickster can assess combatant modifiers and random outcomes of moves.",
	"Their Deck of Cards will inflict a random amount of @e{Misfortune} on their target.",
	"Wind",
	(embed, adventure) => {
		/** @param {Combatant} combatant */
		function createModifierField(combatant) {
			const modifiersText = modifiersToString(combatant, adventure, 0);
			embed.addFields({ name: combatant.name, value: modifiersText ? `${modifiersText}` : "No buffs, debuffs, or states", inline: true });
		}

		// Separate Enemies and Delvers into different rows
		adventure.room.enemies.filter(combatant => combatant.hp > 0).forEach(createModifierField);
		embed.addFields({ name: ZERO_WIDTH_WHITESPACE, value: ZERO_WIDTH_WHITESPACE });
		adventure.delvers.forEach(createModifierField);
		if (adventure.room.randomOutcomesPredicts.length > 0) {
			embed.addFields({ name: "Random Outcomes", value: `- ${adventure.room.randomOutcomesPredicts.join("\n- ")}` });
		}
		return embed.setDescription(`Trickster predictions for Round ${adventure.room.round}:`).setAuthor({ name: "Random outcomes from moves are predicted as if they are the first move to happen.", iconURL: POTL_ICON_URL });
	},
	(combatant) => {
		return `Misfortune Stacks: ${combatant.modifiers.Misfortune ?? 0}`;
	},
	{
		base: "Deck of Cards",
		Gambler: "Omenous Deck of Cards",
		Dancer: "Evasive Deck of Cards",
		Bard: "Tormenting Deck of Cards",
		Doomsayer: "Numbing Deck of Cards"
	},
	["Smokescreen"],
	{
		maxHPGrowth: 25,
		powerGrowth: 5,
		speedGrowth: 1,
		critRateGrowth: 0.25
	}
);
