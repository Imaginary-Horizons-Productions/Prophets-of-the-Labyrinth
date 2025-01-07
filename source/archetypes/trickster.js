const { ArchetypeTemplate } = require("../classes");
const { POTL_ICON_URL, ZERO_WIDTH_WHITESPACE } = require("../constants");
const { getCombatantCounters, modifiersToString } = require("../util/combatantUtil");
const { getEmoji } = require("../util/essenceUtil");

/** @param {Combatant} combatant */
function createModifierField(combatant) {
	const modifiersText = modifiersToString(combatant, adventure);
	embed.addFields({ name: combatant.name, value: modifiersText ? `${modifiersText}` : "No buffs, debuffs, or states", inline: true });
}

module.exports = new ArchetypeTemplate("Trickster",
	["Bard", "Gambler", "Doomsayer", "Dancer"],
	"They'll be able to assess combatant modifiers and random outcomes of moves. Their Deck of Cards will inflict a random amount of @e{Misfortune} on their target.",
	"Wind",
	(embed, adventure) => {
		// Separate Enemies and Delvers into different rows
		adventure.room.enemies.filter(combatant => combatant.hp > 0).forEach(createModifierField);
		embed.addFields({ name: ZERO_WIDTH_WHITESPACE, value: ZERO_WIDTH_WHITESPACE });
		adventure.delvers.forEach(createModifierField);
		if (adventure.room.detectivePredicts.length > 0) {
			embed.addFields({ name: "Random Outcomes", value: `- ${adventure.room.detectivePredicts.join("\n- ")}` });
		}
		return embed.setDescription(`Trickster predictions for Round ${adventure.room.round}:`).setAuthor({ name: "Random outcomes from moves are predicted as if they are the first move to happen.", iconURL: POTL_ICON_URL });
	},
	(combatant) => {
		const weaknesses = getCombatantCounters(combatant);
		return `Weaknesses: ${weaknesses.map(weakness => getEmoji(weakness)).join(" ")}`;
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
